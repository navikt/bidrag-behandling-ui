import {
    AktivereGrunnlagRequestV2,
    AktivereGrunnlagResponseV2,
    AndreVoksneIHusstandenGrunnlagDto,
    ArbeidsforholdGrunnlagDto,
    BarnDto,
    BehandlingDtoV2,
    BeregningValideringsfeil,
    DelberegningSamvaersklasse,
    FaktiskTilsynsutgiftDto,
    GebyrRolleDto,
    HusstandsmedlemGrunnlagDto,
    OppdaterBeregnTilDatoRequestDto,
    OppdatereBegrunnelseRequest,
    OppdatereBoforholdRequestV2,
    OppdatereBoforholdResponse,
    OppdatereInntektRequest,
    OppdatereInntektResponse,
    OppdaterePrivatAvtaleBegrunnelseRequest,
    OppdaterePrivatAvtaleRequest,
    OppdaterePrivatAvtaleResponsDto,
    OppdatereUnderholdResponse,
    OppdatereUtgiftRequest,
    OppdatereUtgiftResponse,
    OppdatereVirkningstidspunkt,
    OppdaterGebyrDto,
    OppdaterManuellVedtakRequest,
    OppdaterOpphorsdatoRequestDto,
    OppdaterParagraf35CDetaljerDto,
    OppdaterSamvaerDto,
    OppdaterSamvaerResponsDto,
    OpplysningerType,
    OpprettUnderholdskostnadBarnResponse,
    ResultatBarnebidragsberegningPeriodeDto,
    RolleDto,
    Rolletype,
    SamvaerskalkulatorDetaljer,
    SivilstandAktivGrunnlagDto,
    SivilstandIkkeAktivGrunnlagDto,
    SjekkForholdmessigFordelingResponse,
    SletteSamvaersperiodeElementDto,
    SletteUnderholdselement,
    StonadTilBarnetilsynAktiveGrunnlagDto,
    StonadTilBarnetilsynDto,
    TilleggsstonadDto,
} from "@api/BidragBehandlingApiV1";
import { VedtakNotatDto as NotatPayload } from "@api/BidragDokumentProduksjonApi";
import { ForelderBarnRelasjon, PersonDto } from "@api/PersonApi";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { FantIkkeVedtakEllerBehandlingError } from "@commonTypes/apiStatus";
import {
    VedtakBarnebidragBeregningResult,
    VedtakBeregningResult,
    VedtakSærbidragBeregningResult,
} from "@commonTypes/vedtakTypes";
import { LoggerService, RolleTypeFullName } from "@navikt/bidrag-ui-common";
import { useMutation, useQuery, useQueryClient, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Sak } from "../components/sak/sak";
import {
    BEHANDLING_API_V1,
    BIDRAG_DOKUMENT_PRODUKSJON_API,
    ORGANISASJON_API,
    PERSON_API,
    SAK_API,
} from "../constants/api";

export const MutationKeys = {
    opprettePrivatAvtale: (behandlingId: string) => ["mutation", "createPrivatavtale", behandlingId],
    oppdaterBehandling: (behandlingId: string) => ["mutation", "behandling", behandlingId],
    oppdaterManueltOverstyrtGebyr: (behandlingId: string) => [
        "mutation",
        "oppdaterManueltOverstyrtGebyr",
        behandlingId,
    ],
    oppdatereTilsynsordning: (behandlingId: string) => ["mutation", "oppdatereTilsynsordning", behandlingId],
    oppdatereUnderhold: (behandlingId: string) => ["mutation", "oppdatereUnderhold", behandlingId],
    oppretteUnderholdForBarn: (behandlingId: string) => ["mutation", "oppretteUnderholdForBarn", behandlingId],
    updateBoforhold: (behandlingId: string) => ["mutation", "boforhold", behandlingId],
    updateSamvær: (behandlingId: string) => ["mutation", "samvær", behandlingId],
    updateSamværskalkulator: (behandlingId: string) => ["mutation", "updateSamværskalkulator", behandlingId],
    slettSamværskalkulator: (behandlingId: string) => ["mutation", "slettSamværskalkulator", behandlingId],
    beregnSamværsklasse: () => ["mutation", "beregnSamværsklasse"],
    updateInntekter: (behandlingId: string) => ["mutation", "inntekter", behandlingId],
    updateVirkningstidspunkt: (behandlingId: string) => ["mutation", "virkningstidspunkt", behandlingId],
    updateUtgifter: (behandlingId: string) => ["mutation", "utgifter", behandlingId],
    updateStonadTilBarnetilsyn: (behandlingId: string) => ["mutation", "stonadTilBarnetilsyn", behandlingId],
    updateFaktiskeTilsynsutgifter: (behandlingId: string) => ["mutation", "faktiskeTilsynsutgifter", behandlingId],
    updateTilleggstønad: (behandlingId: string) => ["mutation", "tilleggstønad", behandlingId],
    slettUnderholdsElement: (behandlingId: string) => ["mutation", "slettUnderholdsElement", behandlingId],
    oppdaterePrivatAvtale: (behandlingId: string) => ["mutation", "oppdaterePrivatAvtale", behandlingId],
    slettePrivatAvtale: (behandlingId: string) => ["mutation", "slettePrivatAvtale", behandlingId],
};

export const QueryKeys = {
    behandlingVersion: "V1",
    virkningstidspunkt: (behandlingId: string) => ["virkningstidspunkt", QueryKeys.behandlingVersion, behandlingId],
    visningsnavn: () => ["visningsnavn", QueryKeys.behandlingVersion],
    beregningForskudd: () => ["beregning_forskudd", QueryKeys.behandlingVersion],
    beregningSærbidrag: () => ["beregning_særbidrag", QueryKeys.behandlingVersion],
    beregnBarnebidrag: (endelig: boolean) => ["beregning_barnebidrag", QueryKeys.behandlingVersion, endelig],
    beregningInnteksgrenseSærbidrag: () => ["beregning_særbidrag_innteksgrense", QueryKeys.behandlingVersion],
    notat: (behandlingId: string) => ["notat_payload", QueryKeys.behandlingVersion, behandlingId],
    notatPdf: (behandlingId: string) => ["notat_payload_pdf", QueryKeys.behandlingVersion, behandlingId],
    behandlingV2: (behandlingId: string, vedtakId?: string) => [
        "behandlingV2",
        QueryKeys.behandlingVersion,
        behandlingId,
        vedtakId,
    ],
    sjekkFF: (behandlingId: string) => ["behandlingV2", "FF", QueryKeys.behandlingVersion, behandlingId],
    hentSakerForIdent: (ident: string, barn: string) => ["saker", ident, barn],
    grunnlag: () => ["grunnlag", QueryKeys.behandlingVersion],
    arbeidsforhold: (behandlingId: string) => ["arbeidsforhold", behandlingId, QueryKeys.behandlingVersion],
    person: (ident: string) => ["person", ident],
    manuelleVedtak: (behandlingId: string) => ["manuelleVedtak", behandlingId],
};
export const useRefetchFFInfoFn = () => {
    const { id } = useGetBehandlingV2();
    const client = useQueryClient();
    return () => {
        client.refetchQueries({ queryKey: QueryKeys.behandlingV2(id.toString()) });
        client.refetchQueries({ queryKey: QueryKeys.sjekkFF(id.toString()) });
    };
};

export const useRegistrerBarnTilSak = (saksnummer: string, gjelderBarnIdent: string, onSuccess?: () => void) => {
    const refetchFFInfo = useRefetchFFInfoFn();
    return useMutation({
        mutationFn: async () => {
            if (!saksnummer) {
                throw new Error("Du må velge en sak før du kan legge den til");
            }
            try {
                const oppdatertSak = SAK_API.sak.oppdaterSak({
                    saksnummer: saksnummer,
                    roller: [
                        {
                            rolleType: Rolletype.BA,
                            type: Rolletype.BA,
                            foedselsnummer: gjelderBarnIdent,
                            mottagerErVerge: false,
                        },
                    ],
                });
                console.log("oppdatertSak", oppdatertSak);
            } catch (e) {
                LoggerService.error("Feil ved oppdatering av sak", e);
            }
        },
        onSuccess: () => {
            onSuccess?.();
            refetchFFInfo();
        },
    });
};
export const useGetArbeidsforhold = (): ArbeidsforholdGrunnlagDto[] => {
    const behandling = useGetBehandlingV2();
    return behandling.aktiveGrunnlagsdata?.arbeidsforhold;
};
export const useGetOpplysningerBoforhold = (): {
    aktiveOpplysninger: HusstandsmedlemGrunnlagDto[];
    ikkeAktiverteOpplysninger: HusstandsmedlemGrunnlagDto[];
} => {
    const behandling = useGetBehandlingV2();
    return {
        aktiveOpplysninger: behandling.aktiveGrunnlagsdata?.husstandsbarn,
        ikkeAktiverteOpplysninger: behandling.ikkeAktiverteEndringerIGrunnlagsdata?.husstandsbarn,
    };
};

export const useGetOpplysningerBarnetilsyn = (): {
    aktiveOpplysninger: StonadTilBarnetilsynAktiveGrunnlagDto;
    ikkeAktiverteOpplysninger: StonadTilBarnetilsynAktiveGrunnlagDto;
} => {
    const behandling = useGetBehandlingV2();
    return {
        aktiveOpplysninger: behandling.aktiveGrunnlagsdata?.stønadTilBarnetilsyn,
        ikkeAktiverteOpplysninger: behandling.ikkeAktiverteEndringerIGrunnlagsdata?.stønadTilBarnetilsyn,
    };
};

export const useGetOpplysningeAndreVoksneIHusstand = (): {
    aktiveOpplysninger: AndreVoksneIHusstandenGrunnlagDto;
    ikkeAktiverteOpplysninger: AndreVoksneIHusstandenGrunnlagDto;
} => {
    const behandling = useGetBehandlingV2();
    return {
        aktiveOpplysninger: behandling.aktiveGrunnlagsdata?.andreVoksneIHusstanden,
        ikkeAktiverteOpplysninger: behandling.ikkeAktiverteEndringerIGrunnlagsdata?.andreVoksneIHusstanden,
    };
};
export const useGetOpplysningerSivilstandV2 = (): {
    aktiveOpplysninger: SivilstandAktivGrunnlagDto;
    ikkeAktiverteOpplysninger: SivilstandIkkeAktivGrunnlagDto;
} => {
    const behandling = useGetBehandlingV2();
    return {
        aktiveOpplysninger: behandling.aktiveGrunnlagsdata?.sivilstand,
        ikkeAktiverteOpplysninger: behandling.ikkeAktiverteEndringerIGrunnlagsdata?.sivilstand,
    };
};
export const useGetOpplysningerSivilstand = (): SivilstandAktivGrunnlagDto => {
    const behandling = useGetBehandlingV2();
    return behandling.aktiveGrunnlagsdata?.sivilstand;
};

export const useUpdateInntekt = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateInntekter(behandlingId),
        mutationFn: async (payload: OppdatereInntektRequest): Promise<OppdatereInntektResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereInntekt(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av inntekter", error);
        },
    });
};
export const useDeleteSamværsperiode = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateSamvær(behandlingId),
        mutationFn: async (payload: SletteSamvaersperiodeElementDto): Promise<OppdaterSamvaerResponsDto> => {
            const { data } = await BEHANDLING_API_V1.api.slettSamvaersperiode(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved sletting av samværsperiode", error);
        },
    });
};

export const useBeregnSamværsklasse = () => {
    return useMutation({
        mutationKey: MutationKeys.beregnSamværsklasse(),
        mutationFn: async (payload: SamvaerskalkulatorDetaljer): Promise<DelberegningSamvaersklasse> => {
            const { data } = await BEHANDLING_API_V1.api.beregnSamvaersklasse(payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av boforhold", error);
        },
    });
};

export const useUpdateSamvær = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateSamvær(behandlingId),
        mutationFn: async (payload: OppdaterSamvaerDto): Promise<OppdaterSamvaerResponsDto> => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterSamvaer(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av samvær", error);
        },
    });
};
export const useUpdateBoforhold = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateBoforhold(behandlingId),
        mutationFn: async (payload: OppdatereBoforholdRequestV2): Promise<OppdatereBoforholdResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereBoforhold(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av boforhold", error);
        },
    });
};

const hentOrganisasjonDetaljer = async (enhetsnummer: string): Promise<string> => {
    try {
        const enhetInfo = await ORGANISASJON_API.enhet.hentEnhetInfo(enhetsnummer);
        return enhetInfo.data.navn;
    } catch (e) {
        console.error("Feil ved henting av organisasjonsdetaljer for enhet:", enhetsnummer, e);
        return "Ukjent enhet";
    }
};

const hentPersonDetaljer = async (ident: string): Promise<PersonDto> => {
    try {
        return (await PERSON_API.informasjon.hentPersonPost({ ident })).data;
    } catch (e) {
        console.error("Feil ved henting av persondetaljer for ident:", ident, e);
        return { navn: "Ukjent person", ident, visningsnavn: "Ukjent person" };
    }
};
export const useGetSakerForBp = (gjelderBarnIdent: string): Sak[] => {
    const { roller } = useGetBehandlingV2();
    const foreldre = useHentPersonForeldre(gjelderBarnIdent);
    const bpIdent = roller.find((r) => r.rolletype === Rolletype.BP)?.ident;
    const motsattRolle = foreldre.data.find(
        (relasjon) => relasjon.relatertPersonsIdent !== bpIdent
    )?.relatertPersonsIdent;
    const { data: response } = useSuspenseQuery<Sak[]>({
        queryKey: QueryKeys.hentSakerForIdent(bpIdent, gjelderBarnIdent),
        queryFn: async () => {
            try {
                const saker = (await SAK_API.person.finnForFodselsnummer(JSON.stringify(bpIdent))).data;

                return await Promise.all(
                    saker
                        .filter(
                            (sak) => sak.roller.find((rolle) => rolle.fodselsnummer === bpIdent)?.type === Rolletype.BP
                        )
                        .filter((sak) => {
                            return (
                                motsattRolle === undefined ||
                                sak.roller.some((rolle) => rolle.fodselsnummer === motsattRolle)
                            );
                        })
                        .map(async (sak) => {
                            const enhetInfo = await hentOrganisasjonDetaljer(sak.eierfogd);
                            const bpRolle = sak.roller.find((rolle) => rolle.fodselsnummer === bpIdent);
                            const motsattRolle = sak.roller
                                .filter((r) => ![Rolletype.BA, Rolletype.FR, Rolletype.RM].includes(r.type))
                                .find((rolle) => rolle.fodselsnummer !== bpIdent);
                            const motsattRolleInfo = await hentPersonDetaljer(motsattRolle.fodselsnummer);
                            return {
                                ...sak,
                                ferdigRegistrert: sak.roller.length > 1,
                                enhetInformasjon: enhetInfo,
                                motsattRolle: { ...motsattRolle, navn: motsattRolleInfo?.visningsnavn },
                                rolle: bpRolle,
                                roller: sak.roller.map((rolle) => ({ ...rolle, ident: bpIdent })),
                            };
                        })
                );
            } catch (e) {
                console.log(e);
                return [] as Sak[];
            }
        },
        staleTime: Infinity,
    });
    return response;
};

export const useGetBehandlingV2 = (): BehandlingDtoV2 => {
    const { behandlingId, vedtakId } = useBehandlingProvider();
    return useBehandlingV2(behandlingId, vedtakId);
};

export const useGetForholdsmessigFordelingDetaljer = (): SjekkForholdmessigFordelingResponse => {
    const { behandlingId } = useBehandlingProvider();
    const { data: response } = useSuspenseQuery({
        queryKey: QueryKeys.sjekkFF(behandlingId),
        queryFn: async () => {
            try {
                return (await BEHANDLING_API_V1.api.kanOppretteForholdsmessigFordeling(Number(behandlingId))).data;
            } catch (e) {
                console.log(e);
                return { kanOppretteForholdsmessigFordeling: false } as SjekkForholdmessigFordelingResponse;
            }
        },
        staleTime: Infinity,
    });
    return response;
};
export const useBehandlingV2 = (behandlingId?: string, vedtakId?: string): BehandlingDtoV2 => {
    const { data: behandling } = useSuspenseQuery({
        queryKey: QueryKeys.behandlingV2(behandlingId, vedtakId),
        queryFn: async () => {
            try {
                if (vedtakId) {
                    return (
                        await BEHANDLING_API_V1.api.vedtakLesemodus(Number(vedtakId), {
                            inkluderHistoriskeInntekter: true,
                        })
                    ).data;
                }
                return (await BEHANDLING_API_V1.api.henteBehandlingV2(Number(behandlingId))).data;
            } catch (e) {
                if (e instanceof AxiosError && e.response.status === 404) {
                    throw new FantIkkeVedtakEllerBehandlingError(
                        `Fant ikke ${vedtakId ? "vedtak" : "behandling"} med id ${vedtakId ?? behandlingId}`
                    );
                }
                throw e;
            }
        },
        retry: (count, error) => {
            if (error instanceof FantIkkeVedtakEllerBehandlingError) {
                return false;
            }
            return count < 3;
        },
        staleTime: Infinity,
    });
    return behandling;
};
export const useHentPersonForeldre = (ident?: string) =>
    useSuspenseQuery({
        queryKey: ["persons", "foreldre", ident],
        queryFn: async (): Promise<ForelderBarnRelasjon[]> => {
            if (!ident) return [];
            const { data } = await PERSON_API.forelderbarnrelasjon.hentForelderBarnRelasjon1({ ident: ident });
            return data.forelderBarnRelasjon
                .filter((b) => b.minRolleForPerson === "BARN")
                .filter(
                    (relasjon) => relasjon.relatertPersonsRolle === "FAR" || relasjon.relatertPersonsRolle === "MOR"
                );
        },
        staleTime: Infinity,
    });
export const useHentPersonData = (ident?: string) =>
    useSuspenseQuery({
        queryKey: ["persons", ident],
        queryFn: async (): Promise<PersonDto> => {
            if (!ident) return { ident: "", visningsnavn: "Ukjent" };
            const { data } = await PERSON_API.informasjon.hentPersonPost({ ident: ident });
            return data;
        },
        staleTime: Infinity,
    });

export const usePersonsQueries = (roller: RolleDto[]) =>
    useSuspenseQueries({
        queries: roller.map((rolle) => ({
            queryKey: QueryKeys.person(rolle.ident),
            queryFn: async (): Promise<PersonDto & { rolleType: RolleTypeFullName }> => {
                if (!rolle.ident)
                    return { ident: "", visningsnavn: rolle.navn, rolleType: RolleTypeFullName.FEILREGISTRERT };
                const { data } = await PERSON_API.informasjon.hentPersonPost({ ident: rolle.ident });
                return {
                    ...rolle,
                    ident: rolle.ident!,
                    rolleType: rolle.rolletype as unknown as RolleTypeFullName,
                    navn: data.navn,
                    kortnavn: data.kortnavn,
                    visningsnavn: data.visningsnavn,
                };
            },
        })),
    });

export const useNotatPdf = (behandlingId?: string, vedtakId?: string) => {
    const resultPayload = useQuery({
        queryKey: QueryKeys.notatPdf(behandlingId ?? vedtakId),
        queryFn: async () => {
            if (vedtakId) {
                return (await BEHANDLING_API_V1.api.hentNotatOpplysningerForVedtak(Number(vedtakId))).data;
            }
            return (await BEHANDLING_API_V1.api.hentNotatOpplysninger(Number(behandlingId))).data;
        },
        refetchOnWindowFocus: false,
        refetchInterval: 0,
    });

    const resultNotatPdf = useQuery({
        queryKey: ["notat_pdf", behandlingId, resultPayload.data],
        queryFn: () =>
            BIDRAG_DOKUMENT_PRODUKSJON_API.api.generatePdf(
                //@ts-ignore
                resultPayload.data as NotatPayload,
                {
                    format: "blob",
                }
            ),
        select: (response) => response.data,
        enabled: resultPayload.isFetched,
        refetchOnWindowFocus: false,
        refetchInterval: 0,
        staleTime: Infinity,
        placeholderData: (previousData) => previousData,
    });

    return resultPayload.isError || resultPayload.isLoading ? resultPayload : resultNotatPdf;
};

export const useNotat = (behandlingId?: string, vedtakId?: string) => {
    const resultPayload = useQuery({
        queryKey: QueryKeys.notat(behandlingId ?? vedtakId),
        queryFn: async () => {
            if (vedtakId) {
                return (await BEHANDLING_API_V1.api.hentNotatOpplysningerForVedtak(Number(vedtakId))).data;
            }
            return (await BEHANDLING_API_V1.api.hentNotatOpplysninger(Number(behandlingId))).data;
        },
        refetchOnWindowFocus: false,
        refetchInterval: 0,
    });

    const resultNotatHtml = useQuery({
        queryKey: ["notat_html", behandlingId, resultPayload.data],
        queryFn: () =>
            BIDRAG_DOKUMENT_PRODUKSJON_API.api.generateHtml(
                //@ts-ignore
                resultPayload.data as NotatPayload
            ),
        select: (response) => response.data,
        enabled: resultPayload.isFetched,
        refetchOnWindowFocus: false,
        refetchInterval: 0,
        staleTime: Infinity,
        placeholderData: (previousData) => previousData,
    });

    return resultPayload.isError || resultPayload.isLoading ? resultPayload : resultNotatHtml;
};
export const useAktiveGrunnlagsdata = () => {
    const { behandlingId } = useBehandlingProvider();
    const queryClient = useQueryClient();

    return useMutation<
        { data: AktivereGrunnlagResponseV2; type: OpplysningerType },
        { data: AktivereGrunnlagResponseV2; type: OpplysningerType },
        { personident: string; gjelderIdent?: string; type: OpplysningerType }
    >({
        mutationFn: async ({ personident, gjelderIdent, type }) => {
            const { data } = await BEHANDLING_API_V1.api.aktivereGrunnlag(Number(behandlingId), {
                personident,
                gjelderIdent,
                grunnlagstype: type,
                overskriveManuelleOpplysninger: true,
            });
            return { data, type };
        },
        onSuccess: ({ data, type }) => {
            const opplysningTypeInntektTypeMapper = {
                [OpplysningerType.SMABARNSTILLEGG]: "småbarnstillegg",
                [OpplysningerType.UTVIDET_BARNETRYGD]: "utvidetBarnetrygd",
                [OpplysningerType.BARNETILLEGG]: "barnetillegg",
                [OpplysningerType.KONTANTSTOTTE]: "kontantstøtte",
                [OpplysningerType.SKATTEPLIKTIGE_INNTEKTER]: "årsinntekter",
            };

            queryClient.setQueryData<BehandlingDtoV2>(QueryKeys.behandlingV2(behandlingId), (currentData) => {
                const updatedBehandling = {
                    ...currentData,
                    inntekter: {
                        ...currentData.inntekter,
                        [opplysningTypeInntektTypeMapper[type]]: data.inntekter[opplysningTypeInntektTypeMapper[type]],
                        månedsinntekter: data.inntekter.månedsinntekter,
                        beregnetInntekter: data.inntekter.beregnetInntekter,
                        valideringsfeil: data.inntekter.valideringsfeil,
                    },
                    ikkeAktiverteEndringerIGrunnlagsdata: data.ikkeAktiverteEndringerIGrunnlagsdata,
                    aktiveGrunnlagsdata: data.aktiveGrunnlagsdata,
                };
                return updatedBehandling;
            });
        },
    });
};
export const useGetBeregningInnteksgrenseSærbidrag = () => {
    const { behandlingId, vedtakId } = useBehandlingProvider();

    return useSuspenseQuery<number>({
        queryKey: QueryKeys.beregningInnteksgrenseSærbidrag(),
        queryFn: async () => {
            try {
                if (vedtakId) {
                    return -1;
                }
                const response = await BEHANDLING_API_V1.api.beregnBPsLavesteInntektForEvne(Number(behandlingId));
                return response.data;
            } catch (error) {
                console.error("error", error);
                return -1;
            }
        },
    });
};
export const useGetBeregningBidrag = (endelig: boolean) => {
    const { behandlingId, vedtakId } = useBehandlingProvider();

    return useSuspenseQuery<VedtakBarnebidragBeregningResult>({
        queryKey: QueryKeys.beregnBarnebidrag(endelig),
        queryFn: async () => {
            try {
                if (vedtakId) {
                    const response = await BEHANDLING_API_V1.api.hentVedtakBeregningResultatBidrag(Number(vedtakId));
                    return { resultat: response.data };
                }
                const response = await BEHANDLING_API_V1.api.beregnBarnebidrag(Number(behandlingId), {
                    endeligBeregning: endelig,
                });
                const ugyldigBeregning = response.data.resultatBarn.some((barn) => barn.ugyldigBeregning);
                return { resultat: response.data, ugyldigBeregning: ugyldigBeregning };
            } catch (error) {
                console.log("error beregnBarnebidrag", error);
                const feilmelding = error.response.headers["warning"]?.split(",") ?? [];
                if (error instanceof AxiosError && error.response.status === 400) {
                    if (error.response?.data) {
                        return {
                            feil: {
                                melding: feilmelding,
                                detaljer: error.response.data as BeregningValideringsfeil,
                            },
                        };
                    }
                    return {
                        feil: {
                            melding: feilmelding,
                        },
                    };
                }
            }
        },
    });
};
export const useGetBeregningSærbidrag = () => {
    const { behandlingId, vedtakId } = useBehandlingProvider();

    return useSuspenseQuery<VedtakSærbidragBeregningResult>({
        queryKey: QueryKeys.beregningSærbidrag(),
        queryFn: async () => {
            try {
                if (vedtakId) {
                    const response = await BEHANDLING_API_V1.api.hentVedtakBeregningResultatSaerbidrag(
                        Number(vedtakId)
                    );
                    return { resultat: response.data };
                }
                const response = await BEHANDLING_API_V1.api.beregnSaerbidrag(Number(behandlingId));
                return { resultat: response.data };
            } catch (error) {
                const feilmelding = error.response.headers["warning"]?.split(",") ?? [];
                if (error instanceof AxiosError && error.response.status === 400) {
                    if (error.response?.data) {
                        return {
                            feil: {
                                melding: feilmelding,
                                detaljer: error.response.data as BeregningValideringsfeil,
                            },
                        };
                    }
                    return {
                        feil: {
                            melding: feilmelding,
                        },
                    };
                }
            }
        },
    });
};
export const useGetBeregningForskudd = () => {
    const { behandlingId, vedtakId } = useBehandlingProvider();

    return useSuspenseQuery<VedtakBeregningResult>({
        queryKey: QueryKeys.beregningForskudd(),
        queryFn: async () => {
            try {
                if (vedtakId) {
                    const response = await BEHANDLING_API_V1.api.hentVedtakBeregningResultat(Number(vedtakId));
                    return { resultat: response.data };
                }
                const response = await BEHANDLING_API_V1.api.beregnForskudd1(Number(behandlingId));
                return { resultat: response.data };
            } catch (error) {
                const feilmelding = error.response.headers["warning"]?.split(",") ?? [];
                if (error instanceof AxiosError && error.response.status === 400) {
                    if (error.response?.data) {
                        return {
                            feil: {
                                melding: feilmelding,
                                detaljer: error.response.data as BeregningValideringsfeil,
                            },
                        };
                    }
                    return {
                        feil: {
                            melding: feilmelding,
                        },
                    };
                }
            }
        },
    });
};

export const useAktiverGrunnlagsdata = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateBoforhold(behandlingId),
        mutationFn: async (payload: AktivereGrunnlagRequestV2): Promise<AktivereGrunnlagResponseV2> => {
            const { data } = await BEHANDLING_API_V1.api.aktivereGrunnlag(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av grunnlag", error);
        },
    });
};

export const useOppdatereVirkningstidspunktV2 = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId),
        mutationFn: async (payload: OppdatereVirkningstidspunkt): Promise<BehandlingDtoV2> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereVirkningstidspunktV2(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av virkningstidsdpunkt", error);
        },
    });
};

export const useUpdateUtgifter = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateUtgifter(behandlingId),
        mutationFn: async (payload: OppdatereUtgiftRequest): Promise<OppdatereUtgiftResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereUtgift(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av utgifter", error);
        },
    });
};

export const useUpdateStønadTilBarnetilsyn = (underholdsid: string) => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateStonadTilBarnetilsyn(behandlingId),
        mutationFn: async (payload: StonadTilBarnetilsynDto): Promise<OppdatereUnderholdResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereStonadTilBarnetilsyn(
                Number(behandlingId),
                Number(underholdsid),
                payload
            );
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av stønad til barnetilsyn", error);
        },
    });
};

export const useDeleteUnderholdsObjekt = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.slettUnderholdsElement(behandlingId),
        mutationFn: async (payload: SletteUnderholdselement): Promise<OppdatereUnderholdResponse> => {
            const { data } = await BEHANDLING_API_V1.api.sletteFraUnderhold(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved sletting av underhold", error);
        },
    });
};

export const useUpdateFaktiskeTilsynsutgifter = (underholdsid: number) => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateFaktiskeTilsynsutgifter(behandlingId),
        mutationFn: async (payload: FaktiskTilsynsutgiftDto): Promise<OppdatereUnderholdResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereFaktiskTilsynsutgift(
                Number(behandlingId),
                underholdsid,
                payload
            );
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av faktiske tilsynsutgifter", error);
        },
    });
};

export const useUpdateTilleggstønad = (underholdsid: number) => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.updateTilleggstønad(behandlingId),
        mutationFn: async (payload: TilleggsstonadDto): Promise<OppdatereUnderholdResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereTilleggsstonad(
                Number(behandlingId),
                underholdsid,
                payload
            );
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av tillegstønad", error);
        },
    });
};

export const useCreateUnderholdForBarn = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppretteUnderholdForBarn(behandlingId),
        mutationFn: async (payload: BarnDto): Promise<OpprettUnderholdskostnadBarnResponse> => {
            const { data } = await BEHANDLING_API_V1.api.oppretteUnderholdForBarn(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppretting av underholds barn", error);
        },
    });
};

export const useUpdateUnderholdBegrunnelse = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdatereUnderhold(behandlingId),
        mutationFn: async (payload: OppdatereBegrunnelseRequest): Promise<void> => {
            await BEHANDLING_API_V1.api.oppdatereBegrunnelse(Number(behandlingId), payload);
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av underhold", error);
        },
    });
};

export const useUpdateHarTilysnsordning = (underholdsid: number) => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdatereTilsynsordning(behandlingId),
        mutationFn: async (payload: { harTilsynsordning: boolean }): Promise<void> => {
            await BEHANDLING_API_V1.api.oppdatereTilsynsordning(Number(behandlingId), underholdsid, payload);
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av tilsynsordning", error);
        },
    });
};

export const useUpdateGebyr = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterManueltOverstyrtGebyr(behandlingId),
        mutationFn: async (payload: OppdaterGebyrDto): Promise<GebyrRolleDto> => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterManueltOverstyrtGebyr(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av gebyr", error);
        },
    });
};
export const useUpdatePrivatAvtaleBegrunnelse = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterePrivatAvtale(behandlingId),
        mutationFn: async (
            payload: OppdaterePrivatAvtaleBegrunnelseRequest
        ): Promise<OppdaterePrivatAvtaleResponsDto> => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterPrivatAvtaleBegrunnelse(Number(behandlingId), payload);

            return data;
        },
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av begrunnelse for privat avtale", error);
        },
    });
};
export const useUpdatePrivatAvtale = (privatAvtaleId: number) => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterePrivatAvtale(behandlingId),
        mutationFn: async (payload: OppdaterePrivatAvtaleRequest): Promise<OppdaterePrivatAvtaleResponsDto> => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterPrivatAvtale(
                Number(behandlingId),
                privatAvtaleId,
                payload
            );

            return data;
        },
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av privat avtale", error);
        },
    });
};

export const useUpdateBeregnTilDato = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId),
        mutationFn: async (payload: OppdaterBeregnTilDatoRequestDto): Promise<BehandlingDtoV2> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereBeregnTilDato(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av opphørsdato", error);
        },
    });
};
export const useUpdateOpphørsdato = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId),
        mutationFn: async (payload: OppdaterOpphorsdatoRequestDto): Promise<BehandlingDtoV2> => {
            const { data } = await BEHANDLING_API_V1.api.oppdatereOpphorsdato(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppdatering av opphørsdato", error);
        },
    });
};

export const useCreatePrivatAvtale = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.opprettePrivatAvtale(behandlingId),
        mutationFn: async (payload: BarnDto): Promise<OppdaterePrivatAvtaleResponsDto> => {
            const { data } = await BEHANDLING_API_V1.api.opprettePrivatAvtale(Number(behandlingId), payload);
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved oppretting av privat avtale", error);
        },
    });
};

export const useDeletePrivatAvtale = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.slettePrivatAvtale(behandlingId),
        mutationFn: async (privatAvtaleId: number): Promise<void> => {
            await BEHANDLING_API_V1.api.slettePrivatAvtale(Number(behandlingId), privatAvtaleId);
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved sletting av privat avtale", error);
        },
    });
};

export const useOppdaterOpprettP35c = (periode: ResultatBarnebidragsberegningPeriodeDto) => {
    const { id: behandlingId } = useGetBehandlingV2();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId.toString()),
        mutationFn: async (payload: OppdaterParagraf35CDetaljerDto) => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterVedtakParagraf35C(behandlingId, payload);
            return data;
        },

        onSuccess: async (_, variables) => {
            queryClient.setQueryData<VedtakBarnebidragBeregningResult>(
                QueryKeys.beregnBarnebidrag(true),
                (currentData): VedtakBarnebidragBeregningResult => {
                    return {
                        ...currentData,
                        resultat: {
                            resultatBarn: currentData.resultat.resultatBarn?.map((rb) => {
                                if (rb.barn.ident === variables.ident) {
                                    return {
                                        ...rb,
                                        delvedtak: rb.delvedtak.map((dv) => {
                                            if (!dv.delvedtak && !dv.omgjøringsvedtak) {
                                                return {
                                                    ...dv,
                                                    perioder: dv.perioder.map((p) => {
                                                        if (
                                                            p.klageOmgjøringDetaljer.resultatFraVedtak ===
                                                            periode.klageOmgjøringDetaljer.resultatFraVedtak
                                                        ) {
                                                            return {
                                                                ...p,
                                                                klageOmgjøringDetaljer: {
                                                                    ...p.klageOmgjøringDetaljer,
                                                                    skalOpprette35c: variables.opprettP35c,
                                                                },
                                                            };
                                                        }
                                                        return p;
                                                    }),
                                                };
                                            }
                                            return dv;
                                        }),
                                    };
                                } else {
                                    return rb;
                                }
                            }),
                        },
                    };
                }
            );
        },
    });
};

export const useOppdaterManuelleVedtak = (onSuccess?: () => void) => {
    const { id: behandlingId } = useGetBehandlingV2();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId.toString()),
        mutationFn: async (payload: OppdaterManuellVedtakRequest) => {
            const { data } = await BEHANDLING_API_V1.api.oppdaterValgtManuellVedtak(behandlingId, payload);
            return data;
        },
        onSuccess: async (response, payload) => {
            onSuccess?.();
            queryClient.setQueryData<BehandlingDtoV2>(
                QueryKeys.behandlingV2(behandlingId.toString()),
                (currentData): BehandlingDtoV2 => {
                    return {
                        ...currentData,
                        underholdskostnader: response.underholdskostnader,
                        erVedtakUtenBeregning: response.erVedtakUtenBeregning,
                        virkningstidspunktV3: {
                            ...currentData.virkningstidspunktV3,
                            barn: currentData.virkningstidspunktV3.barn.map((virkningstidspunkt) => {
                                if (virkningstidspunkt.rolle.id === payload.barnId) {
                                    return {
                                        ...virkningstidspunkt,
                                        grunnlagFraVedtak: payload.vedtaksid,
                                    };
                                }
                                return virkningstidspunkt;
                            }),
                        },
                        virkningstidspunktV2: currentData.virkningstidspunktV2.map((virkningstidspunkt) => {
                            if (virkningstidspunkt.rolle.id === payload.barnId) {
                                return {
                                    ...virkningstidspunkt,
                                    grunnlagFraVedtak: payload.vedtaksid,
                                };
                            }
                            return virkningstidspunkt;
                        }),
                    };
                }
            );
        },
    });
};

export const useMergeVirkningstidspunkt = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId),
        mutationFn: async (): Promise<BehandlingDtoV2> => {
            const { data } = await BEHANDLING_API_V1.api.brukSammeVirkningstidspunktForAlleBarna(Number(behandlingId));
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved merging av virkningstidsdpunkter", error);
        },
    });
};

export const useMergeSamvær = () => {
    const { behandlingId } = useBehandlingProvider();

    return useMutation({
        mutationKey: MutationKeys.oppdaterBehandling(behandlingId),
        mutationFn: async (): Promise<BehandlingDtoV2> => {
            const { data } = await BEHANDLING_API_V1.api.brukSammeSamvaerForAlleBarna(Number(behandlingId));
            return data;
        },
        networkMode: "always",
        onError: (error) => {
            console.log("onError", error);
            LoggerService.error("Feil ved merging av samvær", error);
        },
    });
};
