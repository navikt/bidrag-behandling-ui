import {
    BpsBarnUtenLopendeBidragDto,
    PrivatAvtaleDto,
    PrivatAvtalePeriodeDto,
    RolleDto,
} from "@api/BidragBehandlingApiV1";

import {
    PrivatAvtaleFormValue,
    PrivatAvtaleFormValues,
    PrivatAvtaleFormValuesPerBarn,
} from "../../../types/privatAvtaleFormValues";

export const createInitialValues = (
    privatAvtaler: PrivatAvtaleDto[],
    baRoller: RolleDto[],
    bpsBarnUtenLøpendeBidrag: BpsBarnUtenLopendeBidragDto[]
): PrivatAvtaleFormValues => {
    const paSøknadsbarn: PrivatAvtaleFormValue[] = baRoller.map((rolle) => {
        const privatAvtale = privatAvtaler
            .filter((p) => p.erSøknadsbarn)
            .find((avtale) => avtale.gjelderBarn.ident === rolle.ident);
        return {
            gjelderBarn: {
                ident: rolle.ident,
                navn: rolle.navn,
                fødselsdato: rolle.fødselsdato,
            },
            harLøpendeBidrag: true,
            saksnummer: undefined,
            privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
        };
    });
    const paBarnUtenLøpendeBidrag = bpsBarnUtenLøpendeBidrag.map((rolle) => {
        const privatAvtale = privatAvtaler.find((avtale) => avtale.gjelderBarn.ident === rolle.ident);
        return {
            gjelderBarn: {
                ident: rolle.ident,
                navn: rolle.navn,
                fødselsdato: rolle.fødselsdato,
            },
            harLøpendeBidrag: false,
            saksnummer: rolle.saksnummer,
            enhet: rolle.enhet,
            privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
        };
    });
    const paIkkeSøknadsbarn = privatAvtaler
        .filter((p) => !p.erSøknadsbarn && !bpsBarnUtenLøpendeBidrag.some((b) => b.ident === p.gjelderBarn.ident))
        .map((privatAvtale) => {
            const rolle = privatAvtale.gjelderBarn;
            return {
                gjelderBarn: {
                    ident: rolle.ident,
                    navn: rolle.navn,
                    fødselsdato: rolle.fødselsdato,
                },
                harLøpendeBidrag: false,
                saksnummer: undefined,
                enhet: undefined,
                lagtTilManuelt: true,
                privatAvtale: privatAvtale ? createPrivatAvtaleInitialValues(privatAvtale) : null,
            };
        });
    return {
        roller: paSøknadsbarn,
        andreBarn: paBarnUtenLøpendeBidrag.concat(paIkkeSøknadsbarn),
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
