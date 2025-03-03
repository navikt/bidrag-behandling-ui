import text from "@common/constants/texts";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { BodyShort, Table } from "@navikt/ds-react";
import { dateOrNull, DateToDDMMYYYYString } from "@utils/date-utils";
import { formatterBeløpForBeregning } from "@utils/number-utils";
import React from "react";

export const BeregnetTabel = ({ privatAvtaleId }: { privatAvtaleId: number }) => {
    const { privatAvtale } = useGetBehandlingV2();
    const beregnetPrivatAvtale = privatAvtale.find((avtale) => avtale.id === privatAvtaleId)?.beregnetPrivatAvtale;
    return (
        <Table size="small" className="table-fixed table bg-white w-full">
            <Table.Header>
                <Table.Row className="align-baseline">
                    <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                        {text.label.fraOgMed}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                        {text.label.tilOgMed}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                        {text.label.indeksprosent}
                    </Table.HeaderCell>
                    <Table.HeaderCell textSize="small" scope="col" align="right">
                        {text.label.beløp}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {beregnetPrivatAvtale.perioder.map((periode, index) => (
                    <Table.Row key={`${index}-periode`} className="align-top">
                        <Table.DataCell>
                            <BodyShort size="small">{DateToDDMMYYYYString(dateOrNull(periode.periode.fom))}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort size="small">{DateToDDMMYYYYString(dateOrNull(periode.periode.til))}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort size="small">{formatterBeløpForBeregning(periode.indeksprosent)}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell align="right">
                            <BodyShort size="small">{formatterBeløpForBeregning(periode.beløp)}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
