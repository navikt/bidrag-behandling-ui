import {
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
    return {
        underholdskostnaderMedIBehandling: underholdskostnader
            .filter((underhold) => underhold.gjelderBarn.medIBehandlingen)
            .map((underhold) => ({
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
        underholdskostnaderAndreBarn: underholdskostnader
            .filter((underhold) => !underhold.gjelderBarn.medIBehandlingen)
            .map((underhold) => ({
                ...underhold,
                faktiskTilsynsutgift: underhold.faktiskTilsynsutgift.map((tilsynsutgift) => ({
                    ...(transformUnderholdskostnadPeriode(tilsynsutgift) as FaktiskTilsynsutgiftPeriode),
                })),
            })),
    };
};
