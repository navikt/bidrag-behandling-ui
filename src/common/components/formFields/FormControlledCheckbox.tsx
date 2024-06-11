import { Checkbox } from "@navikt/ds-react";
import React, { BaseSyntheticEvent } from "react";
import { useController, useFormContext } from "react-hook-form";

import { useForskudd } from "../../../forskudd/context/ForskuddContext";

export const FormControlledCheckbox = ({
    name,
    legend,
    onChange,
    className,
}: {
    name: string;
    legend: string;
    onChange?: (checked: boolean) => void;
    className?: string;
}) => {
    const { control } = useFormContext();
    const { lesemodus } = useForskudd();
    const { field } = useController({ name, control });

    const handleOnChange = (value: BaseSyntheticEvent) => {
        field.onChange(value.target.checked);
        onChange?.(value.target.checked);
    };

    return (
        <Checkbox
            {...field}
            checked={field.value}
            className={className}
            onChange={handleOnChange}
            size="small"
            readOnly={lesemodus}
        >
            {legend}
        </Checkbox>
    );
};
