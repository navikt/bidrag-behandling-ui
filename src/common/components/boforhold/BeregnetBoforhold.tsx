import text from "@common/constants/texts";
import { deductDays } from "@navikt/bidrag-ui-common";
import { Box, Heading, Table } from "@navikt/ds-react";

import { dateOrNull, DateToDDMMYYYYString } from "../../../utils/date-utils";
import { useGetBehandlingV2 } from "../../hooks/useApiData";

export default function BeregnetBoforhold() {
    const {
        boforhold: { beregnetBoforhold },
    } = useGetBehandlingV2();
    if (beregnetBoforhold.length === 0) return null;
    return (
        <>
            <Heading level="2" size="small">
                Beregnet boforhold
            </Heading>
            <Box background="surface-subtle" className="overflow-hidden grid gap-2 py-2 px-4">
                <Table size="small" className="table-fixed table bg-white w-full">
                    <Table.Header>
                        <Table.Row className="align-baseline">
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                                {text.label.fraOgMed}
                            </Table.HeaderCell>
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                                {text.label.tilOgMed}
                            </Table.HeaderCell>
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[385px]">
                                Antall barn i husstanden
                            </Table.HeaderCell>
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[250px]">
                                Voksne i husstanden
                            </Table.HeaderCell>
                        </Table.Row>
                        {/* <Table.Row className="align-baseline">
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[200px]">
                                {text.label.fraOgMed} - {text.label.tilOgMed}
                            </Table.HeaderCell>
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[150px]">
                                Antall barn i husstanden
                            </Table.HeaderCell>
                            <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[150px]">
                                Voksne i husstanden
                            </Table.HeaderCell>
                        </Table.Row>{" "} */}
                    </Table.Header>
                    <Table.Body>
                        {beregnetBoforhold.map((beregning, index) => (
                            <Table.Row key={beregning?.periode.fom + "-" + index} className="align-top">
                                <Table.DataCell textSize="small">
                                    {DateToDDMMYYYYString(dateOrNull(beregning.periode.fom))}
                                </Table.DataCell>
                                <Table.DataCell textSize="small">
                                    {beregning.periode.til
                                        ? DateToDDMMYYYYString(deductDays(dateOrNull(beregning.periode.til), 1))
                                        : null}
                                </Table.DataCell>
                                <Table.DataCell textSize="small">{beregning.antallBarn}</Table.DataCell>
                                <Table.DataCell textSize="small">
                                    {beregning.borMedAndreVoksne ? "Ja" : "Nei"}
                                </Table.DataCell>
                            </Table.Row>
                            // <Table.Row key={beregning?.periode.fom + "-" + index} className="align-top">
                            //     <Table.DataCell textSize="small">
                            //         {DateToDDMMYYYYString(dateOrNull(beregning.periode.fom))} -{" "}
                            //         {beregning.periode.til
                            //             ? DateToDDMMYYYYString(deductDays(dateOrNull(beregning.periode.til), 1))
                            //             : null}
                            //     </Table.DataCell>

                            //     <Table.DataCell textSize="small">{beregning.antallBarn}</Table.DataCell>
                            //     <Table.DataCell textSize="small">
                            //         {beregning.borMedAndreVoksne ? "Ja" : "Nei"}
                            //     </Table.DataCell>
                            // </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Box>
        </>
    );
}
