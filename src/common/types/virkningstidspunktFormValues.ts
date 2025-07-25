import { Resultatkode, RolleDto, TypeArsakstype } from "@api/BidragBehandlingApiV1";

export enum OpphørsVarighet {
    LØPENDE = "Løpende",
    FORTSETTE_OPPHØR = "Fortsette opphør",
    VELG_OPPHØRSDATO = "Velg opphørsdato",
}

export type VirkningstidspunktFormValues = {
    roller: VirkningstidspunktFormValuesPerBarn[];
};

export interface VirkningstidspunktFormValuesPerBarn {
    rolle: RolleDto;
    virkningstidspunkt?: string | null;
    årsakAvslag: TypeArsakstype | Resultatkode | string | null;
    begrunnelse?: string;
    begrunnelseVurderingAvSkolegang?: string;
    kanSkriveVurderingAvSkolegang?: boolean;
    opphørsvarighet?: OpphørsVarighet;
    opphørsdato?: string | null;
}
