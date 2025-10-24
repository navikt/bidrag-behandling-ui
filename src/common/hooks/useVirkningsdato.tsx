import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { dateOrNull } from "@utils/date-utils";
import { useMemo } from "react";

export const useVirkningsdato = () => {
    const { søktFomDato, virkningstidspunktV3: virkningstidspunkt } = useGetBehandlingV2();
    const virkningsOrSoktFraDato = useMemo(
        () => dateOrNull(virkningstidspunkt.eldsteVirkningstidspunkt) ?? dateOrNull(søktFomDato),
        [virkningstidspunkt.eldsteVirkningstidspunkt, søktFomDato]
    );

    return virkningsOrSoktFraDato;
};
