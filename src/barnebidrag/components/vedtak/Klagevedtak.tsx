import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { AdminButtons } from "@common/components/vedtak/AdminButtons";
import VedtakWrapper from "@common/components/vedtak/VedtakWrapper";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetBeregningBidrag } from "@common/hooks/useApiData";
import { Alert, BodyShort, Heading, Skeleton, Table, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { ResultatBidragsberegningBarnDto, Vedtakstype } from "../../../api/BidragBehandlingApiV1";
import { ActionButtons } from "../../../common/components/ActionButtons";
import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { VedtakBarnebidragBeregningResult } from "../../../types/vedtakTypes";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { STEPS } from "../../constants/steps";
import { BarnebidragStepper } from "../../enum/BarnebidragStepper";
import { GrunnlagFraVedtakButton, VedtakResultatBarn, VedtakTableBody, VedtakTableHeader } from "./VedtakCommon";

const Klagevedtak = () => {
    const { behandlingId, activeStep, lesemodus } = useBehandlingProvider();
    const { erVedtakFattet } = useGetBehandlingV2();
    const queryClient = useQueryClient();
    const beregning = queryClient.getQueryData<VedtakBarnebidragBeregningResult>(QueryKeys.beregnBarnebidrag(false));

    useEffect(() => {
        queryClient.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
        queryClient.refetchQueries({ queryKey: QueryKeys.beregnBarnebidrag(false) });
    }, [activeStep]);

    return (
        <div className="grid gap-y-8  w-[1150px]">
            {erVedtakFattet && !lesemodus && <Alert variant="warning">Vedtak er fattet for behandling</Alert>}
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
    const avvistAldersjustering = resultatBarn.perioder.every(
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
    return (
        <Table size="small">
            <VedtakTableHeader
                avslag={erAvslag}
                avvistAldersjustering={avvistAldersjustering}
                resultatUtenBeregning={resultatBarn.resultatUtenBeregning}
            />
            <VedtakTableBody
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                opphør={vedtakstype === Vedtakstype.OPPHOR}
            />
        </Table>
    );
};

const Side = () => {
    const { onStepChange } = useBehandlingProvider();

    const onNext = () => onStepChange(STEPS[BarnebidragStepper.VEDTAK_ENDELIG]);

    return (
        <>
            <ActionButtons onNext={onNext} />
        </>
    );
};

export default () => {
    return (
        <QueryErrorWrapper>
            <Klagevedtak />
            <Side />
            <div className="my-3" />
            <AdminButtons />
        </QueryErrorWrapper>
    );
};
