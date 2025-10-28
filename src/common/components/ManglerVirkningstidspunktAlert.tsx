import { isValidDate } from "@navikt/bidrag-ui-common";
import { dateOrNull } from "@utils/date-utils";
import React from "react";

import text from "../constants/texts";
import { useGetBehandlingV2 } from "../hooks/useApiData";
import { BehandlingAlert } from "./BehandlingAlert";

export const ManglerVirkningstidspunktAlert = () => {
    const { virkningstidspunktV3: virkningstidspunkt } = useGetBehandlingV2();
    const virkningstidspunktIsValid = isValidDate(dateOrNull(virkningstidspunkt.eldsteVirkningstidspunkt));

    if (virkningstidspunktIsValid) return null;

    return (
        !virkningstidspunktIsValid && (
            <BehandlingAlert variant="warning">{text.alert.manglerVirkningstidspunkt}</BehandlingAlert>
        )
    );
};
