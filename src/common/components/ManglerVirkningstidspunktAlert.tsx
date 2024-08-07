import { isValidDate } from "@navikt/bidrag-ui-common";
import { dateOrNull } from "@utils/date-utils";
import React from "react";

import text from "../constants/texts";
import { useGetBehandlingV2 } from "../hooks/useApiData";
import { BehandlingAlert } from "./BehandlingAlert";

export const ManglerVirkningstidspunktAlert = () => {
    const {
        virkningstidspunkt: { virkningstidspunkt: virkningstidspunktRes },
    } = useGetBehandlingV2();
    const virkningstidspunktIsValid = isValidDate(dateOrNull(virkningstidspunktRes));

    if (virkningstidspunktIsValid) return null;

    return (
        !virkningstidspunktIsValid && (
            <BehandlingAlert variant="warning">{text.alert.manglerVirkningstidspunkt}</BehandlingAlert>
        )
    );
};
