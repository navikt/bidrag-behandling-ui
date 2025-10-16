import { PrivatAvtaleDto, PrivatAvtalePeriodeDto, RolleDto } from "@api/BidragBehandlingApiV1";

import {
    PrivatAvtaleFormValue,
    PrivatAvtaleFormValues,
    PrivatAvtaleFormValuesPerBarn,
} from "../../../types/privatAvtaleFormValues";

export const createInitialValues = (
    privatAvtaler: PrivatAvtaleDto[],
    baRoller: RolleDto[],
    bpsBarnUtenBidraggsak: RolleDto[]
): PrivatAvtaleFormValues => {
    const paSøknadsbarn: PrivatAvtaleFormValue[] = baRoller.map((rolle) => {
        const privatAvtale = privatAvtaler.find((avtale) => avtale.gjelderBarn.ident === rolle.ident);
        return {
            gjelderBarn: {
                ident: rolle.ident,
                navn: rolle.navn,
                fødselsdato: rolle.fødselsdato,
            },
            bpsBarnUtenBidraggsak: false,
            privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
        };
    });
    const paBarnUtenBidragssak = bpsBarnUtenBidraggsak.map((rolle) => {
        const privatAvtale = privatAvtaler.find((avtale) => avtale.gjelderBarn.ident === rolle.ident);
        return {
            gjelderBarn: {
                ident: rolle.ident,
                navn: rolle.navn,
                fødselsdato: rolle.fødselsdato,
            },
            bpsBarnUtenBidraggsak: true,
            privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
        };
    });
    return {
        roller: paSøknadsbarn.concat(paBarnUtenBidragssak),
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
        avtaleType: privatAvtale.avtaleType ?? "",
        begrunnelse: privatAvtale.begrunnelse ?? "",
        perioder: privatAvtale.perioder.map(transformPrivatAvtalePeriode),
    };
};
