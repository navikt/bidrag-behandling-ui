import { TextField } from "@navikt/ds-react";
import React from "react";
import { useController, useFormContext } from "react-hook-form";

export const FormControlledTextField = ({
    name,
    label,
    hideLabel,
    type,
    disabled,
    min,
    editable = true,
    inputMode,
}: {
    name: string;
    label: string;
    hideLabel?: boolean;
    type?: "number" | "email" | "password" | "tel" | "text" | "url";
    disabled?: boolean;
    editable?: boolean;
    min?: string | number;
    inputMode?: "email" | "tel" | "text" | "url" | "search" | "none" | "numeric" | "decimal";
}) => {
    const { control, clearErrors } = useFormContext();
    const { field, fieldState } = useController({ name, control });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors(name);
        if (type === "number") {
            field.onChange(Number(e.target.value));
        } else {
            field.onChange(e.target.value);
        }
    };

    if (!editable) {
        return <div className="h-8 flex items-center">{field.value?.toString()}</div>;
    }
    return (
        <TextField
            type={type}
            label={label}
            size="small"
            value={field.value?.toString()}
            onChange={(value) => onChange(value)}
            hideLabel={hideLabel}
            disabled={disabled}
            error={fieldState?.error?.message}
            min={min}
            inputMode={inputMode}
        />
    );
};