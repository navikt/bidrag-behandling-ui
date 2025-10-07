import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { AdminButtons } from "@common/components/vedtak/AdminButtons";
import { FatteVedtakButtons } from "@common/components/vedtak/FatteVedtakButtons";
import VedtakWrapper from "@common/components/vedtak/VedtakWrapper";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetBeregningBidrag } from "@common/hooks/useApiData";
import { Alert, BodyShort, Heading, Skeleton, Table, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ResultatBidragsberegningBarnDto, Vedtakstype } from "../../../api/BidragBehandlingApiV1";
import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { VedtakBarnebidragBeregningResult } from "../../../types/vedtakTypes";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { STEPS } from "../../constants/steps";
import { GrunnlagFraVedtakButton, VedtakResultatBarn, VedtakTableBody, VedtakTableHeader } from "./VedtakCommon";

const Vedtak = () => {
    const { behandlingId, activeStep, lesemodus } = useBehandlingProvider();
    const {
        erVedtakFattet,
        erDelvedtakFattet,
        kanBehandlesINyLøsning,
        lesemodus: lesemodusBehandling,
        vedtakstype,
    } = useGetBehandlingV2();
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const beregning = queryClient.getQueryData<VedtakBarnebidragBeregningResult>(QueryKeys.beregnBarnebidrag(false));
    const isBeregningError = queryClient.getQueryState(QueryKeys.beregnBarnebidrag(false))?.status === "error";
    const lastetFørstegang = useRef(false);

    useEffect(() => {
        if (lastetFørstegang.current) {
            queryClient.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
            queryClient.refetchQueries({ queryKey: QueryKeys.beregnBarnebidrag(false) });
        }
        lastetFørstegang.current = true;
        if (lesemodusBehandling?.erOrkestrertVedtak || (vedtakstype === Vedtakstype.KLAGE && !lesemodus)) {
            const searchParams = new URLSearchParams(location.search);

            searchParams.set("steg", "vedtak_endelig");

            navigate({
                pathname: location.pathname,
                search: searchParams.toString(),
            });
        }
    }, [activeStep]);

    return (
        <div className="grid gap-y-8  w-[1150px]">
            {erVedtakFattet && !lesemodus && <Alert variant="warning">Vedtak er fattet for behandling</Alert>}
            {!erVedtakFattet && erDelvedtakFattet && !lesemodus && (
                <Alert variant="warning">
                    Vedtak er delvis fattet og kan derfor ikke endres. Det har skjedd en feil ved fatting av vedtak.
                    Prøv å på nytt eller opprett fagsystemsak
                </Alert>
            )}
            <div className="grid gap-y-2">
                <Heading level="2" size="medium">
                    {text.title.vedtak}
                </Heading>
            </div>
            <div className="grid gap-y-2">
                {!beregning?.feil && (
                    <div className="flex flex-row">
                        <Heading level="3" size="small">
                            {text.title.oppsummering}
                        </Heading>
                        <GrunnlagFraVedtakButton />
                    </div>
                )}

                <VedtakResultat />
            </div>

            {!beregning?.feil && !lesemodus && !beregning?.ugyldigBeregning && (
                <FatteVedtakButtons
                    isBeregningError={isBeregningError}
                    disabled={!kanBehandlesINyLøsning}
                    opprettesForsendelse={beregning?.resultat?.resultatBarn?.some(
                        (r) => r.forsendelseDistribueresAutomatisk
                    )}
                />
            )}
            <AdminButtons />
        </div>
    );
};

const VedtakUgyldigBeregning = ({ resultat }: { resultat: ResultatBidragsberegningBarnDto }) => {
    if (!resultat.ugyldigBeregning) return null;
    return (
        <Alert variant="warning" size="small" className="mb-2">
            <Heading size="small">{resultat.ugyldigBeregning.tittel}</Heading>
            <BodyShort size="small">Kan ikke fatte vedtak</BodyShort>
            <BodyShort size="small">{resultat.ugyldigBeregning.begrunnelse}</BodyShort>
        </Alert>
    );
};

const VedtakResultat = () => {
    const { data: beregning } = useGetBeregningBidrag(false);

    return (
        <VedtakWrapper feil={beregning.feil} steps={STEPS}>
            {beregning.resultat?.resultatBarn?.map((r, i) => {
                return (
                    <div key={i + r.barn.ident + r.barn.navn} className="mb-8">
                        <VedtakResultatBarn barn={r.barn} />
                        <VedtakUgyldigBeregning resultat={r} />
                        {r.indeksår && (
                            <ResultatDescription
                                data={[
                                    {
                                        label: "Neste indeksår",
                                        textRight: false,
                                        labelBold: true,
                                        value: r.indeksår,
                                    },
                                ].filter((d) => d)}
                            />
                        )}
                        {r.barn.innbetaltBeløp && (
                            <ResultatDescription
                                data={[
                                    {
                                        label: "Innbetalt beløp",
                                        textRight: false,
                                        labelBold: true,
                                        value: formatterBeløpForBeregning(r.barn.innbetaltBeløp),
                                    },
                                ].filter((d) => d)}
                            />
                        )}
                        <BeregningTabellBarn resultatBarn={r} />
                    </div>
                );
            })}
        </VedtakWrapper>
    );
};
const BeregningTabellBarn = ({ resultatBarn }: { resultatBarn: ResultatBidragsberegningBarnDto }) => {
    const { isFetching, isLoading } = useGetBeregningBidrag(false);

    const {
        virkningstidspunkt: { avslag },
        vedtakstype,
    } = useGetBehandlingV2();

    const erAvslag = avslag !== null && avslag !== undefined;
    const avvistAldersjustering =
        resultatBarn.perioder.length > 0 &&
        resultatBarn.perioder.every(
            (p) => p.aldersjusteringDetaljer != null && p.aldersjusteringDetaljer?.aldersjustert === false
        );
    if (isFetching && !isLoading) {
        return (
            <VStack gap="2" className="w-full">
                <BodyShort size="small">Beregner</BodyShort>
                <Skeleton variant="rectangle" width="100%" height={20} />
                <Skeleton variant="rectangle" width="100%" height={20} />
                <Skeleton variant="rectangle" width="100%" height={20} />
            </VStack>
        );
    }
    if (resultatBarn.erAvvisning) {
        return (
            <Alert variant="info">
                Vedtaket er avslag av behandlingen og har derfor ingen perioder. Vedtaket vil ikke føre til noe
                endringer i regnskapet.
            </Alert>
        );
    }
    return (
        <Table size="small">
            <VedtakTableHeader
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                avvistAldersjustering={avvistAldersjustering}
                resultatUtenBeregning={resultatBarn.resultatUtenBeregning}
                bareVisResultat={vedtakstype === Vedtakstype.INDEKSREGULERING}
            />
            <VedtakTableBody
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                opphør={vedtakstype === Vedtakstype.OPPHOR}
                bareVisResultat={vedtakstype === Vedtakstype.INDEKSREGULERING}
            />
        </Table>
    );
};
export default () => {
    return (
        <QueryErrorWrapper>
            <Vedtak />
        </QueryErrorWrapper>
    );
};
