import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { AdminButtons } from "@common/components/vedtak/AdminButtons";
import { FatteVedtakButtons } from "@common/components/vedtak/FatteVedtakButtons";
import VedtakWrapper from "@common/components/vedtak/VedtakWrapper";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetBeregningBidrag } from "@common/hooks/useApiData";
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { LoggerService } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Box, BoxProps, Heading, Link, Table, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { DelvedtakDto, ResultatBidragsberegningBarnDto, Vedtakstype } from "../../../api/BidragBehandlingApiV1";
import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { useQueryParams } from "../../../common/hooks/useQueryParams";
import { hentVisningsnavn } from "../../../common/hooks/useVisningsnavn";
import { VedtakBarnebidragBeregningResult } from "../../../types/vedtakTypes";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { STEPS } from "../../constants/steps";
import { VedtakResultatBarn, VedtakTableBody, VedtakTableHeader, VelgManuellVedtakModal } from "./VedtakCommon";

const VedtakEndelig = () => {
    const { behandlingId, activeStep, lesemodus } = useBehandlingProvider();
    const { erVedtakFattet, kanBehandlesINyLøsning } = useGetBehandlingV2();
    const queryClient = useQueryClient();
    const { isFatteVedtakEnabled } = useFeatureToogle();
    const beregning = queryClient.getQueryData<VedtakBarnebidragBeregningResult>(QueryKeys.beregnBarnebidrag(true));
    const isBeregningError = queryClient.getQueryState(QueryKeys.beregnBarnebidrag(true))?.status === "error";

    useEffect(() => {
        console.log(activeStep);
        queryClient.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
        queryClient.refetchQueries({ queryKey: QueryKeys.beregnBarnebidrag(true) });
        LoggerService.info("Vedtak component mounted");
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

            {!beregning?.feil && !lesemodus && isFatteVedtakEnabled && !beregning?.ugyldigBeregning && (
                <FatteVedtakButtons
                    isBeregningError={isBeregningError}
                    disabled={!kanBehandlesINyLøsning || !isFatteVedtakEnabled}
                    opprettesForsendelse={beregning?.resultat?.resultatBarn?.some(
                        (r) => r.forsendelseDistribueresAutomatisk
                    )}
                />
            )}
            <AdminButtons />
        </div>
    );
};

const VetakLenke = ({ vedtaksid, visText = false }: { vedtaksid?: number; visText?: boolean }) => {
    const { saksnummer } = useGetBehandlingV2();
    const enhet = useQueryParams().get("enhet");
    const sessionState = useQueryParams().get("sessionState");

    if (!vedtaksid) return null;
    return (
        <Link
            className="ml-auto"
            href={`/sak/${saksnummer}/vedtak/${vedtaksid}/?steg=vedtak&enhet=${enhet}&sessionState=${sessionState}`}
            target="_blank"
            rel="noreferrer"
        >
            {visText ? "Grunnlag fra vedtak" : ""} <ExternalLinkIcon aria-hidden />
        </Link>
    );
};

const GrunnlagFraVedtakButton = () => {
    const { grunnlagFraVedtaksid } = useGetBehandlingV2();

    return <VetakLenke vedtaksid={grunnlagFraVedtaksid} visText />;
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
    const { data: beregning } = useGetBeregningBidrag(true);

    const hentTittelVedtak = (delvedtak: DelvedtakDto) => {
        if (delvedtak.klagevedtak) return "Klagevedtak";
        if (delvedtak.delvedtak === false) return "Endelig vedtak";
        if (delvedtak.gjenopprettetBeløpshistorikk) return "Gjenopprettet beløpshistorikk";
        return `${hentVisningsnavn(delvedtak.type)}`;
    };
    const boxConfig = (delvedtak: DelvedtakDto): BoxProps => {
        if (delvedtak.klagevedtak)
            return {
                shadow: "medium",
                background: "surface-transparent",
                padding: "4",
                borderWidth: "1",
                borderColor: "border-subtle",
                borderRadius: "medium",
            };
        if (delvedtak.delvedtak === false)
            return {
                shadow: "xsmall",
                className: "mt-2",
                background: "surface-transparent",
                padding: "4",
                borderWidth: "2",
                borderColor: "border-subtle",
                borderRadius: "medium",
            };
        return {
            shadow: "xsmall",
            background: "surface-transparent",
            padding: "4",
            borderColor: "border-subtle",
            borderRadius: "small",
        };
    };
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
                        <VStack gap="4">
                            {r.delvedtak.map((delvedtak, i) => {
                                const avvistAldersjustering = delvedtak.perioder.every(
                                    (p) =>
                                        p.aldersjusteringDetaljer != null &&
                                        p.aldersjusteringDetaljer?.aldersjustert === false
                                );

                                const vedtakstype = delvedtak.type;
                                const periode = delvedtak.perioder[0];
                                const manuellAldersjustering = delvedtak.perioder.some(
                                    (p) => p.aldersjusteringDetaljer?.aldersjusteresManuelt === true
                                );
                                const aldersjusteresForÅr = new Date(periode.periode.fom).getFullYear();
                                const valgtVedtak = r.barn?.grunnlagFraVedtak?.some(
                                    (v) => v.aldersjusteringForÅr === aldersjusteresForÅr && v.vedtak != null
                                );
                                return (
                                    <VStack>
                                        <Box {...boxConfig(delvedtak)}>
                                            <Heading size="small" className="mb-2 inline-flex gap-2 mr-2">
                                                {hentTittelVedtak(delvedtak)}
                                                <VetakLenke vedtaksid={delvedtak.vedtaksid} />
                                            </Heading>
                                            {(manuellAldersjustering || valgtVedtak) && (
                                                <VelgManuellVedtakModal
                                                    barnIdent={r.barn.ident}
                                                    aldersjusteringForÅr={new Date(periode.periode.fom).getFullYear()}
                                                />
                                            )}
                                            <ResultatTabell
                                                key={i + `Delvedtak ${hentVisningsnavn(vedtakstype)}`}
                                                erAvslag={false}
                                                avvistAldersjustering={avvistAldersjustering}
                                                gjenopprettetBeløpshistorikk={
                                                    delvedtak.gjenopprettetBeløpshistorikk ||
                                                    delvedtak.type === Vedtakstype.INNKREVING ||
                                                    delvedtak.type === Vedtakstype.OPPHOR
                                                }
                                                resultatBarn={{
                                                    ...r,
                                                    perioder: delvedtak.perioder,
                                                    resultatUtenBeregning:
                                                        delvedtak.type === Vedtakstype.INDEKSREGULERING ||
                                                        (!delvedtak.delvedtak && !delvedtak.klagevedtak),
                                                }}
                                                erOpphor={vedtakstype === Vedtakstype.OPPHOR}
                                            />
                                        </Box>
                                    </VStack>
                                );
                            })}
                        </VStack>
                    </div>
                );
            })}
        </VedtakWrapper>
    );
};

type ResultatTabellProps = {
    erAvslag: boolean;
    erOpphor?: boolean;
    avvistAldersjustering: boolean;
    resultatBarn: ResultatBidragsberegningBarnDto;
    gjenopprettetBeløpshistorikk?: boolean;
};

const ResultatTabell = ({
    erAvslag,
    avvistAldersjustering,
    resultatBarn,
    erOpphor,
    gjenopprettetBeløpshistorikk,
}: ResultatTabellProps) => {
    return (
        <Table size="small">
            <VedtakTableHeader
                avslag={erAvslag}
                avvistAldersjustering={avvistAldersjustering}
                resultatUtenBeregning={resultatBarn.resultatUtenBeregning}
                bareVisResultat={gjenopprettetBeløpshistorikk}
            />
            <VedtakTableBody
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                opphør={erOpphor}
                bareVisResultat={gjenopprettetBeløpshistorikk}
            />
        </Table>
    );
};

export default () => {
    return (
        <QueryErrorWrapper>
            <VedtakEndelig />
        </QueryErrorWrapper>
    );
};
