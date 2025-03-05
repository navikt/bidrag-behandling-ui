import { PrivatAvtaleDto, PrivatAvtalePeriodeDto, RolleDto } from "@api/BidragBehandlingApiV1";

import { PrivatAvtaleFormValues, PrivatAvtaleFormValuesPerBarn } from "../../../types/privatAvtaleFormValues";

export const createInitialValues = (privatAvtaler: PrivatAvtaleDto[], baRoller: RolleDto[]): PrivatAvtaleFormValues => {
    return {
        roller: baRoller.map((rolle) => {
            const privatAvtale = privatAvtaler.find((avtale) => avtale.gjelderBarn.ident === rolle.ident);
            return {
                gjelderBarn: {
                    ident: rolle.ident,
                    navn: rolle.navn,
                    fødselsdato: rolle.fødselsdato,
                },
                privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
            };
        }),
    };
};
export const transformPrivatAvtalePeriode = (periode: PrivatAvtalePeriodeDto) => ({
    id: periode.id,
    fom: periode.periode.fom,
    tom: periode.periode.tom ?? null,
    beløp: periode.beløp,
});

export const createPrivatAvtaleInitialValues = (privatAvtale: PrivatAvtaleDto): PrivatAvtaleFormValuesPerBarn => {
    return {
        avtaleId: privatAvtale.id,
        skalIndeksreguleres: privatAvtale.skalIndeksreguleres,
        avtaleDato: privatAvtale.avtaleDato ?? null,
        begrunnelse: privatAvtale.begrunnelse ?? "",
        perioder: privatAvtale.perioder.map(transformPrivatAvtalePeriode),
    };
};
