import {
    BeregnetUnderholdskostnad,
    FaktiskTilsynsutgiftDto,
    StonadTilBarnetilsynDto,
    TilleggsstonadDto,
    UnderholdDto,
} from "@api/BidragBehandlingApiV1";

import {
    FaktiskTilsynsutgiftPeriode,
    StønadTilBarnetilsynPeriode,
    TilleggsstonadPeriode,
    UnderholdskostnadFormValues,
} from "../../../types/underholdskostnadFormValues";

export const mapBeregnetUnderholdskostnadToRole =
    (beregnetUnderholdskostnader: BeregnetUnderholdskostnad[]) => (cachedUnderhold: UnderholdDto) => {
        let updatedUnderhold = { ...cachedUnderhold };
        const updatedBeregnetUnderholdskostnad = beregnetUnderholdskostnader.find(
            (bU) => bU.gjelderBarn.ident === cachedUnderhold.gjelderBarn.ident
        );
        if (updatedBeregnetUnderholdskostnad) {
            updatedUnderhold = {
                ...updatedUnderhold,
                beregnetUnderholdskostnad: updatedBeregnetUnderholdskostnad
                    ? updatedBeregnetUnderholdskostnad.perioder
                    : cachedUnderhold.beregnetUnderholdskostnad,
            };
        }

        return updatedUnderhold;
    };

export const transformUnderholdskostnadPeriode = (
    periode: StonadTilBarnetilsynDto | FaktiskTilsynsutgiftDto | TilleggsstonadDto
) => ({
    ...periode,
    datoFom: periode.periode.fom,
    datoTom: periode.periode.tom,
    kanRedigeres: true,
    erRedigerbart: false,
});
export const createInitialValues = (underholdskostnader: UnderholdDto[]): UnderholdskostnadFormValues => {
    const underholdskostnaderMedIBehandling = underholdskostnader.filter(
        (underhold) => underhold.gjelderBarn.medIBehandlingen
    );
    const underholdskostnaderAndreBarn = underholdskostnader.filter(
        (underhold) => !underhold.gjelderBarn.medIBehandlingen
    );
    return {
        underholdskostnaderMedIBehandling: underholdskostnaderMedIBehandling.map((underhold) => ({
            ...underhold,
            stønadTilBarnetilsyn: underhold.stønadTilBarnetilsyn.map((barnetilsyn) => ({
                ...(transformUnderholdskostnadPeriode(barnetilsyn) as StønadTilBarnetilsynPeriode),
            })),
            faktiskTilsynsutgift: underhold.faktiskTilsynsutgift.map((tilsynsutgift) => ({
                ...(transformUnderholdskostnadPeriode(tilsynsutgift) as FaktiskTilsynsutgiftPeriode),
            })),
            tilleggsstønad: underhold.tilleggsstønad.map((tillegsstonad) => ({
                ...(transformUnderholdskostnadPeriode(tillegsstonad) as TilleggsstonadPeriode),
            })),
        })),
        underholdskostnaderAndreBarn: underholdskostnaderAndreBarn.map((underhold) => ({
            ...underhold,
            faktiskTilsynsutgift: underhold.faktiskTilsynsutgift.map((tilsynsutgift) => ({
                ...(transformUnderholdskostnadPeriode(tilsynsutgift) as FaktiskTilsynsutgiftPeriode),
            })),
        })),
        underholdskostnaderAndreBarnBegrunnelse: underholdskostnaderAndreBarn[0]?.begrunnelse ?? "",
    };
};
