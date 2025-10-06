import {
    BeregnTil,
    EksisterendeOpphorsvedtakDto,
    OppdatereVirkningstidspunkt,
    Resultatkode,
    SoktAvType,
    Stonadstype,
    TypeArsakstype,
    Vedtakstype,
    VirkningstidspunktDtoV2,
} from "@api/BidragBehandlingApiV1";
import { ActionButtons } from "@common/components/ActionButtons";
import { BehandlingAlert } from "@common/components/BehandlingAlert";
import { CustomTextareaEditor } from "@common/components/CustomEditor";
import { FormControlledCustomTextareaEditor } from "@common/components/formFields/FormControlledCustomTextEditor";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import { FormControlledSelectField } from "@common/components/formFields/FormControlledSelectField";
import { FlexRow } from "@common/components/layout/grid/FlexRow";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import urlSearchParams from "@common/constants/behandlingQueryKeys";
import { ROLE_FORKORTELSER } from "@common/constants/roleTags";
import { SOKNAD_LABELS } from "@common/constants/soknadFraLabels";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { getFirstDayOfMonthAfterEighteenYears, isOver18YearsOld } from "@common/helpers/boforholdFormHelpers";
import { aarsakToVirkningstidspunktMapper } from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useDebounce } from "@common/hooks/useDebounce";
import { useFomTomDato } from "@common/hooks/useFomTomDato";
import { hentVisningsnavn, hentVisningsnavnVedtakstype } from "@common/hooks/useVisningsnavn";
import {
    OpphørsVarighet,
    VirkningstidspunktFormValues,
    VirkningstidspunktFormValuesPerBarn,
} from "@common/types/virkningstidspunktFormValues";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { deductDays, ObjectUtils, toISODateString } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, Heading, HStack, Label, Radio, RadioGroup, Tabs, VStack } from "@navikt/ds-react";
import { addMonths, dateOrNull, DateToDDMMYYYYString, deductMonths } from "@utils/date-utils";
import { removePlaceholder } from "@utils/string-utils";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import KlagetPåVedtakButton, { OpprinneligVedtakButton } from "../../../../common/components/KlagetPåVedtakButton";
import { useQueryParams } from "../../../../common/hooks/useQueryParams";
import { BarnebidragStepper } from "../../../enum/BarnebidragStepper";
import { useGetActiveAndDefaultVirkningstidspunktTab } from "../../../hooks/useGetActiveAndDefaultVirkningstidspunktTab";
import { useOnSaveVirkningstidspunkt } from "../../../hooks/useOnSaveVirkningstidspunkt";
import { useOnUpdateBeregnTilDato } from "../../../hooks/useOnUpdateBeregnTilDato";
import { useOnUpdateOpphørsdato } from "../../../hooks/useOnUpdateOpphørsdato";
import { VedtaksListeVirkningstidspunkt } from "../../Vedtakliste";

const årsakListe = [
    TypeArsakstype.FRABARNETSFODSEL,
    TypeArsakstype.FRABARNETSFLYTTEMANED,
    TypeArsakstype.FRA_SAMLIVSBRUDD,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.TREARSREGELEN,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
    TypeArsakstype.FRAMANEDENETTERPRIVATAVTALE,
    TypeArsakstype.BIDRAGSPLIKTIGHARIKKEBIDRATTTILFORSORGELSE,
];
const årsakListe18årsBidrag = [
    TypeArsakstype.FRAMANEDENETTERFYLTE18AR,
    TypeArsakstype.FRABARNETSFLYTTEMANED,
    TypeArsakstype.FRA_SAMLIVSBRUDD,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.TREARSREGELEN,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
    TypeArsakstype.FRAMANEDENETTERPRIVATAVTALE,
    TypeArsakstype.BIDRAGSPLIKTIGHARIKKEBIDRATTTILFORSORGELSE,
];
const harLøpendeBidragÅrsakListe = [
    TypeArsakstype.MANEDETTERBETALTFORFALTBIDRAG,
    TypeArsakstype.FRA_ENDRINGSTIDSPUNKT,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
];
const avslagsListe = [Resultatkode.IKKE_OMSORG_FOR_BARNET, Resultatkode.BIDRAGSPLIKTIGERDOD];
const avslagsListe18År = [Resultatkode.IKKE_DOKUMENTERT_SKOLEGANG, Resultatkode.BIDRAGSPLIKTIGERDOD];
const avslagsListe18ÅrOpphør = [Resultatkode.AVSLUTTET_SKOLEGANG, Resultatkode.BIDRAGSPLIKTIGERDOD];
const avvisningslisteListe18ÅrOpphør = [
    Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT,
    Resultatkode.BM_HAR_OMSORG_FOR_BARNET,
];
const avslagsListeOpphør = [Resultatkode.IKKE_OMSORG_FOR_BARNET, Resultatkode.BIDRAGSPLIKTIGERDOD];
export const avvisningsListeOpphør = [
    Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT,
    Resultatkode.BM_HAR_OMSORG_FOR_BARNET,
];

export const avvisningsListe = [Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT];

const avslaglisteAlle = Array.from(
    new Set([...avslagsListe, ...avslagsListe18År, ...avslagsListe18ÅrOpphør, ...avslagsListeOpphør])
);
const årsakslisteAlle = Array.from(new Set([...årsakListe, ...årsakListe18årsBidrag, ...harLøpendeBidragÅrsakListe]));
const avslagsListeDeprekert = [Resultatkode.IKKESOKTOMINNKREVINGAVBIDRAG];

const getDefaultOpphørsvarighet = (opphørsdato: string, eksisterendeOpphør: string, stønadstype: Stonadstype) => {
    const opphørsdatoSameAsEkisterende = opphørsdato === eksisterendeOpphør;
    const varighet = opphørsdatoSameAsEkisterende ? OpphørsVarighet.FORTSETTE_OPPHØR : OpphørsVarighet.VELG_OPPHØRSDATO;

    if (stønadstype === Stonadstype.BIDRAG18AAR) {
        return varighet;
    }
    if (!opphørsdato) {
        return OpphørsVarighet.LØPENDE;
    }
    return varighet;
};

const createInitialValues = (
    response: VirkningstidspunktDtoV2[],
    stønadstype: Stonadstype,
    vedtakstype: Vedtakstype
): VirkningstidspunktFormValues => {
    return {
        roller: response.map((virkningstidspunkt) => {
            const opphørsvarighet = getDefaultOpphørsvarighet(
                virkningstidspunkt?.opphørsdato,
                virkningstidspunkt?.eksisterendeOpphør?.opphørsdato,
                stønadstype
            );

            let initalValues: VirkningstidspunktFormValuesPerBarn = {
                opphørsvarighet,
                rolle: virkningstidspunkt.rolle,
                virkningstidspunkt: virkningstidspunkt.virkningstidspunkt,
                årsakAvslag: virkningstidspunkt.årsak ?? virkningstidspunkt.avslag ?? "",
                begrunnelse: virkningstidspunkt.begrunnelse?.innhold ?? "",
                opphørsdato: virkningstidspunkt.opphørsdato ?? null,
                beregnTil: virkningstidspunkt.beregnTil ?? null,
                beregnTilDato: virkningstidspunkt.beregnTilDato ?? null,
            };

            if (stønadstype === Stonadstype.BIDRAG18AAR && vedtakstype !== Vedtakstype.OPPHOR) {
                initalValues = {
                    ...initalValues,
                    begrunnelseVurderingAvSkolegang: virkningstidspunkt.begrunnelseVurderingAvSkolegang?.innhold ?? "",
                    kanSkriveVurderingAvSkolegang: virkningstidspunkt.kanSkriveVurderingAvSkolegang,
                };
            }

            return initalValues;
        }),
    };
};

const createPayload = (values: VirkningstidspunktFormValuesPerBarn, rolleId?: number): OppdatereVirkningstidspunkt => {
    const årsak = [...årsakListe, ...årsakListe18årsBidrag, ...harLøpendeBidragÅrsakListe].find(
        (value) => value === values.årsakAvslag
    );
    const avslag = [
        ...avslagsListe,
        ...avslagsListe18År,
        ...avslagsListe18ÅrOpphør,
        ...avslagsListeOpphør,
        ...avvisningsListeOpphør,
        ...avvisningslisteListe18ÅrOpphør,
    ].find((value) => value === values.årsakAvslag);

    let payload: OppdatereVirkningstidspunkt = {
        rolleId,
        virkningstidspunkt: values.virkningstidspunkt,
        årsak,
        avslag,
        oppdatereBegrunnelse: {
            nyBegrunnelse: values.begrunnelse,
        },
    };

    if (values.begrunnelseVurderingAvSkolegang !== undefined && values.kanSkriveVurderingAvSkolegang) {
        payload = {
            ...payload,
            oppdaterBegrunnelseVurderingAvSkolegang: {
                nyBegrunnelse: values.begrunnelseVurderingAvSkolegang,
            },
        };
    }

    return payload;
};

const getOpphørOptions = (
    eksisterendeOpphør: EksisterendeOpphorsvedtakDto,
    stønadstype: Stonadstype,
    fødselsdato: string
) => {
    if (
        stønadstype === Stonadstype.BIDRAG18AAR ||
        (stønadstype === Stonadstype.BIDRAG && isOver18YearsOld(fødselsdato))
    ) {
        if (eksisterendeOpphør) {
            return [OpphørsVarighet.VELG_OPPHØRSDATO, OpphørsVarighet.FORTSETTE_OPPHØR];
        } else {
            return [OpphørsVarighet.VELG_OPPHØRSDATO];
        }
    }

    if (eksisterendeOpphør) {
        return [OpphørsVarighet.LØPENDE, OpphørsVarighet.VELG_OPPHØRSDATO, OpphørsVarighet.FORTSETTE_OPPHØR];
    } else {
        return [OpphørsVarighet.LØPENDE, OpphørsVarighet.VELG_OPPHØRSDATO];
    }
};

const Beregningsperiode = ({ barnIndex }: { barnIndex: number }) => {
    const { getValues } = useFormContext<VirkningstidspunktFormValues>();
    const [virkningstidspunkt, beregnTilDato] = getValues([
        `roller.${barnIndex}.virkningstidspunkt`,
        `roller.${barnIndex}.beregnTilDato`,
    ]);
    const [flash, setFlash] = useState(false);
    const prevValues = useRef([virkningstidspunkt, beregnTilDato]);

    useEffect(() => {
        if (prevValues.current[0] !== virkningstidspunkt || prevValues.current[1] !== beregnTilDato) {
            setFlash(true);
            prevValues.current = [virkningstidspunkt, beregnTilDato];
            const timeout = setTimeout(() => setFlash(false), 800);
            return () => clearTimeout(timeout);
        }
    }, [virkningstidspunkt, beregnTilDato]);

    return (
        <VStack>
            <Label spacing size="small">
                Beregningsperiode
            </Label>
            <Box
                background="surface-default"
                padding="2"
                borderRadius="medium"
                borderColor="border-subtle"
                borderWidth="1"
                className={`w-max border-gray-500 transition-all duration-700${flash ? " border-green-500 ring-2 ring-green-300" : ""}`}
            >
                <BodyShort size="small">
                    <HStack gap="2">
                        <div>{DateToDDMMYYYYString(dateOrNull(virkningstidspunkt))}</div>
                        <div> -</div>
                        <div>{DateToDDMMYYYYString(deductDays(dateOrNull(beregnTilDato), 1))}</div>
                    </HStack>
                </BodyShort>
            </Box>
        </VStack>
    );
};

const Opphør = ({ item, barnIndex, initialValues, previousValues, setPreviousValues }) => {
    const behandling = useGetBehandlingV2();
    const selectedBarn = behandling.virkningstidspunktV2.find(({ rolle }) => rolle.ident === item.rolle.ident);
    const { setSaveErrorState, lesemodus } = useBehandlingProvider();
    const oppdaterOpphørsdato = useOnUpdateOpphørsdato();
    const { getValues, reset, setValue } = useFormContext();
    const [opphørsvarighet, setOpphørsvarighet] = useState(getValues(`roller.${barnIndex}.opphørsvarighet`));
    const opphørsvarighetIsLøpende = opphørsvarighet === OpphørsVarighet.LØPENDE;
    const valideringsfeilForBarn = selectedBarn.valideringsfeil?.kanIkkeSetteOpphørsdatoEtterEtterfølgendeVedtak?.find(
        (p) => p.ident === item.rolle.ident
    );
    const tom = useMemo(() => {
        if (selectedBarn.etterfølgendeVedtak != null && selectedBarn.beregnTil !== BeregnTil.INNEVAeRENDEMANED) {
            return dateOrNull(selectedBarn.etterfølgendeVedtak.virkningstidspunkt);
        }
        if (behandling.stønadstype === Stonadstype.BIDRAG)
            return getFirstDayOfMonthAfterEighteenYears(new Date(item.rolle.fødselsdato));
        return addMonths(new Date(), 50 * 12);
    }, [selectedBarn]);

    const updateOpphørsdato = () => {
        const values = getValues(`roller.${barnIndex}`);
        oppdaterOpphørsdato.mutation.mutate(
            { idRolle: selectedBarn.rolle.id, opphørsdato: values.opphørsdato, simulerEndring: false },
            {
                onSuccess: (response) => {
                    oppdaterOpphørsdato.queryClientUpdater((currentData) => {
                        return {
                            ...currentData,
                            ...response,
                        };
                    });
                    const updatedValues = createInitialValues(
                        response.virkningstidspunktV2,
                        response.stønadstype,
                        response.vedtakstype
                    );
                    const updatedBarn = Object.values(updatedValues.roller).find(
                        ({ rolle }) => rolle.ident === selectedBarn.rolle.ident
                    );
                    setValue(`roller.${barnIndex}.beregnTilDato`, updatedBarn.beregnTilDato);

                    setPreviousValues(
                        createInitialValues(response.virkningstidspunktV2, response.stønadstype, response.vedtakstype)
                    );
                },
                onError: () => {
                    setSaveErrorState({
                        error: true,
                        retryFn: () => updateOpphørsdato(),
                        rollbackFn: () => {
                            reset(previousValues, {
                                keepIsSubmitSuccessful: true,
                                keepDirty: true,
                                keepIsSubmitted: true,
                            });
                        },
                    });
                },
            }
        );
    };

    const onMonthChange = (date) => {
        const currentDate = getValues(`roller.${barnIndex}.opphørsdato`);
        if (date && date !== currentDate) {
            setValue(`roller.${barnIndex}.opphørsdato`, date);
            updateOpphørsdato();
        }
    };

    const onSelectVarighet = (value) => {
        setOpphørsvarighet(value);
        if (value === OpphørsVarighet.LØPENDE) {
            setValue(`roller.${barnIndex}.opphørsdato`, null);
            updateOpphørsdato();
        }
    };

    if (behandling.virkningstidspunkt.avslag != null) return null;
    return (
        <>
            {!lesemodus && selectedBarn.eksisterendeOpphør?.opphørsdato && (
                <BehandlingAlert variant="info" className="!w-[520px]">
                    <BodyShort>
                        {removePlaceholder(
                            text.alert.bidragOpphørt,
                            DateToDDMMYYYYString(dateOrNull(selectedBarn.eksisterendeOpphør?.opphørsdato)),
                            DateToDDMMYYYYString(dateOrNull(selectedBarn.eksisterendeOpphør?.vedtaksdato))
                        )}
                    </BodyShort>
                </BehandlingAlert>
            )}
            {valideringsfeilForBarn && !lesemodus && (
                <BehandlingAlert variant="warning" className="!w-[520px]">
                    <Heading spacing size="xsmall" level="3">
                        Ugyldig opphørsdato
                    </Heading>
                    <BodyShort size="small">
                        Kan ikke sette opphørsdato etter virkningstidspunkt til etterfølgende vedtak
                    </BodyShort>
                </BehandlingAlert>
            )}
            <FlexRow className="gap-x-8">
                <FormControlledSelectField
                    name={`roller.${barnIndex}.opphørsvarighet`}
                    label={text.label.varighet}
                    className="w-max"
                    onSelect={(value) => onSelectVarighet(value)}
                >
                    {getOpphørOptions(
                        selectedBarn.eksisterendeOpphør,
                        behandling.stønadstype,
                        selectedBarn.rolle.fødselsdato
                    ).map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </FormControlledSelectField>
                {!opphørsvarighetIsLøpende && (
                    <FormControlledMonthPicker
                        name={`roller.${barnIndex}.opphørsdato`}
                        onChange={(date) => onMonthChange(date)}
                        label={text.label.opphørsdato}
                        defaultValue={initialValues.virkningstidspunkt}
                        placeholder="DD.MM.ÅÅÅÅ"
                        fromDate={addMonths(initialValues.virkningstidspunkt, 1)}
                        toDate={tom}
                        readonly={lesemodus}
                        required
                    />
                )}
            </FlexRow>
        </>
    );
};

const Side = () => {
    const { onStepChange, getNextStep } = useBehandlingProvider();
    const { erBisysVedtak, virkningstidspunktV2, vedtakstype } = useGetBehandlingV2();
    const { getValues } = useFormContext<VirkningstidspunktFormValues>();
    const [activeTab] = useGetActiveAndDefaultVirkningstidspunktTab();
    const fieldIndex = getValues("roller").findIndex(({ rolle }) => rolle.ident === activeTab);
    const values = getValues(`roller.${fieldIndex}`);
    const begrunnelseFraOpprinneligVedtak = virkningstidspunktV2.find(
        ({ rolle }) => rolle.ident === values.rolle.ident
    ).begrunnelseFraOpprinneligVedtak;
    const erAldersjusteringsVedtakstype = vedtakstype === Vedtakstype.ALDERSJUSTERING;

    return (
        <Fragment key={activeTab}>
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && (
                <FormControlledCustomTextareaEditor
                    name={`roller.${fieldIndex}.begrunnelse`}
                    label={text.title.begrunnelse}
                    resize
                />
            )}
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && begrunnelseFraOpprinneligVedtak?.innhold && (
                <CustomTextareaEditor
                    name={`roller.${fieldIndex}.begrunnelseFraOpprinneligVedtak`}
                    label={text.label.begrunnelseFraOpprinneligVedtak}
                    value={begrunnelseFraOpprinneligVedtak.innhold}
                    resize
                    readOnly
                />
            )}
            <ActionButtons onNext={() => onStepChange(getNextStep(BarnebidragStepper.VIRKNINGSTIDSPUNKT))} />
        </Fragment>
    );
};

const VirkningstidspunktBarn = ({
    item,
    barnIndex,
    initialValues,
}: {
    item: VirkningstidspunktFormValuesPerBarn;
    barnIndex: number;
    initialValues: VirkningstidspunktFormValuesPerBarn;
}) => {
    const enhet = useQueryParams().get("enhet");
    const sessionState = useQueryParams().get("sessionState");
    const { lesemodus, setSaveErrorState } = useBehandlingProvider();
    const behandling = useGetBehandlingV2();
    const { setValue, clearErrors, getValues, watch, reset } = useFormContext();
    const oppdaterBehandling = useOnSaveVirkningstidspunkt();
    const oppdaterBeregnTilDato = useOnUpdateBeregnTilDato();
    const kunEtBarnIBehandlingen = behandling.virkningstidspunktV2.length === 1;
    const selectedVirkningstidspunkt = behandling.virkningstidspunktV2.find(
        ({ rolle }) => rolle.ident === item.rolle.ident
    );
    const [previousValues, setPreviousValues] = useState<VirkningstidspunktFormValuesPerBarn>(initialValues);
    const [initialVirkningsdato, setInitialVirkningsdato] = useState(selectedVirkningstidspunkt.virkningstidspunkt);
    const [showChangedVirkningsDatoAlert, setShowChangedVirkningsDatoAlert] = useState(false);

    useEffect(() => {
        if (
            initialVirkningsdato &&
            selectedVirkningstidspunkt.virkningstidspunkt &&
            initialVirkningsdato !== selectedVirkningstidspunkt.virkningstidspunkt &&
            selectedVirkningstidspunkt.avslag == null
        ) {
            setShowChangedVirkningsDatoAlert(true);
        }

        if (
            initialVirkningsdato &&
            showChangedVirkningsDatoAlert &&
            initialVirkningsdato === selectedVirkningstidspunkt.virkningstidspunkt
        ) {
            setShowChangedVirkningsDatoAlert(false);
        }

        if (!initialVirkningsdato && selectedVirkningstidspunkt.virkningstidspunkt) {
            setInitialVirkningsdato(selectedVirkningstidspunkt.virkningstidspunkt);
        }
    }, [selectedVirkningstidspunkt.virkningstidspunkt]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (
                (name === `roller.${barnIndex}.virkningstidspunkt` && !value.roller[barnIndex].virkningstidspunkt) ||
                (![`roller.${barnIndex}.begrunnelse`, `roller.${barnIndex}.begrunnelseVurderingAvSkolegang`].includes(
                    name
                ) &&
                    type === undefined) ||
                name === `roller.${barnIndex}.opphørsvarighet` ||
                name === `roller.${barnIndex}.opphørsdato`
            ) {
                return;
            }
            debouncedOnSave();
        });
        return () => subscription.unsubscribe();
    }, []);

    const onAarsakSelect = (value: string) => {
        const date = aarsakToVirkningstidspunktMapper(value, behandling, selectedVirkningstidspunkt);
        setValue(`roller.${barnIndex}.virkningstidspunkt`, date ? toISODateString(date) : null);
        clearErrors(`roller.${barnIndex}.virkningstidspunkt`);
    };
    const erÅrsakAvslagIkkeValgt = getValues(`roller.${barnIndex}.årsakAvslag`) === "";

    const [fom] = useFomTomDato(false, new Date(behandling.søktFomDato));

    const tom = useMemo(() => {
        const etterfølgendeVedtak =
            selectedVirkningstidspunkt.etterfølgendeVedtak && behandling.erKlageEllerOmgjøring
                ? dateOrNull(selectedVirkningstidspunkt.etterfølgendeVedtak?.virkningstidspunkt)
                : null;
        const opphørsdato = dateOrNull(selectedVirkningstidspunkt.opphørsdato);
        if (opphørsdato) return deductMonths(opphørsdato, 1);
        if (etterfølgendeVedtak) return deductMonths(etterfølgendeVedtak, 1);
        return addMonths(new Date(), 50 * 12);
    }, [selectedVirkningstidspunkt.opphørsdato]);

    const erSøktAVIkkeBM = behandling.søktAv !== SoktAvType.BIDRAGSMOTTAKER;
    const erTypeOpphør =
        behandling.vedtakstype === Vedtakstype.OPPHOR || behandling.opprinneligVedtakstype === Vedtakstype.OPPHOR;
    const erTypeOpphørOrLøpendeBidrag = erTypeOpphør || selectedVirkningstidspunkt.harLøpendeBidrag;
    const er18ÅrsBidrag = behandling.stønadstype === Stonadstype.BIDRAG18AAR;
    const virkningsårsaker = lesemodus
        ? årsakslisteAlle
        : er18ÅrsBidrag
          ? årsakListe18årsBidrag
          : selectedVirkningstidspunkt.harLøpendeBidrag
            ? harLøpendeBidragÅrsakListe
            : årsakListe;

    const onSave = () => {
        const values = getValues(`roller.${barnIndex}`);
        oppdaterBehandling.mutation.mutate(createPayload(values, selectedVirkningstidspunkt.rolle.id), {
            onSuccess: (response) => {
                oppdaterBehandling.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        virkningstidspunkt: response.virkningstidspunkt,
                        virkningstidspunktV2: response.virkningstidspunktV2,
                        boforhold: response.boforhold,
                        aktiveGrunnlagsdata: response.aktiveGrunnlagsdata,
                        inntekter: response.inntekter,
                        samvær: response.samvær,
                        underholdskostnader: response.underholdskostnader,
                        gebyr: response.gebyr,
                        ikkeAktiverteEndringerIGrunnlagsdata: response.ikkeAktiverteEndringerIGrunnlagsdata,
                    };
                });
                const updatedValues = createInitialValues(
                    response.virkningstidspunktV2,
                    response.stønadstype,
                    response.vedtakstype
                );
                const selectedBarn = Object.values(updatedValues.roller).find(
                    ({ rolle }) => rolle.ident === selectedVirkningstidspunkt.rolle.ident
                );
                setValue(`roller.${barnIndex}.opphørsdato`, selectedBarn.opphørsdato);
                setValue(`roller.${barnIndex}.opphørsvarighet`, selectedBarn.opphørsvarighet);
                setValue(
                    `roller.${barnIndex}.kanSkriveVurderingAvSkolegang`,
                    selectedBarn.kanSkriveVurderingAvSkolegang
                );
                setValue(`roller.${barnIndex}.beregnTilDato`, selectedBarn.beregnTilDato);
                setPreviousValues(selectedBarn);
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onSave(),
                    rollbackFn: () => {
                        reset(previousValues, {
                            keepIsSubmitSuccessful: true,
                            keepDirty: true,
                            keepIsSubmitted: true,
                        });
                    },
                });
            },
        });
    };

    const updateBeregnTilDato = (beregnTil: BeregnTil) => {
        oppdaterBeregnTilDato.mutation.mutate(
            { idRolle: selectedVirkningstidspunkt.rolle.id, beregnTil: beregnTil },
            {
                onSuccess: (response) => {
                    oppdaterBeregnTilDato.queryClientUpdater((currentData) => {
                        return {
                            ...currentData,
                            ...response,
                        };
                    });
                    const updatedValues = createInitialValues(
                        response.virkningstidspunktV2,
                        response.stønadstype,
                        response.vedtakstype
                    );
                    const selectedBarn = Object.values(updatedValues.roller).find(
                        ({ rolle }) => rolle.ident === selectedVirkningstidspunkt.rolle.ident
                    );
                    setValue(`roller.${barnIndex}.beregnTilDato`, selectedBarn.beregnTilDato);
                    setPreviousValues(selectedBarn);
                },
                onError: () => {
                    setSaveErrorState({
                        error: true,
                        retryFn: () => updateBeregnTilDato(beregnTil),
                        rollbackFn: () => {
                            reset(previousValues, {
                                keepIsSubmitSuccessful: true,
                                keepDirty: true,
                                keepIsSubmitted: true,
                            });
                        },
                    });
                },
            }
        );
    };

    const debouncedOnSave = useDebounce(onSave);

    return (
        <>
            <FlexRow className="gap-x-12">
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søknadstype}:</Label>
                    <BodyShort size="small">{hentVisningsnavn(behandling.vedtakstype)}</BodyShort>
                    <KlagetPåVedtakButton />
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søknadfra}:</Label>
                    <BodyShort size="small">{SOKNAD_LABELS[behandling.søktAv]}</BodyShort>
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.mottattdato}:</Label>
                    <BodyShort size="small">{DateToDDMMYYYYString(new Date(behandling.mottattdato))}</BodyShort>
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søktfradato}:</Label>
                    <BodyShort size="small">{DateToDDMMYYYYString(new Date(behandling.søktFomDato))}</BodyShort>
                </div>
                {behandling.erKlageEllerOmgjøring && selectedVirkningstidspunkt.opprinneligVedtakstidspunkt && (
                    <div className="flex gap-x-2">
                        <Label size="small">{text.label.opprinneligvedtakstidspunkt}:</Label>
                        <BodyShort size="small">
                            {DateToDDMMYYYYString(dateOrNull(selectedVirkningstidspunkt.opprinneligVedtakstidspunkt))}
                        </BodyShort>
                        <OpprinneligVedtakButton />
                    </div>
                )}
            </FlexRow>

            <FlexRow className="gap-x-8">
                {behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING && (
                    <FormControlledSelectField
                        name={`roller.${barnIndex}.årsakAvslag`}
                        label={text.label.årsak}
                        onSelect={onAarsakSelect}
                        className="w-max"
                    >
                        {lesemodus && (
                            <option value={getValues(`roller.${barnIndex}.årsakAvslag`)}>
                                {hentVisningsnavnVedtakstype(
                                    getValues(`roller.${barnIndex}.årsakAvslag`),
                                    behandling.vedtakstype
                                )}
                            </option>
                        )}
                        {!lesemodus && erÅrsakAvslagIkkeValgt && (
                            <option value="">{text.select.årsakAvslagPlaceholder}</option>
                        )}
                        {!lesemodus && !erTypeOpphør && (
                            <optgroup label={text.label.årsak}>
                                {virkningsårsaker
                                    .filter((value) => {
                                        if (kunEtBarnIBehandlingen) return true;
                                        return value !== TypeArsakstype.FRABARNETSFODSEL;
                                    })
                                    .map((value) => (
                                        <option key={value} value={value}>
                                            {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                        </option>
                                    ))}
                            </optgroup>
                        )}

                        {!lesemodus && er18ÅrsBidrag ? (
                            <optgroup label={erTypeOpphørOrLøpendeBidrag ? text.label.opphør : text.label.avslag}>
                                {(erTypeOpphørOrLøpendeBidrag ? avslagsListe18ÅrOpphør : avslagsListe18År).map(
                                    (value) => (
                                        <option key={value} value={value}>
                                            {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                        </option>
                                    )
                                )}
                            </optgroup>
                        ) : (
                            <optgroup label={erTypeOpphørOrLøpendeBidrag ? text.label.opphør : text.label.avslag}>
                                {(lesemodus
                                    ? avslaglisteAlle
                                    : erTypeOpphørOrLøpendeBidrag
                                      ? avslagsListeOpphør
                                      : avslagsListe
                                ).map((value) => (
                                    <option key={value} value={value}>
                                        {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                    </option>
                                ))}
                                {avslagsListeDeprekert.includes(getValues(`roller.${barnIndex}.årsakAvslag`)) && (
                                    <>
                                        {avslagsListeDeprekert.map((value) => (
                                            <option key={value} value={value} disabled>
                                                {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </optgroup>
                        )}
                        {!lesemodus && (
                            <optgroup label={text.label.avvisning}>
                                {(erSøktAVIkkeBM && erTypeOpphør ? avvisningsListeOpphør : avvisningsListe).map(
                                    (value) => (
                                        <option key={value} value={value}>
                                            {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                        </option>
                                    )
                                )}
                            </optgroup>
                        )}
                    </FormControlledSelectField>
                )}
                {!avvisningsListeOpphør.includes(selectedVirkningstidspunkt.avslag) && (
                    <HStack gap={"2"}>
                        <FormControlledMonthPicker
                            name={`roller.${barnIndex}.virkningstidspunkt`}
                            label={text.label.virkningstidspunkt}
                            placeholder="DD.MM.ÅÅÅÅ"
                            defaultValue={initialValues.virkningstidspunkt}
                            fromDate={fom}
                            toDate={tom}
                            readonly={lesemodus || behandling.vedtakstype === Vedtakstype.ALDERSJUSTERING}
                            required
                        />
                    </HStack>
                )}
            </FlexRow>

            {showChangedVirkningsDatoAlert && (
                <BehandlingAlert variant="warning" className={"w-[488px]"}>
                    <div dangerouslySetInnerHTML={{ __html: text.alert.endretVirkningstidspunkt }}></div>
                </BehandlingAlert>
            )}

            <Opphør
                item={item}
                barnIndex={barnIndex}
                initialValues={initialValues}
                previousValues={previousValues}
                setPreviousValues={setPreviousValues}
            />

            {behandling.erKlageEllerOmgjøring && (
                <>
                    <RadioGroup
                        name={`roller.${barnIndex}.beregnTil`}
                        legend="Velg hvilken periode vedtaket skal vurderes"
                        size="small"
                        onChange={updateBeregnTilDato}
                        readOnly={lesemodus}
                        className="w-[550px]"
                        defaultValue={initialValues.beregnTil}
                    >
                        <Radio
                            value={BeregnTil.OPPRINNELIG_VEDTAKSTIDSPUNKT}
                            description={`Beregn og periodiser til og med måneden opprinnelig vedtak ble fattet. Etterfølgende vedtak vil løpe etter beregningsperioden.`}
                        >
                            Ut måneden opprinnelig vedtak ble fattet
                        </Radio>
                        <Radio
                            value={BeregnTil.INNEVAeRENDEMANED}
                            description="Beregn og periodiser ut nåværende måned. Dette vil overskrive perioder fra etterfølgende vedtak"
                        >
                            Ut nåværende måned
                        </Radio>
                        <Radio
                            value={BeregnTil.ETTERFOLGENDEMANUELLVEDTAK}
                            readOnly={selectedVirkningstidspunkt.etterfølgendeVedtak === undefined}
                            description={
                                selectedVirkningstidspunkt.etterfølgendeVedtak
                                    ? `Beregn og periodiser fram til etterfølgende vedtak med virkningstidspunkt ${DateToDDMMYYYYString(dateOrNull(selectedVirkningstidspunkt.etterfølgendeVedtak?.virkningstidspunkt))}. Etterfølgende vedtak vil løpe etter beregningsperioden.`
                                    : ""
                            }
                        >
                            <div className="flex flex-row gap-2">
                                {" "}
                                <div>Til etterfølgende vedtak</div>
                                {selectedVirkningstidspunkt.etterfølgendeVedtak && (
                                    <Link
                                        className="w-max"
                                        to={`/sak/${behandling.saksnummer}/vedtak/${selectedVirkningstidspunkt.etterfølgendeVedtak?.vedtaksid}/?steg=vedtak&enhet=${enhet}&sessionState=${sessionState}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <BodyShort size="small">
                                            <ExternalLinkIcon aria-hidden />
                                        </BodyShort>
                                    </Link>
                                )}
                            </div>
                        </Radio>
                    </RadioGroup>

                    <Beregningsperiode barnIndex={barnIndex} />
                </>
            )}

            {er18ÅrsBidrag && !erTypeOpphør && !(lesemodus && !item.kanSkriveVurderingAvSkolegang) && (
                <>
                    <FormControlledCustomTextareaEditor
                        name={`roller.${barnIndex}.begrunnelseVurderingAvSkolegang`}
                        label={text.title.begrunnelseVurderingAvSkolegang}
                        readOnly={!getValues(`roller.${barnIndex}.kanSkriveVurderingAvSkolegang`)}
                        resize
                    />
                    {selectedVirkningstidspunkt.begrunnelseVurderingAvSkolegangFraOpprinneligVedtak?.innhold && (
                        <CustomTextareaEditor
                            name={`roller.${barnIndex}.begrunnelseVurderingAvSkolegangFraOpprinneligVedtak`}
                            label={text.label.vurderingAvSkolegangOpprinneligVedtak}
                            value={
                                selectedVirkningstidspunkt.begrunnelseVurderingAvSkolegangFraOpprinneligVedtak.innhold
                            }
                            resize
                            readOnly
                        />
                    )}
                </>
            )}

            <VedtaksListeVirkningstidspunkt barnIdent={item.rolle.ident} omgjøring={false} />
        </>
    );
};

const Main = ({ initialValues }: { initialValues: VirkningstidspunktFormValues }) => {
    const { control } = useFormContext<VirkningstidspunktFormValues>();
    const { onNavigateToTab } = useBehandlingProvider();
    const [searchParams] = useSearchParams();
    const roller = useFieldArray({
        control,
        name: "roller",
    });
    const watchFieldArray = useWatch({ control, name: "roller" });
    const controlledFields = roller.fields.map((field, index) => ({
        ...field,
        ...watchFieldArray?.[index],
    }));

    const defaultTab = useMemo(() => {
        const barnIdent = controlledFields.find(({ rolle }) => rolle.ident === searchParams.get(urlSearchParams.tab))
            ?.rolle?.ident;
        return barnIdent ?? controlledFields[0].rolle.ident;
    }, []);
    const selectedTab = searchParams.get(urlSearchParams.tab) ?? defaultTab;

    if (controlledFields.length > 1) {
        return (
            <Tabs
                defaultValue={defaultTab}
                value={selectedTab}
                onChange={onNavigateToTab}
                className="lg:max-w-[960px] md:max-w-[720px] sm:max-w-[598px] w-full"
            >
                <Tabs.List>
                    {controlledFields.map(({ rolle }) => (
                        <Tabs.Tab
                            key={rolle.ident}
                            value={rolle.ident}
                            label={`${ROLE_FORKORTELSER.BA} ${rolle.ident}`}
                        />
                    ))}
                </Tabs.List>
                {controlledFields.map((item, index) => {
                    return (
                        <Tabs.Panel key={item.rolle.ident} value={item.rolle.ident} className="grid gap-y-4 py-4">
                            <VirkningstidspunktBarn
                                item={item}
                                barnIndex={index}
                                initialValues={initialValues.roller[index]}
                            />
                        </Tabs.Panel>
                    );
                })}
            </Tabs>
        );
    }

    return (
        <div className="grid gap-y-4 py-4">
            <VirkningstidspunktBarn
                key={controlledFields[0].id}
                item={controlledFields[0]}
                barnIndex={0}
                initialValues={initialValues.roller[0]}
            />
        </div>
    );
};

const VirkningstidspunktForm = () => {
    const { virkningstidspunktV2, stønadstype, vedtakstype } = useGetBehandlingV2();
    const { setPageErrorsOrUnsavedState } = useBehandlingProvider();
    const initialValues = createInitialValues(virkningstidspunktV2, stønadstype, vedtakstype);

    const useFormMethods = useForm({
        defaultValues: initialValues,
    });

    useEffect(() => {
        setPageErrorsOrUnsavedState((prevState) => ({
            ...prevState,
            virkningstidspunkt: {
                error: !ObjectUtils.isEmpty(useFormMethods.formState.errors),
            },
        }));
    }, [JSON.stringify(useFormMethods.formState.errors)]);

    return (
        <>
            <FormProvider {...useFormMethods}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <NewFormLayout
                        title={text.label.virkningstidspunkt}
                        main={<Main initialValues={initialValues} />}
                        side={<Side />}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default () => {
    return (
        <QueryErrorWrapper>
            <VirkningstidspunktForm />
        </QueryErrorWrapper>
    );
};
