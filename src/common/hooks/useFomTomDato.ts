import { getFomAndTomForMonthPicker } from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useVirkningsdato } from "@common/hooks/useVirkningsdato";
import { addMonthsIgnoreDay } from "@utils/date-utils";

// TODO edit when backend is ready with multiple roles
export const useFomTomDato = (isDatepickerTom: boolean, datoFra?: Date) => {
    const virkningsOrSoktFraDato = useVirkningsdato();
    const {
        virkningstidspunkt: { opphør },
        virkningstidspunktV2,
    } = useGetBehandlingV2();
    const opphørsTomDato = opphør?.opphørsdato ? new Date(opphør.opphørsdato) : undefined;
    const beregnTilDato = virkningstidspunktV2[0].beregnTilDato
        ? new Date(virkningstidspunktV2[0].beregnTilDato)
        : undefined;
    const [fom, baselineTom] = getFomAndTomForMonthPicker(
        datoFra ?? virkningsOrSoktFraDato,
        opphørsTomDato,
        beregnTilDato
    );
    const tom = isDatepickerTom || opphørsTomDato ? baselineTom : addMonthsIgnoreDay(baselineTom, 1);

    return [fom, tom];
};
