import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { AdminButtons } from "@common/components/vedtak/AdminButtons";
import { FatteVedtakButtons } from "@common/components/vedtak/FatteVedtakButtons";
import VedtakWrapper from "@common/components/vedtak/VedtakWrapper";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetBeregningBidrag } from "@common/hooks/useApiData";
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Alert, BodyShort, Heading, HStack, Link, Skeleton, Table, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { ResultatBidragsberegningBarnDto, Vedtakstype } from "../../../api/BidragBehandlingApiV1";
import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { useQueryParams } from "../../../common/hooks/useQueryParams";
import { hentVisningsnavn } from "../../../common/hooks/useVisningsnavn";
import { VedtakBarnebidragBeregningResult } from "../../../types/vedtakTypes";
import { dateOrNull, DateToMMYYYYString } from "../../../utils/date-utils";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { STEPS } from "../../constants/steps";
import { VedtakResultatBarn, VedtakTableBody, VedtakTableHeader } from "./VedtakCommon";

const VedtakEndelig = () => {
    const { behandlingId, activeStep, lesemodus } = useBehandlingProvider();
    const { erVedtakFattet, kanBehandlesINyLøsning } = useGetBehandlingV2();
    const queryClient = useQueryClient();
    const { isFatteVedtakEnabled } = useFeatureToogle();
    const beregning = queryClient.getQueryData<VedtakBarnebidragBeregningResult>(QueryKeys.beregnBarnebidrag(true));
    const isBeregningError = queryClient.getQueryState(QueryKeys.beregnBarnebidrag(true))?.status === "error";
    const lastetFørstegang = useRef(false);

    useEffect(() => {
        if (lastetFørstegang.current) {
            queryClient.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
            queryClient.refetchQueries({ queryKey: QueryKeys.beregnBarnebidrag(true) });
        }
        lastetFørstegang.current = true;
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

export const VedtakLenke = ({ vedtaksid, visText = false }: { vedtaksid?: number; visText?: boolean | string }) => {
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
            {typeof visText == "boolean" && visText ? "Grunnlag fra vedtak" : typeof visText == "string" ? visText : ""}{" "}
            <ExternalLinkIcon aria-hidden />
        </Link>
    );
};

const GrunnlagFraVedtakButton = () => {
    const { grunnlagFraVedtaksid } = useGetBehandlingV2();

    return <VedtakLenke vedtaksid={grunnlagFraVedtaksid} visText />;
};
const VedtakUgyldigBeregning = ({ resultat }: { resultat: ResultatBidragsberegningBarnDto }) => {
    if (!resultat.ugyldigBeregning) return null;
    return (
        <Alert variant="warning" size="small" className="mb-2">
            <Heading size="small">{resultat.ugyldigBeregning.tittel}</Heading>
            <BodyShort size="small">Kan ikke fatte vedtak</BodyShort>
            <BodyShort size="small">{resultat.ugyldigBeregning.begrunnelse}</BodyShort>
            <BodyShort spacing>
                <BodyShort size="small">Gjelder følgende vedtak:</BodyShort>
                <HStack gap="2" className="justify-self-start">
                    <BodyShort size="small">
                        {resultat.ugyldigBeregning.vedtaksliste.map((v) => {
                            return (
                                <div className="flex flex-row gap-2">
                                    <div>
                                        Vedtak med virkningstidspunkt{" "}
                                        {DateToMMYYYYString(dateOrNull(v.virkningstidspunkt))}
                                    </div>
                                    <VedtakLenke vedtaksid={v.vedtaksid} visText={false} />
                                </div>
                            );
                        })}
                    </BodyShort>
                </HStack>
            </BodyShort>
        </Alert>
    );
};

const VedtakResultat = () => {
    const { data: beregning } = useGetBeregningBidrag(true);

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

function BeregningTabellBarn({ resultatBarn }: { resultatBarn: ResultatBidragsberegningBarnDto }) {
    const { isFetching, isLoading } = useGetBeregningBidrag(true);

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
        <VStack gap="4">
            {resultatBarn.delvedtak
                .filter((d) => !d.delvedtak && !d.klagevedtak)
                .map((delvedtak, i) => {
                    const avvistAldersjustering = delvedtak.perioder.every(
                        (p) => p.aldersjusteringDetaljer != null && p.aldersjusteringDetaljer?.aldersjustert === false
                    );

                    const vedtakstype = delvedtak.type;

                    const manuellAldersjustering = delvedtak.perioder.some(
                        (p) => p?.klageOmgjøringDetaljer?.manuellAldersjustering
                    );

                    return (
                        <VStack>
                            <ResultatTabell
                                key={i + `Delvedtak ${hentVisningsnavn(vedtakstype)}`}
                                erAvslag={false}
                                avvistAldersjustering={avvistAldersjustering}
                                beregnet={
                                    delvedtak.beregnet ||
                                    (delvedtak.type !== Vedtakstype.INNKREVING && delvedtak.type !== Vedtakstype.OPPHOR)
                                }
                                manuellAldersjustering={manuellAldersjustering}
                                resultatBarn={{
                                    ...resultatBarn,
                                    perioder: delvedtak.perioder,
                                    resultatUtenBeregning: delvedtak.type === Vedtakstype.INDEKSREGULERING,
                                }}
                                erOpphor={vedtakstype === Vedtakstype.OPPHOR}
                            />
                            <BodyShort size="small">
                                <HStack gap="2">
                                    <div>Innkreves fra</div>
                                    <div>{DateToMMYYYYString(dateOrNull(resultatBarn.innkrevesFraDato))}</div>
                                </HStack>
                            </BodyShort>
                        </VStack>
                    );
                })}
        </VStack>
    );
}

type ResultatTabellProps = {
    erAvslag: boolean;
    erOpphor?: boolean;
    avvistAldersjustering: boolean;
    resultatBarn: ResultatBidragsberegningBarnDto;
    beregnet?: boolean;
    manuellAldersjustering?: boolean;
};

const ResultatTabell = ({
    erAvslag,
    avvistAldersjustering,
    resultatBarn,
    erOpphor,
    beregnet,
    manuellAldersjustering,
}: ResultatTabellProps) => {
    return (
        <Table size="small">
            <VedtakTableHeader
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                avvistAldersjustering={avvistAldersjustering}
                resultatUtenBeregning={resultatBarn.resultatUtenBeregning}
                bareVisResultat={!beregnet}
                orkestrertVedtak
                manuellAldersjustering={manuellAldersjustering}
            />
            <VedtakTableBody
                resultatBarn={resultatBarn}
                avslag={erAvslag}
                orkestrertVedtak
                opphør={erOpphor}
                bareVisResultat={!beregnet}
                manuellAldersjustering={manuellAldersjustering}
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
