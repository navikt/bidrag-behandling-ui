import { Checkbox } from "@navikt/ds-react";
import React, { ReactElement } from "react";

import { BidragSakDto } from "../../../types/bidragSakTypes";

interface SelectSakCheckboxProps {
    isSelected: boolean;
    sak: BidragSakDto;
    onChecked: () => void;
}
export default function SelectSakCheckbox({ sak, isSelected, onChecked }: SelectSakCheckboxProps): ReactElement {
    return (
        <>
            <Checkbox
                className={"sakstilknyttningCheckbox"}
                checked={isSelected}
                value={sak.saksnummer}
                onChange={() => {
                    onChecked();
                }}
            >
                {" "}
            </Checkbox>
        </>
    );
}
