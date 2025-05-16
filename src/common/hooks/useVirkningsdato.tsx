import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { dateOrNull } from "@utils/date-utils";
import { useMemo } from "react";

// TODO upgrade to virkningstidspunktV2 when backend is ready with multiple roles
export const useVirkningsdato = () => {
    const {
        søktFomDato,
        virkningstidspunkt: { virkningstidspunkt: virkningsdato },
    } = useGetBehandlingV2();
    const virkningsOrSoktFraDato = useMemo(
        () => dateOrNull(virkningsdato) ?? dateOrNull(søktFomDato),
        [virkningsdato, søktFomDato]
    );

    return virkningsOrSoktFraDato;
};
