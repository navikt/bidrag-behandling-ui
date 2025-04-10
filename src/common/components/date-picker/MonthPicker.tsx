import { MonthPicker as NavMonthPicker, MonthValidationT, useMonthpicker } from "@navikt/ds-react";
import { Matcher } from "@navikt/ds-react/src/date/utils";
import { dateOrNull, isValidDate, lastDayOfMonth } from "@utils/date-utils";
import React, { useEffect } from "react";

interface MonthPickerInputProps {
    onChange: (selectedDay: Date | undefined) => void;
    label: string;
    fromDate?: Date;
    placeholder?: string;
    hideLabel?: boolean;
    className?: string;
    defaultValue?: string;
    error?: string;
    onValidate?: (monthValidation: MonthValidationT) => void;
    toDate?: Date;
    lastDayOfMonthPicker?: boolean;
    readonly?: boolean;
    fieldValue?: Date | string;
    disabledMonths?: Matcher[];
}
export const MonthPicker = ({
    label,
    onChange,
    fromDate,
    toDate,
    placeholder,
    hideLabel,
    className,
    defaultValue,
    onValidate,
    error,
    lastDayOfMonthPicker,
    readonly,
    fieldValue,
    disabledMonths,
}: MonthPickerInputProps) => {
    const { monthpickerProps, inputProps, setSelected, selectedMonth } = useMonthpicker({
        fromDate,
        toDate,
        defaultSelected: isValidDate(new Date(defaultValue)) ? dateOrNull(defaultValue) : null,
        inputFormat: "dd.MM.yyyy",
        onValidate: (val) => onValidate?.(val),
        onMonthChange: (date) => onChange(date),
        disabled: disabledMonths,
    });

    const onMonthSelect = (date) => {
        const dateToSave = isValidDate(date) ? (lastDayOfMonthPicker ? lastDayOfMonth(date) : date) : null;
        monthpickerProps.onMonthSelect(dateToSave);
    };

    useEffect(() => {
        const value = fieldValue === null ? null : new Date(fieldValue);
        if (
            (isValidDate(value) && selectedMonth?.toLocaleString() !== value?.toLocaleString()) ||
            (value === null && selectedMonth !== null)
        ) {
            setSelected(value);
        }
    }, [defaultValue, fieldValue]);

    return (
        <div className="">
            <NavMonthPicker {...monthpickerProps} onMonthSelect={onMonthSelect} dropdownCaption>
                <div className="grid gap-4 w-min">
                    <NavMonthPicker.Input
                        {...inputProps}
                        className={className}
                        label={label}
                        error={error}
                        readOnly={readonly}
                        hideLabel={hideLabel}
                        placeholder={placeholder}
                        size="small"
                    />
                </div>
            </NavMonthPicker>
        </div>
    );
};
