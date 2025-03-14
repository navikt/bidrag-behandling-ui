import { BostatusperiodeGrunnlagDto } from "@api/BidragBehandlingApiV1";
import { Rolletype } from "@api/BidragDokumentProduksjonApi";
import PersonNavnIdent from "@common/components/PersonNavnIdent";
import { RolleTag } from "@common/components/RolleTag";
import elementIds from "@common/constants/elementIds";
import text from "@common/constants/texts";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { hentVisningsnavn } from "@common/hooks/useVisningsnavn";
import { BodyShort, Box, ExpansionCard, Table } from "@navikt/ds-react";
import { dateOrNull, DateToDDMMYYYYString } from "@utils/date-utils";
import React, { Fragment } from "react";

export const BoforholdBM = () => {
    const {
        aktiveGrunnlagsdata: { husstandsmedlemBM },
    } = useGetBehandlingV2();

    return (
        <ExpansionCard size="small" aria-label="Small-variant">
            <ExpansionCard.Header>
                <ExpansionCard.Title size="small">{text.title.opplysningerFraFolkeregistret}</ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {husstandsmedlemBM.map((husstandsmedlem) => (
                    <Fragment key={husstandsmedlem.ident}>
                        <Box
                            background="surface-subtle"
                            className="overflow-hidden grid gap-2 py-2 px-4"
                            id={`${elementIds.seksjon_boforhold}_${husstandsmedlem.ident}`}
                        >
                            <div className="grid grid-cols-[max-content,max-content,auto] p-2 bg-white border border-[var(--a-border-default)]">
                                <div>
                                    <RolleTag rolleType={Rolletype.BA} />
                                </div>
                                <div className="flex items-center gap-4">
                                    <PersonNavnIdent ident={husstandsmedlem.ident} />
                                </div>
                            </div>
                            <Perioder perioder={husstandsmedlem.perioder} />
                        </Box>
                    </Fragment>
                ))}
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

const Perioder = ({ perioder }: { perioder: BostatusperiodeGrunnlagDto[] }) => {
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
                    <Table.HeaderCell textSize="small" scope="col" align="left">
                        {text.label.status}
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map((periode, index) => (
                    <Table.Row key={`periode-${index}`} className="align-top">
                        <Table.DataCell>
                            <BodyShort size="small">{DateToDDMMYYYYString(dateOrNull(periode.datoFom))}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort size="small">{DateToDDMMYYYYString(dateOrNull(periode.datoTom))}</BodyShort>
                        </Table.DataCell>
                        <Table.DataCell>
                            <BodyShort size="small">{hentVisningsnavn(periode.bostatus)}</BodyShort>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};
