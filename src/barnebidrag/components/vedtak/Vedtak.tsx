import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { AdminButtons } from "@common/components/vedtak/AdminButtons";
import { FatteVedtakButtons } from "@common/components/vedtak/FatteVedtakButtons";
import VedtakWrapper from "@common/components/vedtak/VedtakWrapper";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetBeregningBidrag } from "@common/hooks/useApiData";
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { dateToDDMMYYYYString, deductDays, PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Heading, Link, Table } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";

import {
    ResultatBarnebidragsberegningPeriodeDto,
    ResultatBidragsberegningBarnDto,
    ResultatRolle,
    Rolletype,
    Samvaersklasse,
    Vedtakstype,
} from "../../../api/BidragBehandlingApiV1";
import { RolleTag } from "../../../common/components/RolleTag";
import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { useQueryParams } from "../../../common/hooks/useQueryParams";
import { hentVisningsnavn } from "../../../common/hooks/useVisningsnavn";
import { VedtakBarnebidragBeregningResult } from "../../../types/vedtakTypes";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { STEPS } from "../../constants/steps";
import { DetaljertBeregningBidrag } from "./DetaljertBeregningBidrag";

const Vedtak = () => {
    const { behandlingId, activeStep, lesemodus } = useBehandlingProvider();
    const { erVedtakFattet, kanBehandlesINyLøsning } = useGetBehandlingV2();
    const queryClient = useQueryClient();
    const { isFatteVedtakEnabled } = useFeatureToogle();
    const beregning = queryClient.getQueryData<VedtakBarnebidragBeregningResult>(QueryKeys.beregnBarnebidrag());
    const isBeregningError = queryClient.getQueryState(QueryKeys.beregnBarnebidrag())?.status === "error";

    useEffect(() => {
        queryClient.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
        queryClient.resetQueries({ queryKey: QueryKeys.beregnBarnebidrag() });
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

const GrunnlagFraVedtakButton = () => {
    const { grunnlagFraVedtaksid, saksnummer } = useGetBehandlingV2();
    const enhet = useQueryParams().get("enhet");
    const sessionState = useQueryParams().get("sessionState");

    if (!grunnlagFraVedtaksid) return null;
    return (
        <Link
            className="ml-auto"
            href={`/sak/${saksnummer}/vedtak/${grunnlagFraVedtaksid}/?steg=vedtak&enhet=${enhet}&sessionState=${sessionState}`}
            target="_blank"
            rel="noreferrer"
        >
            Grunnlag fra vedtak <ExternalLinkIcon aria-hidden />
        </Link>
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
    const { data: beregning } = useGetBeregningBidrag();
    const {
        virkningstidspunkt: { avslag },
        vedtakstype,
    } = useGetBehandlingV2();

    const erAvslag = avslag !== null && avslag !== undefined;
    return (
        <VedtakWrapper feil={beregning.feil} steps={STEPS}>
            {beregning.resultat?.resultatBarn?.map((r, i) => {
                const avvistAldersjustering = r.perioder.every(
                    (p) => p.aldersjusteringDetaljer != null && p.aldersjusteringDetaljer?.aldersjustert === false
                );

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
                        <Table size="small">
                            <VedtakTableHeader
                                avslag={erAvslag}
                                avvistAldersjustering={avvistAldersjustering}
                                resultatUtenBeregning={r.resultatUtenBeregning}
                            />
                            <VedtakTableBody
                                resultatBarn={r}
                                avslag={erAvslag}
                                opphør={vedtakstype === Vedtakstype.OPPHOR}
                            />
                        </Table>
                    </div>
                );
            })}
        </VedtakWrapper>
    );
};

const VedtakTableBody = ({
    resultatBarn,
    avslag,
    opphør,
}: {
    resultatBarn: ResultatBidragsberegningBarnDto;
    avslag: boolean;
    opphør: boolean;
}) => {
    const { erBisysVedtak, vedtakstype } = useGetBehandlingV2();

    function renderTable(periode: ResultatBarnebidragsberegningPeriodeDto) {
        const skjulBeregning =
            periode.erBeregnetAvslag || (!erBisysVedtak && vedtakstype === Vedtakstype.ALDERSJUSTERING);

        if (periode.aldersjusteringDetaljer?.aldersjustert === false) {
            return (
                <Table.Row>
                    <Table.DataCell textSize="small">
                        {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                        {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
                    </Table.DataCell>
                    <Table.DataCell textSize="small">{"Avvist (Automatisk aldersjustering)"}</Table.DataCell>
                    <Table.DataCell textSize="small">
                        {periode.aldersjusteringDetaljer?.aldersjusteresManuelt ? "Ja" : "Nei"}
                    </Table.DataCell>
                    <Table.DataCell textSize="small" width="500px">
                        {periode.resultatkodeVisningsnavn}
                    </Table.DataCell>
                </Table.Row>
            );
        }

        if (resultatBarn.resultatUtenBeregning) {
            return (
                <Table.Row>
                    <Table.DataCell textSize="small">
                        {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                        {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
                    </Table.DataCell>
                    <Table.DataCell textSize="small">
                        {formatterBeløpForBeregning(periode.beregnetBidrag)}
                    </Table.DataCell>
                    <Table.DataCell textSize="small" width="500px">
                        {periode.resultatkodeVisningsnavn}
                    </Table.DataCell>
                </Table.Row>
            );
        }

        if (avslag) {
            return (
                <Table.Row>
                    <Table.DataCell textSize="small">
                        {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                        {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
                    </Table.DataCell>
                    <Table.DataCell textSize="small">{opphør ? text.label.opphør : text.label.avslag}</Table.DataCell>
                    <Table.DataCell textSize="small">{periode.resultatkodeVisningsnavn}</Table.DataCell>
                </Table.Row>
            );
        }
        return (
            <Table.ExpandableRow
                togglePlacement="right"
                expandOnRowClick
                expansionDisabled={skjulBeregning}
                content={!skjulBeregning && <DetaljertBeregningBidrag periode={periode} />}
            >
                {periode.erBeregnetAvslag && !periode.erEndringUnderGrense ? (
                    <TableRowResultatAvslag periode={periode} />
                ) : (
                    <TableRowResultat periode={periode} />
                )}
            </Table.ExpandableRow>
        );
    }
    return (
        <Table.Body>
            {resultatBarn.perioder.map((periode) => {
                return renderTable(periode);
            })}
        </Table.Body>
    );
};
const TableRowResultatAvslag = ({ periode }: { periode: ResultatBarnebidragsberegningPeriodeDto }) => {
    return (
        <>
            <Table.DataCell textSize="small">
                {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
            </Table.DataCell>

            <Table.DataCell textSize="small" colSpan={5}></Table.DataCell>

            <Table.DataCell textSize="small">Opphør</Table.DataCell>

            <Table.DataCell textSize="small">{periode.resultatkodeVisningsnavn}</Table.DataCell>
        </>
    );
};
const TableRowResultat = ({ periode }: { periode: ResultatBarnebidragsberegningPeriodeDto }) => {
    const { erBisysVedtak, vedtakstype } = useGetBehandlingV2();
    const visEvne = erBisysVedtak || vedtakstype !== Vedtakstype.ALDERSJUSTERING;
    return (
        <>
            <Table.DataCell textSize="small">
                {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
            </Table.DataCell>

            <Table.DataCell textSize="small">{formatterBeløpForBeregning(periode.underholdskostnad)}</Table.DataCell>
            <Table.DataCell textSize="small">
                <table>
                    <tbody>
                        <tr>
                            <td className="w-[45px]" align="right">
                                {formatterProsent(periode.bpsAndelU)}
                            </td>
                            <td className="w-[10px]">/</td>
                            <td>{formatterBeløpForBeregning(periode.bpsAndelBeløp)}</td>
                        </tr>
                    </tbody>
                </table>
            </Table.DataCell>
            <Table.DataCell textSize="small">
                <table>
                    <tbody>
                        {periode.beregningsdetaljer.samværsfradrag != null ? (
                            <tr>
                                <td className="w-[45px]" align="right">
                                    {formatterBeløpForBeregning(periode.samværsfradrag)}
                                </td>
                                <td className="w-[10px]">/</td>
                                <td>
                                    {periode.beregningsdetaljer.samværsfradrag.samværsklasse ===
                                    Samvaersklasse.DELT_BOSTED
                                        ? "D"
                                        : hentVisningsnavn(periode.beregningsdetaljer.samværsfradrag.samværsklasse)}
                                </td>
                            </tr>
                        ) : (
                            <tr></tr>
                        )}
                    </tbody>
                </table>
            </Table.DataCell>
            {visEvne && (
                <Table.DataCell textSize="small">
                    <table>
                        <tbody>
                            <tr>
                                <td className="w-[45px]" align="right">
                                    {formatterBeløpForBeregning(
                                        periode.beregningsdetaljer.delberegningBidragsevne?.bidragsevne
                                    )}
                                </td>
                                <td className="w-[10px]">/</td>
                                <td>
                                    {formatterBeløpForBeregning(
                                        periode.beregningsdetaljer.delberegningBidragsevne?.sumInntekt25Prosent
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Table.DataCell>
            )}

            <Table.DataCell textSize="small">{formatterBeløpForBeregning(periode.beregnetBidrag)}</Table.DataCell>

            <Table.DataCell textSize="small">{formatterBeløpForBeregning(periode.faktiskBidrag)}</Table.DataCell>

            <Table.DataCell textSize="small">{periode.resultatkodeVisningsnavn}</Table.DataCell>
        </>
    );
};

const VedtakResultatBarn = ({ barn }: { barn: ResultatRolle }) => (
    <div className="my-4 flex items-center gap-x-2">
        <RolleTag rolleType={Rolletype.BA} />
        <BodyShort>
            <PersonNavnIdent ident={barn.ident} navn={barn.navn} variant="compact" />
        </BodyShort>
    </div>
);
const VedtakTableHeader = ({
    avslag = false,
    avvistAldersjustering = false,
    resultatUtenBeregning = false,
}: {
    avslag: boolean;
    avvistAldersjustering: boolean;
    resultatUtenBeregning: boolean;
}) => {
    const { erBisysVedtak, vedtakstype } = useGetBehandlingV2();
    const visEvne = erBisysVedtak || vedtakstype !== Vedtakstype.ALDERSJUSTERING;
    return (
        <Table.Header>
            {avvistAldersjustering ? (
                <Table.Row>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.periode}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.resultat}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {"Aldersjusteres manuelt"}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.årsak}
                    </Table.HeaderCell>
                </Table.Row>
            ) : resultatUtenBeregning ? (
                <Table.Row>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.periode}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        Beløp
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.resultat}
                    </Table.HeaderCell>
                </Table.Row>
            ) : avslag ? (
                <Table.Row>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.periode}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.resultat}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col">
                        {text.label.årsak}
                    </Table.HeaderCell>
                </Table.Row>
            ) : (
                <Table.Row>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "350px" }}>
                        {text.label.periode}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "80px" }}>
                        U
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "150px" }}>
                        BPs andel U
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "80px" }}>
                        Samvær
                    </Table.HeaderCell>
                    {visEvne && (
                        <Table.HeaderCell textSize="small" scope="col" style={{ width: "110px" }}>
                            Evne / 25%
                        </Table.HeaderCell>
                    )}
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "210px" }}>
                        Beregnet bidrag
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "210px" }}>
                        Endelig bidrag
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "390px" }}>
                        Resultat
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" style={{ width: "24px" }}></Table.HeaderCell>
                </Table.Row>
            )}
        </Table.Header>
    );
};
export default () => {
    return (
        <QueryErrorWrapper>
            <Vedtak />
        </QueryErrorWrapper>
    );
};
