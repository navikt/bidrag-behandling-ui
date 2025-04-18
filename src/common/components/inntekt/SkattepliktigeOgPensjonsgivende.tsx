import { Inntektstype, Kilde } from "@api/BidragBehandlingApiV1";
import { FormControlledSelectField } from "@common/components/formFields/FormControlledSelectField";
import LeggTilPeriodeButton from "@common/components/formFields/FormLeggTilPeriode";
import AinntektLink from "@common/components/inntekt/AinntektLink";
import text from "@common/constants/texts";
import { hentVisningsnavn } from "@common/hooks/useVisningsnavn";
import { InntektFormPeriode, InntektFormValues } from "@common/types/inntektFormValues";
import { HourglassBottomFilledIcon, SackKronerFillIcon } from "@navikt/aksel-icons";
import { ObjectUtils } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, Checkbox, Heading, HStack, Table } from "@navikt/ds-react";
import React, { BaseSyntheticEvent, useState } from "react";
import { useFormContext } from "react-hook-form";

import elementId from "../../constants/elementIds";
import { manuelleInntekterValg } from "../../helpers/inntektFormHelpers";
import { ExpandableContent } from "./ExpandableContent";
import { EditOrSaveButton, InntektTabel, KildeIcon, Periode, TaMed, Totalt } from "./InntektTable";
import { useInntektTableProvider } from "./InntektTableContext";
import ModiaLink from "./ModiaLink";
import { Opplysninger } from "./Opplysninger";

const Beskrivelse = ({ item, field, alert }: { item: InntektFormPeriode; field: string; alert?: string }) => {
    const { type } = useInntektTableProvider();
    return item.erRedigerbart && item.kilde === Kilde.MANUELL ? (
        <FormControlledSelectField
            name={`${field}.rapporteringstype`}
            label={text.label.beskrivelse}
            options={[{ value: "", text: text.select.inntektPlaceholder }].concat(
                manuelleInntekterValg[type].map((value) => ({
                    value,
                    text: hentVisningsnavn(value),
                }))
            )}
            hideLabel
        />
    ) : (
        <BodyShort className="leading-6 flex flex-row gap-0 align-center" size="small">
            {hentVisningsnavn(
                item.rapporteringstype,
                item.opprinneligFom ?? item.datoFom,
                item.opprinneligTom ?? item.datoTom
            )}
            {alert && (
                <span className="self-center ml-[5px] text-[var(--a-icon-info)]">
                    <SackKronerFillIcon title={alert} />
                </span>
            )}
            {item.historisk && (
                <span className="self-center ml-[5px]">
                    <HourglassBottomFilledIcon title="historisk" />
                </span>
            )}
        </BodyShort>
    );
};

export const SkattepliktigeOgPensjonsgivende = () => {
    const { ident, viewOnly } = useInntektTableProvider();
    const [visHistoriskInntekt, setVisHistoriskInntekt] = useState<boolean>(
        !!JSON.parse(localStorage.getItem(`visHistoriskInntekt-${ident}`))
    );
    const { clearErrors, getValues, setError } = useFormContext<InntektFormValues>();

    const fieldName = `årsinntekter.${ident}` as const;

    const customRowValidation = (fieldName: `årsinntekter.${string}.${number}`) => {
        const periode = getValues(fieldName);
        if (ObjectUtils.isEmpty(periode.rapporteringstype)) {
            setError(`${fieldName}.rapporteringstype`, {
                type: "notValid",
                message: text.error.inntektType,
            });
        } else {
            clearErrors(`${fieldName}.rapporteringstype`);
        }
    };

    return (
        <Box background="surface-subtle" className="grid gap-y-2 px-4 py-2 w-full">
            <div className="flex gap-x-4">
                <HStack gap={"2"}>
                    <Heading level="2" size="small" id={elementId.seksjon_inntekt_skattepliktig}>
                        {text.title.skattepliktigeogPensjonsgivendeInntekt}
                    </Heading>

                    <AinntektLink ident={ident} />
                    <ModiaLink ident={ident} />
                </HStack>
            </div>
            <Opplysninger fieldName={fieldName} />
            <Checkbox
                checked={visHistoriskInntekt}
                onChange={(value: BaseSyntheticEvent) => {
                    localStorage.setItem(`visHistoriskInntekt-${ident}`, value.target.checked);
                    setVisHistoriskInntekt(value.target.checked);
                }}
                size="small"
            >
                {text.label.historiskInntekt}
            </Checkbox>
            <InntektTabel fieldName={fieldName} customRowValidation={customRowValidation}>
                {({
                    controlledFields,
                    onSaveRow,
                    handleOnSelect,
                    onEditRow,
                    addPeriod,
                }: {
                    controlledFields: InntektFormPeriode[];
                    onSaveRow: (index: number) => void;
                    handleOnSelect: (value: boolean, index: number) => void;
                    onEditRow: (index: number) => void;
                    addPeriod: (periode: InntektFormPeriode) => void;
                }) => (
                    <>
                        {controlledFields.length > 0 && (
                            <div className="overflow-x-auto whitespace-nowrap">
                                <Table size="small" className="table-fixed table bg-white w-fit">
                                    <Table.Header>
                                        <Table.Row className="align-baseline">
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="left"
                                                className="w-[74px]"
                                            >
                                                {viewOnly ? "" : text.label.taMed}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="left"
                                                className="w-[134px]"
                                            >
                                                {text.label.fraOgMed}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="left"
                                                className="w-[134px]"
                                            >
                                                {text.label.tilOgMed}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="left"
                                                className="w-[320px]"
                                            >
                                                {text.label.beskrivelse}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="center"
                                                className="w-[54px]"
                                            >
                                                {text.label.kilde}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell
                                                textSize="small"
                                                scope="col"
                                                align="right"
                                                className="w-[100px]"
                                            >
                                                {text.label.beløp}
                                            </Table.HeaderCell>
                                            <Table.HeaderCell scope="col" className="w-[56px]"></Table.HeaderCell>
                                            <Table.HeaderCell scope="col" className="w-[56px]"></Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {controlledFields.map((item, index) => {
                                            if (!visHistoriskInntekt && item.historisk && !item.taMed) {
                                                return null;
                                            }
                                            return (
                                                <Table.ExpandableRow
                                                    key={item?.id + item.ident}
                                                    content={
                                                        <ExpandableContent
                                                            item={item}
                                                            showInnteksposter
                                                            showLøpendeTilOgMed
                                                        />
                                                    }
                                                    togglePlacement="right"
                                                    className="align-top"
                                                    expansionDisabled={item.kilde === Kilde.MANUELL}
                                                >
                                                    <Table.DataCell>
                                                        <TaMed
                                                            fieldName={fieldName}
                                                            index={index}
                                                            handleOnSelect={handleOnSelect}
                                                        />
                                                    </Table.DataCell>
                                                    <Table.DataCell textSize="small">
                                                        <Periode
                                                            index={index}
                                                            label={text.label.fraOgMed}
                                                            fieldName={fieldName}
                                                            field="datoFom"
                                                            item={item}
                                                        />
                                                    </Table.DataCell>
                                                    <Table.DataCell textSize="small">
                                                        <Periode
                                                            index={index}
                                                            label={text.label.tilOgMed}
                                                            fieldName={fieldName}
                                                            field="datoTom"
                                                            item={item}
                                                        />
                                                    </Table.DataCell>
                                                    <Table.DataCell textSize="small">
                                                        <Beskrivelse
                                                            item={item}
                                                            field={`${fieldName}.${index}`}
                                                            alert={
                                                                item.inntektsposter?.some(
                                                                    (d) =>
                                                                        d.inntektstype ===
                                                                            Inntektstype.NAeRINGSINNTEKT ||
                                                                        d.kode.toUpperCase().includes("NAERING")
                                                                )
                                                                    ? "Inntekt inneholder næringsinntekt"
                                                                    : undefined
                                                            }
                                                        />
                                                    </Table.DataCell>
                                                    <Table.DataCell>
                                                        <KildeIcon kilde={item.kilde} />
                                                    </Table.DataCell>
                                                    <Table.DataCell align="right" textSize="small">
                                                        <Totalt item={item} field={`${fieldName}.${index}`} />
                                                    </Table.DataCell>
                                                    <Table.DataCell textSize="small">
                                                        <EditOrSaveButton
                                                            index={index}
                                                            item={item}
                                                            onEditRow={onEditRow}
                                                            onSaveRow={onSaveRow}
                                                        />
                                                    </Table.DataCell>
                                                </Table.ExpandableRow>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                        {!viewOnly && (
                            <LeggTilPeriodeButton
                                addPeriode={() =>
                                    addPeriod({
                                        ident,
                                        datoFom: null,
                                        datoTom: null,
                                        beløp: 0,
                                        rapporteringstype: "",
                                        taMed: true,
                                        kilde: Kilde.MANUELL,
                                        inntektsposter: [],
                                        inntektstyper: [],
                                    })
                                }
                            />
                        )}
                    </>
                )}
            </InntektTabel>
        </Box>
    );
};
