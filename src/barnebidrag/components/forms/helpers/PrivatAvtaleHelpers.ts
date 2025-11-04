import { PrivatAvtaleBarnDto, PrivatAvtaleDto, PrivatAvtalePeriodeDto } from "@api/BidragBehandlingApiV1";

import { PrivatAvtaleFormValues, PrivatAvtaleFormValuesPerBarn } from "../../../types/privatAvtaleFormValues";

export const createInitialValues = (privatAvtale: PrivatAvtaleDto): PrivatAvtaleFormValues => {
    const privatAvtaleBarn = privatAvtale.barn.map((avtale) => ({
        gjelderBarn: {
            ident: avtale.gjelderBarn.ident,
            navn: avtale.gjelderBarn.navn,
            fødselsdato: avtale.gjelderBarn.fødselsdato,
        },
        harLøpendeBidrag: true,
        saksnummer: undefined,
        privatAvtale: avtale ? createPrivatAvtaleInitialValues(avtale) : null,
    }));

    const privatAvtaleAndreBarn = privatAvtale.andreBarn.barn.map((avtale) => ({
        gjelderBarn: {
            ident: avtale.gjelderBarn.ident,
            navn: avtale.gjelderBarn.navn,
            fødselsdato: avtale.gjelderBarn.fødselsdato,
        },
        harLøpendeBidrag: false,
        saksnummer: undefined,
        enhet: undefined,
        lagtTilManuelt: true,
        privatAvtale: avtale ? createPrivatAvtaleInitialValues(avtale) : null,
    }));

    return {
        roller: privatAvtaleBarn,
        andreBarn: privatAvtaleAndreBarn,
        andreBarnBegrunnelse: privatAvtale.andreBarn.begrunnelse,
    };
};
export const transformPrivatAvtalePeriode = (periode: PrivatAvtalePeriodeDto) => ({
    id: periode.id,
    fom: periode.periode.fom,
    tom: periode.periode.tom ?? null,
    beløp: periode.beløp,
});

export const createPrivatAvtaleInitialValues = (privatAvtale: PrivatAvtaleBarnDto): PrivatAvtaleFormValuesPerBarn => {
    return {
        avtaleId: privatAvtale.id,
        skalIndeksreguleres: privatAvtale.skalIndeksreguleres,
        avtaleDato: privatAvtale.avtaleDato ?? null,
        avtaleType: privatAvtale.avtaleType ?? "",
        begrunnelse: privatAvtale.begrunnelse ?? "",
        perioder: privatAvtale.perioder.map(transformPrivatAvtalePeriode),
    };
};
