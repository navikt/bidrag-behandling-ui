import {
    BehandlingDtoV2,
    Innkrevingstype,
    Rolletype,
    SoktAvType,
    Stonadstype,
    TypeBehandling,
    Vedtakstype,
} from "@api/BidragBehandlingApiV1";

export const behandlingMockApiData: BehandlingDtoV2 = {
    id: 1,
    erVedtakUtenBeregning: false,
    erDelvedtakFattet: false,
    innkrevingstype: Innkrevingstype.MED_INNKREVING,
    type: TypeBehandling.FORSKUDD,
    søknadsid: 1234,
    erVedtakFattet: false,
    vedtakstype: Vedtakstype.FASTSETTELSE,
    vedtakstypeVisningsnavn: "",
    stønadstype: Stonadstype.FORSKUDD,
    søktFomDato: "2019-04-01",
    mottattdato: "2019-11-03",
    saksnummer: "2300138",
    behandlerenhet: "4806",
    søktAv: SoktAvType.BIDRAGSMOTTAKER,
    erKlageEllerOmgjøring: false,
    opprettetTidspunkt: "2019-04-01",
    erBisysVedtak: false,
    medInnkreving: false,
    kanBehandlesINyLøsning: true,
    underholdskostnader: [],
    roller: [
        {
            id: 1,
            rolletype: Rolletype.BA,
            ident: "03522150877",
        },
        {
            id: 4,
            rolletype: Rolletype.BA,
            ident: "07512150855",
        },
        {
            id: 2,
            rolletype: Rolletype.BP,
            ident: "31459900198",
        },
        {
            id: 3,
            rolletype: Rolletype.BM,
            ident: "21470262629",
        },
    ],
    boforhold: {
        husstandsmedlem: [],
        andreVoksneIHusstanden: [],
        husstandsbarn: [],
        sivilstand: [],
        begrunnelse: {
            kunINotat: "",
            innhold: "",
        },
        notat: {
            kunINotat: "",
            innhold: "",
        },
        valideringsfeil: null,
        beregnetBoforhold: [],
    },
    inntekter: {
        månedsinntekter: [],
        årsinntekter: [],
        barnetillegg: [],
        småbarnstillegg: [],
        kontantstøtte: [],
        utvidetBarnetrygd: [],
        beregnetInntekter: [],
        begrunnelser: [
            {
                kunINotat: "",
                innhold: "",
            },
        ],
        begrunnelserFraOpprinneligVedtak: [],
        notat: {
            kunINotat: "",
            innhold: "",
        },
        valideringsfeil: null,
    },
    virkningstidspunkt: {
        virkningstidspunkt: "",
        årsak: null,
        begrunnelse: {
            kunINotat: "",
            innhold: "",
        },
        notat: {
            kunINotat: "",
            innhold: "",
        },
        harLøpendeBidrag: false,
        opphør: {
            opphørsdato: null,
            opphørRoller: [],
        },
    },
    virkningstidspunktV2: [
        {
            rolle: {
                id: 1,
                rolletype: Rolletype.BA,
                ident: "03522150877",
            },
            virkningstidspunkt: "",
            årsak: null,
            begrunnelse: {
                kunINotat: "",
                innhold: "",
            },
            notat: {
                kunINotat: "",
                innhold: "",
            },
            harLøpendeBidrag: false,
            kanSkriveVurderingAvSkolegang: false,
            manuelleVedtak: [],
        },
    ],
    aktiveGrunnlagsdata: {
        arbeidsforhold: [],
        husstandsbarn: [],
        husstandsmedlem: [],
        husstandsmedlemBM: [],
    },
    ikkeAktiverteEndringerIGrunnlagsdata: {
        arbeidsforhold: [],
        inntekter: null,
        husstandsbarn: [],
        husstandsmedlem: [],
        husstandsmedlemBM: [],
    },
};
