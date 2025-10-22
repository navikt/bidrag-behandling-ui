export type PrivatAvtaleFormValue = {
    gjelderBarn: {
        ident?: string;
        navn?: string;
        fødselsdato?: string;
    };
    harLøpendeBidrag: boolean;
    saksnummer?: string;
    enhet?: string;
    lagtTilManuelt?: boolean;
    privatAvtale: PrivatAvtaleFormValuesPerBarn | null;
};
export type PrivatAvtaleFormValues = {
    roller: PrivatAvtaleFormValue[];
    andreBarn: PrivatAvtaleFormValue[];
    andreBarnBegrunnelse?: string;
};
export type PrivatAvtalePeriode = {
    id?: number;
    fom: string | null;
    tom: string | null;
    beløp: number;
};
export type PrivatAvtaleFormValuesPerBarn = {
    avtaleDato: string | null;
    avtaleType: string | null;
    begrunnelse: string;
    perioder: PrivatAvtalePeriode[];
    skalIndeksreguleres: boolean;
    avtaleId: number;
};
