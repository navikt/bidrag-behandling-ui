import {
    OppdaterePrivatAvtaleRequest,
    PrivatAvtaleDto,
    PrivatAvtaleValideringsfeilDto,
} from "@api/BidragBehandlingApiV1";
import { BehandlingAlert } from "@common/components/BehandlingAlert";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import { FormControlledTextField } from "@common/components/formFields/FormControlledTextField";
import { OverlayLoader } from "@common/components/OverlayLoader";
import elementIds from "@common/constants/elementIds";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { actionOnEnter } from "@common/helpers/keyboardHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { FloppydiskIcon, PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { ObjectUtils } from "@navikt/bidrag-ui-common";
import { BodyShort, Button, Heading, Table } from "@navikt/ds-react";
import { addMonths, addMonthsIgnoreDay, dateOrNull, DateToDDMMYYYYString, isAfterDate } from "@utils/date-utils";
import { formatterBeløp } from "@utils/number-utils";
import { removePlaceholder } from "@utils/string-utils";
import React, { useMemo, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useOnUpdatePrivatAvtale } from "../../../hooks/useOnUpdatePrivatAvtale";
import {
    PrivatAvtaleFormValues,
    PrivatAvtaleFormValuesPerBarn,
    PrivatAvtalePeriode,
} from "../../../types/privatAvtaleFormValues";
import { transformPrivatAvtalePeriode } from "../helpers/PrivatAvtaleHelpers";
import { getFomForPrivatAvtale } from "./PrivatAvtale";

const Periode = ({
    item,
    field,
    fieldName,
    label,
    editableRow,
    privatAvtale,
}: {
    item: PrivatAvtalePeriode;
    fieldName: `roller.${number}.privatAvtale.perioder.${number}`;
    field: "fom" | "tom";
    label: string;
    editableRow: boolean;
    privatAvtale: PrivatAvtaleDto;
}) => {
    const { stønadstype } = useGetBehandlingV2();
    const { lesemodus } = useBehandlingProvider();
    const { getValues, clearErrors, setError } = useFormContext<PrivatAvtaleFormValues>();
    const fom = useMemo(() => {
        return getFomForPrivatAvtale(stønadstype, privatAvtale.gjelderBarn.fødselsdato);
    }, [stønadstype, privatAvtale.gjelderBarn.fødselsdato]);
    const tom = useMemo(() => addMonths(new Date(), 50 * 12), []);
    const fieldIsDatoTom = field === "tom";

    const validateFomOgTom = () => {
        const periode = getValues(fieldName);
        const fomOgTomInvalid = !ObjectUtils.isEmpty(periode.tom) && isAfterDate(periode?.fom, periode.tom);

        if (fomOgTomInvalid) {
            setError(`${fieldName}.fom`, {
                type: "notValid",
                message: text.error.tomDatoKanIkkeVæreFørFomDato,
            });
        } else {
            clearErrors(`${fieldName}.fom`);
        }
    };

    return !lesemodus && editableRow ? (
        <FormControlledMonthPicker
            name={`${fieldName}.${field}`}
            label={label}
            placeholder="DD.MM.ÅÅÅÅ"
            defaultValue={item[field]}
            customValidation={validateFomOgTom}
            fromDate={fom}
            toDate={fieldIsDatoTom ? tom : addMonthsIgnoreDay(tom, 1)}
            lastDayOfMonthPicker={fieldIsDatoTom}
            required={!fieldIsDatoTom}
            hideLabel
        />
    ) : (
        <div className="h-6 flex items-center">{item[field] && DateToDDMMYYYYString(dateOrNull(item[field]))}</div>
    );
};

const Beløp = ({ item, editableRow, field }: { item: PrivatAvtalePeriode; editableRow: boolean; field: string }) => {
    const { lesemodus } = useBehandlingProvider();
    return (
        <>
            {!lesemodus && editableRow ? (
                <FormControlledTextField
                    name={field}
                    label="Totalt"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    step="1"
                    hideLabel
                />
            ) : (
                <div className="h-6 flex items-center justify-end">{formatterBeløp(item.beløp)}</div>
            )}
        </>
    );
};

const EditOrSaveButton = ({
    index,
    editableRow,
    onSaveRow,
    onEditRow,
}: {
    index: number;
    editableRow: boolean;
    onSaveRow: (index: number) => void;
    onEditRow: (index: number) => void;
}) => {
    const { lesemodus } = useBehandlingProvider();

    if (lesemodus) return null;

    return editableRow ? (
        <Button
            type="button"
            onClick={() => onSaveRow(index)}
            icon={<FloppydiskIcon aria-hidden />}
            variant="tertiary"
            size="xsmall"
        />
    ) : (
        <Button
            type="button"
            onClick={() => onEditRow(index)}
            icon={<PencilIcon aria-hidden />}
            variant="tertiary"
            size="xsmall"
        />
    );
};

const DeleteButton = ({ onRemovePeriode, index }: { onRemovePeriode: (index) => void; index: number }) => {
    const { lesemodus } = useBehandlingProvider();

    return !lesemodus ? (
        <Button
            type="button"
            onClick={() => onRemovePeriode(index)}
            icon={<TrashIcon aria-hidden />}
            variant="tertiary"
            size="xsmall"
        />
    ) : (
        <div className="min-w-[40px]"></div>
    );
};

export const Perioder = ({
    barnIndex,
    item,
    valideringsfeil,
}: {
    barnIndex: number;
    item: PrivatAvtaleFormValuesPerBarn;
    valideringsfeil: PrivatAvtaleValideringsfeilDto;
}) => {
    const { privatAvtale } = useGetBehandlingV2();
    const { lesemodus, setErrorMessage, setErrorModalOpen, setSaveErrorState } = useBehandlingProvider();
    const selectedPrivatAvtale = privatAvtale.find((avtale) => avtale.id === item.avtaleId);
    const [editableRow, setEditableRow] = useState<number>(undefined);
    const updatePrivatAvtaleQuery = useOnUpdatePrivatAvtale(item.avtaleId);
    const { control, clearErrors, getValues, setValue, setError, getFieldState } =
        useFormContext<PrivatAvtaleFormValues>();
    const barnFieldArray = useFieldArray({
        control,
        name: `roller.${barnIndex}.privatAvtale.perioder`,
    });
    const watchFieldArray = useWatch({ control, name: `roller.${barnIndex}.privatAvtale.perioder` });
    const controlledFields = barnFieldArray.fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });

    const validateRow = (index: number) => {
        const periode = getValues(`roller.${barnIndex}.privatAvtale.perioder.${index}`);
        if (periode.fom === null) {
            setError(`roller.${barnIndex}.privatAvtale.perioder.${index}.fom`, {
                type: "notValid",
                message: text.error.datoMåFyllesUt,
            });
        }
    };

    const onSaveRow = (index: number) => {
        validateRow(index);
        const fieldState = getFieldState(`roller.${barnIndex}.privatAvtale.perioder.${index}`);
        if (fieldState.error) return;

        const periode = getValues(`roller.${barnIndex}.privatAvtale.perioder.${index}`);
        let payload: OppdaterePrivatAvtaleRequest = {
            oppdaterPeriode: {
                periode: {
                    fom: periode.fom,
                    tom: periode.tom,
                },
                beløp: periode.beløp,
            },
        };

        if (periode.id) {
            payload = { oppdaterPeriode: { ...payload.oppdaterPeriode, id: periode.id } };
        }

        updatePrivatAvtaleQuery.mutation.mutate(payload, {
            onSuccess: (response) => {
                setEditableRow(undefined);
                if (!periode.id) {
                    setValue(
                        `roller.${barnIndex}.privatAvtale.perioder`,
                        response.oppdatertPrivatAvtale.perioder.map(transformPrivatAvtalePeriode)
                    );
                }

                updatePrivatAvtaleQuery.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        privatAvtale: currentData.privatAvtale.map((avtale) => {
                            if (avtale.id === item.avtaleId) return response.oppdatertPrivatAvtale;
                            return avtale;
                        }),
                    };
                });
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onSaveRow(index),
                });
            },
        });
    };

    const addPeriode = () => {
        barnFieldArray.append({
            fom: null,
            tom: null,
            beløp: 0,
        });
        setEditableRow(barnFieldArray.fields.length);
    };

    const checkIfAnotherRowIsEdited = (index?: number) => {
        return editableRow && Number(editableRow) !== index;
    };

    const showErrorModal = () => {
        setErrorMessage({
            title: text.alert.fullførRedigering,
            text: text.alert.periodeUnderRedigering,
        });
        setErrorModalOpen(true);
    };

    const onEditRow = (index: number) => {
        if (checkIfAnotherRowIsEdited(index)) {
            showErrorModal();
        } else {
            setEditableRow(index);
        }
    };

    const onRemovePeriode = (index: number) => {
        if (checkIfAnotherRowIsEdited(index)) {
            showErrorModal();
        } else {
            const periode = getValues(`roller.${barnIndex}.privatAvtale.perioder.${index}`);
            const removeAndCleanPeriodeErrors = () => {
                clearErrors(`roller.${barnIndex}.privatAvtale.perioder.${index}`);
                barnFieldArray.remove(index);
                setEditableRow(undefined);
            };

            if (periode.id) {
                updatePrivatAvtaleQuery.mutation.mutate(
                    { slettePeriodeId: periode.id },
                    {
                        onSuccess: (response) => {
                            removeAndCleanPeriodeErrors();
                            updatePrivatAvtaleQuery.queryClientUpdater((currentData) => {
                                return {
                                    ...currentData,
                                    privatAvtale: currentData.privatAvtale.map((avtale) => {
                                        if (avtale.id === item.avtaleId) return response.oppdatertPrivatAvtale;
                                        return avtale;
                                    }),
                                };
                            });
                        },
                        onError: () => {
                            setSaveErrorState({
                                error: true,
                                retryFn: () => onRemovePeriode(index),
                            });
                        },
                    }
                );
            } else {
                removeAndCleanPeriodeErrors();
            }
        }
    };

    const tableValideringsfeil =
        valideringsfeil?.overlappendePerioder?.length > 0 || valideringsfeil?.ingenLøpendePeriode;

    return (
        <div className="grid gap-2">
            {!lesemodus && tableValideringsfeil && (
                <BehandlingAlert variant="warning" className="mb-4">
                    <Heading size="xsmall" level="6">
                        {text.alert.feilIPeriodisering}.
                    </Heading>
                    {valideringsfeil?.overlappendePerioder?.length > 0 && (
                        <>
                            {valideringsfeil?.overlappendePerioder?.map(({ periode }, index) => (
                                <BodyShort key={`${periode.fom}-${periode.tom}-${index}`} size="small">
                                    {periode.tom &&
                                        removePlaceholder(
                                            text.alert.overlappendePerioder,
                                            DateToDDMMYYYYString(dateOrNull(periode.fom)),
                                            DateToDDMMYYYYString(dateOrNull(periode.tom))
                                        )}
                                    {!periode.tom &&
                                        removePlaceholder(
                                            text.alert.overlappendeLøpendePerioder,
                                            DateToDDMMYYYYString(dateOrNull(periode.fom))
                                        )}
                                </BodyShort>
                            ))}
                            <BodyShort size="small">{text.alert.overlappendePerioderFiks}</BodyShort>
                        </>
                    )}
                    {valideringsfeil?.ingenLøpendePeriode && (
                        <BodyShort size="small">{text.error.ingenLøpendePeriode}</BodyShort>
                    )}
                </BehandlingAlert>
            )}
            {controlledFields.length > 0 && (
                <div
                    className={`${
                        updatePrivatAvtaleQuery.mutation.isPending ? "relative" : "inherit"
                    } block overflow-x-auto whitespace-nowrap`}
                    data-section={elementIds.seksjon_perioder}
                >
                    <OverlayLoader loading={updatePrivatAvtaleQuery.mutation.isPending} />
                    <Table size="small" className="table-fixed table bg-white w-full">
                        <Table.Header>
                            <Table.Row className="align-baseline">
                                <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                                    {text.label.fraOgMed}
                                </Table.HeaderCell>
                                <Table.HeaderCell textSize="small" scope="col" align="left" className="w-[134px]">
                                    {text.label.tilOgMed}
                                </Table.HeaderCell>
                                <Table.HeaderCell textSize="small" scope="col" align="right">
                                    {text.label.beløp}
                                </Table.HeaderCell>
                                <Table.HeaderCell scope="col" className="w-[56px]" textSize="small"></Table.HeaderCell>
                                <Table.HeaderCell scope="col" className="w-[56px]" textSize="small"></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {controlledFields.map((item, index) => (
                                <Table.Row
                                    key={item?.id}
                                    className="align-top"
                                    onKeyDown={actionOnEnter(() => onSaveRow(index))}
                                >
                                    <Table.DataCell textSize="small">
                                        <Periode
                                            label={text.label.fraOgMed}
                                            fieldName={`roller.${barnIndex}.privatAvtale.perioder.${index}`}
                                            field="fom"
                                            item={item}
                                            editableRow={editableRow === index}
                                            privatAvtale={selectedPrivatAvtale}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell textSize="small">
                                        <Periode
                                            label={text.label.tilOgMed}
                                            fieldName={`roller.${barnIndex}.privatAvtale.perioder.${index}`}
                                            field="tom"
                                            item={item}
                                            editableRow={editableRow === index}
                                            privatAvtale={selectedPrivatAvtale}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell textSize="small">
                                        <Beløp
                                            item={item}
                                            editableRow={editableRow === index}
                                            field={`roller.${barnIndex}.privatAvtale.perioder.${index}.beløp`}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell textSize="small">
                                        <EditOrSaveButton
                                            index={index}
                                            editableRow={editableRow === index}
                                            onEditRow={onEditRow}
                                            onSaveRow={onSaveRow}
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell textSize="small">
                                        <DeleteButton index={index} onRemovePeriode={onRemovePeriode} />
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            )}
            <div className="grid gap-2">
                {!lesemodus && (
                    <Button variant="tertiary" type="button" size="small" className="w-fit" onClick={addPeriode}>
                        {text.label.leggTilPeriode}
                    </Button>
                )}
            </div>
        </div>
    );
};
