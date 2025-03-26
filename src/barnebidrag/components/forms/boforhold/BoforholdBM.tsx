import { BostatusperiodeGrunnlagDto, OpplysningerType } from "@api/BidragBehandlingApiV1";
import { Rolletype } from "@api/BidragDokumentProduksjonApi";
import PersonNavnIdent from "@common/components/PersonNavnIdent";
import { RolleTag } from "@common/components/RolleTag";
import elementIds from "@common/constants/elementIds";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useOnActivateGrunnlag } from "@common/hooks/useOnActivateGrunnlag";
import { useVirkningsdato } from "@common/hooks/useVirkningsdato";
import { hentVisningsnavn } from "@common/hooks/useVisningsnavn";
import { BodyShort, Box, Button, ExpansionCard, Heading, HStack, Table, Tag } from "@navikt/ds-react";
import { dateOrNull, DateToDDMMYYYYString, isBeforeDate } from "@utils/date-utils";
import React, { Fragment } from "react";

export const BoforholdBM = () => {
    const {
        aktiveGrunnlagsdata: { husstandsmedlemBM },
        ikkeAktiverteEndringerIGrunnlagsdata: { husstandsmedlemBM: ikkeAktiverteEndringerHusstandsmedlemBM },
    } = useGetBehandlingV2();
    const harNyeOpplysninger = ikkeAktiverteEndringerHusstandsmedlemBM.some(
        (husstandsmedlem) => !!husstandsmedlem.perioder.length
    );

    return (
        <ExpansionCard size="small" aria-label="Small-variant" defaultOpen={harNyeOpplysninger}>
            <ExpansionCard.Header>
                <ExpansionCard.Title size="small">
                    {text.title.opplysningerFraFolkeregistret}{" "}
                    {harNyeOpplysninger && (
                        <Tag size="xsmall" variant="success" className="ml-2">
                            {text.label.nytt}
                        </Tag>
                    )}
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                {harNyeOpplysninger && <NyOpplysningerFraFolkeregistreTabell />}
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
    const virkningsOrSoktFraDato = useVirkningsdato();
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
                            <BodyShort size="small">
                                {virkningsOrSoktFraDato && isBeforeDate(periode.datoFom, virkningsOrSoktFraDato)
                                    ? DateToDDMMYYYYString(virkningsOrSoktFraDato)
                                    : DateToDDMMYYYYString(new Date(periode.datoFom))}
                            </BodyShort>
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

const NyOpplysningerFraFolkeregistreTabell = () => {
    const {
        ikkeAktiverteEndringerIGrunnlagsdata: { husstandsmedlemBM },
        roller,
    } = useGetBehandlingV2();
    const bmRolle = roller.find((rolle) => rolle.rolletype === Rolletype.BM);
    const { setSaveErrorState } = useBehandlingProvider();
    const activateGrunnlag = useOnActivateGrunnlag();

    const onActivate = () => {
        activateGrunnlag.mutation.mutate(
            {
                overskriveManuelleOpplysninger: false,
                personident: bmRolle.ident,
                grunnlagstype: OpplysningerType.BOFORHOLDBMSOKNADSBARN,
            },
            {
                onSuccess: (response) => {
                    activateGrunnlag.queryClientUpdater((currentData) => {
                        return {
                            ...currentData,
                            aktiveGrunnlagsdata: response.aktiveGrunnlagsdata,
                            ikkeAktiverteEndringerIGrunnlagsdata: response.ikkeAktiverteEndringerIGrunnlagsdata,
                        };
                    });
                },
                onError: () => {
                    setSaveErrorState({
                        error: true,
                        retryFn: onActivate,
                    });
                },
            }
        );
    };

    return (
        <Box
            padding="4"
            background="surface-default"
            borderWidth="1"
            borderRadius="medium"
            borderColor="border-default"
            className="w-[708px]"
        >
            <Heading size="xsmall">{text.alert.nyOpplysningerBoforhold}</Heading>
            <div className="grid gap-4">
                {husstandsmedlemBM.map((husstandsmedlem) => (
                    <Box key={husstandsmedlem.ident} background="surface-subtle">
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
                ))}
            </div>
            <HStack gap="6" className="mt-4">
                <Button type="button" variant="secondary" size="xsmall" onClick={onActivate}>
                    {text.label.oppdaterOpplysninger}
                </Button>
            </HStack>
        </Box>
    );
};
