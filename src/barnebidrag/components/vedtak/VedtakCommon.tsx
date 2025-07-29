import text from "@common/constants/texts";
import { QueryKeys, useGetBehandlingV2 } from "@common/hooks/useApiData";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { dateToDDMMYYYYString, deductDays, PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { BodyShort, Button, Heading, Link, Modal, Table } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import {
    ResultatBarnebidragsberegningPeriodeDto,
    ResultatBidragsberegningBarnDto,
    ResultatRolle,
    Rolletype,
    Samvaersklasse,
    Vedtakstype,
} from "../../../api/BidragBehandlingApiV1";
import { RolleTag } from "../../../common/components/RolleTag";
import { useQueryParams } from "../../../common/hooks/useQueryParams";
import { hentVisningsnavn } from "../../../common/hooks/useVisningsnavn";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { VedtaksListeBeregning } from "../Vedtakliste";
import { DetaljertBeregningBidrag } from "./DetaljertBeregningBidrag";

export const GrunnlagFraVedtakButton = () => {
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
export const TableRowResultatAvslag = ({ periode }: { periode: ResultatBarnebidragsberegningPeriodeDto }) => {
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
export const TableRowResultat = ({ periode }: { periode: ResultatBarnebidragsberegningPeriodeDto }) => {
    const { erBisysVedtak, vedtakstype } = useGetBehandlingV2();
    const visEvne = erBisysVedtak || vedtakstype !== Vedtakstype.ALDERSJUSTERING;
    const erDirekteAvslag = periode.erDirekteAvslag;
    const samværsklasse =
        periode.beregningsdetaljer?.samværsfradrag?.samværsklasse === Samvaersklasse.DELT_BOSTED
            ? "D"
            : hentVisningsnavn(periode.beregningsdetaljer.samværsfradrag?.samværsklasse);
    return (
        <>
            <Table.DataCell textSize="small">
                {dateToDDMMYYYYString(new Date(periode.periode.fom))} -{" "}
                {periode.periode.til ? dateToDDMMYYYYString(deductDays(new Date(periode.periode.til), 1)) : ""}
            </Table.DataCell>

            <Table.DataCell textSize="small">
                {erDirekteAvslag ? "-" : formatterBeløpForBeregning(periode.underholdskostnad)}
            </Table.DataCell>
            <Table.DataCell textSize="small">
                {erDirekteAvslag ? (
                    "-"
                ) : (
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
                )}
            </Table.DataCell>
            <Table.DataCell textSize="small">
                {erDirekteAvslag ? (
                    "-"
                ) : (
                    <table>
                        <tbody>
                            {periode.beregningsdetaljer.samværsfradrag != null ? (
                                <tr>
                                    <td className="w-[45px]" align="right">
                                        {formatterBeløpForBeregning(periode.samværsfradrag)}
                                    </td>
                                    <td className="w-[10px]">/</td>
                                    <td>{samværsklasse}</td>
                                </tr>
                            ) : (
                                <tr></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </Table.DataCell>
            {visEvne && (
                <Table.DataCell textSize="small">
                    {erDirekteAvslag ? (
                        "-"
                    ) : (
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
                    )}
                </Table.DataCell>
            )}

            <Table.DataCell textSize="small">
                {erDirekteAvslag ? "-" : formatterBeløpForBeregning(periode.beregnetBidrag)}
            </Table.DataCell>

            <Table.DataCell textSize="small">
                {erDirekteAvslag ? "Avslag" : formatterBeløpForBeregning(periode.faktiskBidrag)}
            </Table.DataCell>

            <Table.DataCell textSize="small">{periode.resultatkodeVisningsnavn}</Table.DataCell>
        </>
    );
};

export const VedtakResultatBarn = ({ barn }: { barn: ResultatRolle }) => (
    <div className="my-4 flex items-center gap-x-2">
        <RolleTag rolleType={Rolletype.BA} />
        <BodyShort>
            <PersonNavnIdent ident={barn.ident} navn={barn.navn} variant="compact" />
        </BodyShort>
    </div>
);
export const VedtakTableHeader = ({
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

export const VelgManuellVedtakModal = ({
    barnIdent,
    aldersjusteringForÅr,
}: {
    barnIdent: string;
    aldersjusteringForÅr: number;
}) => {
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Button variant="tertiary" size="xsmall" onClick={() => setShowModal(true)}>
                Velg vedtak
            </Button>
            <Modal
                aria-label="Velg manuell vedtak"
                open={showModal}
                onClose={() => setShowModal(false)}
                closeOnBackdropClick
            >
                <Modal.Header closeButton>
                    <Heading size="medium">Velg vedtak for aldersjustering</Heading>
                </Modal.Header>
                <Modal.Body>
                    <VedtaksListeBeregning
                        barnIdent={barnIdent}
                        aldersjusteringForÅr={aldersjusteringForÅr}
                        onSelectVedtak={() =>
                            queryClient.refetchQueries({ queryKey: QueryKeys.beregnBarnebidrag(true) })
                        }
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};
export const VedtakTableBody = ({
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
            periode.erBeregnetAvslag ||
            periode.erDirekteAvslag ||
            (!erBisysVedtak && vedtakstype === Vedtakstype.ALDERSJUSTERING);

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
