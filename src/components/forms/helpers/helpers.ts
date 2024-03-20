import { isAfterEqualsDate, isBeforeOrEqualsDate } from "../../../utils/date-utils";

export const periodsAreOverlapping = (
    periodeA: { datoFom: string; datoTom?: string; inntektstype?: string },
    periodeB: { datoFom: string; datoTom?: string; inntektstype?: string }
) => {
    const periodeBFomIsBeforePeriodeATom =
        periodeA.datoTom === null || isBeforeOrEqualsDate(periodeB.datoFom, periodeA.datoTom);
    const periodeBTomIsAfterPeriodeAFom =
        periodeB.datoTom === null || isAfterEqualsDate(periodeB.datoTom, periodeA.datoFom);

    return (
        periodeBFomIsBeforePeriodeATom &&
        periodeBTomIsAfterPeriodeAFom &&
        periodeA.inntektstype === periodeB.inntektstype
    );
};
