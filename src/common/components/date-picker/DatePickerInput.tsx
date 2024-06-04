import { DatePicker, DateValidationT, useDatepicker } from "@navikt/ds-react";
import React, { useEffect } from "react";

import { dateOrNull, isValidDate } from "../../../utils/date-utils";

interface DatePickerInputProps {
    onChange: (selectedDay: Date | undefined) => void;
    label: string;
    fromDate?: Date;
    toDate?: Date;
    placeholder?: string;
    hideLabel?: boolean;
    className?: string;
    defaultValue?: string;
    error?: string;
    strategy?: "absolute" | "fixed";
    onValidate?: (dateValidation: DateValidationT) => void;
    fieldValue?: Date | string;
}

export const DatePickerInput = ({
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
    strategy = "absolute",
    fieldValue,
}: DatePickerInputProps) => {
    const { datepickerProps, inputProps, setSelected } = useDatepicker({
        onDateChange: (date) => {
            onChange(date);
        },
        onValidate: (val) => {
            if (onValidate) onValidate(val);
        },
        fromDate,
        toDate,
        defaultSelected: isValidDate(new Date(defaultValue)) ? dateOrNull(defaultValue) : null,
    });
    datepickerProps.strategy = strategy;

    useEffect(() => {
        const value = fieldValue === null ? null : new Date(fieldValue);
        if (
            (isValidDate(value) && datepickerProps.selected?.toLocaleString() !== value?.toLocaleString()) ||
            (value === null && datepickerProps.selected !== null)
        ) {
            setSelected(value);
        }
    }, [defaultValue, fieldValue]);

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                className={className}
                hideLabel={hideLabel}
                placeholder={placeholder}
                label={label}
                error={error}
                size="small"
            />
        </DatePicker>
    );
};
