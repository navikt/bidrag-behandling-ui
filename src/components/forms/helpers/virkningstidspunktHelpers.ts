import { lastDayOfMonth } from "@navikt/bidrag-ui-common";

import { BehandlingDtoV2, TypeArsakstype } from "../../../api/BidragBehandlingApiV1";
import { deductMonths, firstDayOfMonth, isAfterDate } from "../../../utils/date-utils";

export const getSoktFraOrMottatDato = (soktFraDato: Date, mottatDato: Date) => {
    return isAfterDate(soktFraDato, mottatDato) ? soktFraDato : mottatDato;
};
export const aarsakToVirkningstidspunktMapper = (
    aarsak: TypeArsakstype | string,
    behandling: BehandlingDtoV2,
    barnsFødselsdato?: string
) => {
    const soktFraDato = new Date(behandling.søktFomDato);
    const mottatDato = new Date(behandling.mottattdato);
    const mottatOrSoktFraDato = getSoktFraOrMottatDato(soktFraDato, mottatDato);
    const treMaanederTilbakeFraMottatDato = firstDayOfMonth(deductMonths(mottatDato, 3));
    const treMaanederTilbake = isAfterDate(soktFraDato, treMaanederTilbakeFraMottatDato)
        ? firstDayOfMonth(soktFraDato)
        : treMaanederTilbakeFraMottatDato;

    switch (aarsak) {
        case TypeArsakstype.FRABARNETSFODSEL:
            return barnsFødselsdato && isAfterDate(new Date(barnsFødselsdato), mottatOrSoktFraDato)
                ? firstDayOfMonth(new Date(barnsFødselsdato))
                : firstDayOfMonth(mottatOrSoktFraDato);
        // Fra kravfremsettelse
        case TypeArsakstype.FRA_KRAVFREMSETTELSE:
            return firstDayOfMonth(mottatOrSoktFraDato);
        // 3 måneder tilbake
        case TypeArsakstype.TREMANEDERTILBAKE:
            return isAfterDate(new Date(), soktFraDato) ? treMaanederTilbake : null;
        // Fra søknadstidspunkt
        case TypeArsakstype.FRASOKNADSTIDSPUNKT:
            return firstDayOfMonth(soktFraDato);
        default:
            return null;
    }
};

export const getFomAndTomForMonthPicker = (virkningstidspunkt: Date | string) => {
    const virkningstidspunktIsInFuture = isAfterDate(
        firstDayOfMonth(new Date(virkningstidspunkt)),
        firstDayOfMonth(new Date())
    );
    const fom = firstDayOfMonth(new Date(virkningstidspunkt));
    const tom = virkningstidspunktIsInFuture
        ? lastDayOfMonth(new Date(virkningstidspunkt))
        : lastDayOfMonth(new Date());
    return [fom, tom];
};
