import {
    MaBekrefteNyeOpplysninger,
    OpplysningerType,
    RolleDto,
    Rolletype,
    TypeBehandling,
} from "@api/BidragBehandlingApiV1";

const tekster = {
    alert: {
        ansettelsesdetaljerEndret: "Ansettelsesdetaljer fra arbeidsgiver {} er endret",
        antallArbeidsforholdEndret: "Antall arbeidsforhold for {} har blitt endret",
        antallBarnetilleggPerioderEndret: "Antall barnetillegg perioder har blitt endret",
        antallSivilstandsperioderEndret: "Antall sivilstandsperioder har blitt endret i Folkeregisteret",
        antallUtvidetBarnetrygdPerioderEndret: "Antall utvidet barnetrygd perioder har blitt endret",
        barnSomHarBlittLagtInn: "Barn som har blitt lagt inn i nye opplysninger fra Folkeregisteret:",
        barnSomIkkeFinnes: "Barn som ikke finnes i nye opplysninger fra Folkeregisteret:",
        beløpEndret: "Beløp for en eller flere perioder har blitt endret",
        endretVirkningstidspunkt:
            "Virkningstidspunktet er endret. Dette kan påvirke beregningen. <br> Inntekter og boforhold må manuelt vurderes på nytt",
        endringer: "Følgende endringer har blitt utført:",
        enEllerFlereBoforholdPerioderEndret: "En eller flere perioder har blitt endret for barn med ident - {}",
        enEllerFlereInntektPerioderLagtTil: "En eller flere inntekt perioder har blitt lagt til rolle med ident - {}",
        enEllerFlereSivilstandPerioderEndret: "En eller flere sivilstandsperioder har blitt endret",
        feilIPeriodisering: "Feil i periodisering",
        feilVedInnhentingAvOffentligData: "Data fra offentlig registre feiler",
        nyOpplysninger: "Nye opplysninger fra offentlig register vil erstatte de gamle",
        nyOpplysningerBoforhold: "Vil du ta i bruk de nye opplysningene?",
        nyOpplysningerInfo: "Nye opplysninger fra offentlig register er tilgjengelig.",
        nyOpplysningerInfomelding: "Dette kan medføre at inntekt som er lagt til grunn må vurderes på nytt.",
        flereBarnRegistrertPåAdresse: "Det er flere barn registret på samme adresse i offentlige registre.",
        fullførRedigering: "Fullfør redigering",
        færreBarnRegistrertPåAdresse: "Det er færre barn registrert på samme adresse i offentlige registre.",
        ingenInntekt: "Ingen inntekt funnet",
        manglerVirkningstidspunkt: "Mangler virkningstidspunkt",
        minstEnInntektMindre: "Det er minst en inntekt som legges til grunn mindre for person med ident - {}",
        nyeOpplysninger: "Nye opplysninger tilgjengelig. Sist hentet {}",
        overlappendeLøpendePerioder: "To eller flere løpende inntektsperioder fra {} overlapper.",
        overlappendePerioder: "To eller flere inntektsperioder i perioden {} - {} overlapper.",
        overlappendePerioderFiks: "Rediger eller slett periodene.",
        periodeUnderRedigering: "Det er en periode som er under redigering. Fullfør redigering eller slett periode.",
        sluttdatoForArbeidsforholdEndret: "Sluttdato for arbeidsforhold {} er endret fra {} til {}",
        startdatoForArbeidsforholdEndret: "Startdato for arbeidsforhold {} er endret",
        stillingprosentEndret: "Stillingprosent fra arbeidsgiver {} er endret fra {}% til {}%",
        sumEndret: "Sum for {} har blitt endret for rolle med ident - {} fra {} til {}",
        nyeOpplysningerMåBekreftes: "Nye opplysninger må bekreftes",
        underArbeit:
            "Denne siden er under arbeid og er ikke klar for testing. Du vil få beskjed når du kan begynne å teste denne siden.",
    },
    error: {
        datoIkkeGyldig: "Dato er ikke gyldig",
        datoMåFyllesUt: "Dato må fylles ut",
        barnetilleggType: "Barnetillegg type må settes",
        datoMåSettesManuelt: "Dato må settes manuelt",
        datoMåVæreDenSisteIMåneden: "Dato må være den siste i måneden",
        datoMåVæreDenFørsteIMåneden: "Dato må være den første i måneden",
        framoverPeriodisering: "Det kan ikke periodiseres fremover i tid.",
        periodeFørVirkningstidspunkt: "Det kan ikke periodisere før virkningstidspunkt.",
        ukjentfeil: "Det skjedde en ukjent feil",
        kunneIkkFatteVedtak: "Kunne ikke fatte vedtak",
        beregning: "Det skjedde en feil ved beregning. Prøv å laste siden på nytt",
        fatteVedtak: "Det skjedde en feil ved fatting av vedtak. Vennligst prøv på nytt.",
        feilmelding: "Det har skjedd en feil",
        hentingAvNotat: "Det skjedde en feil ved henting av notat",
        hullIPerioder: "Det er perioder uten status.",
        hullIPerioderInntekt: "Det er perioder uten inntekt",
        hullIPerioderFiks: "Korriger eller legg til inntekt i periodene.",
        identMåFyllesUt: "Ident må fylles ut",
        ingenLoependeInntektPeriode:
            "Det er ingen løpende inntektsperiode. Rediger en av periodene eller legg til en ny periode.",
        ingenLoependePeriode: "Det er ingen løpende status i beregningen.",
        ugyldigStatus: "En eller flere perioder har ugyldig status Ukjent",
        boforholdManglerPerioder: "Mangler perioder. Du må minst legge til en gyldig periode",
        manglerPerioder: "Ingen inntekstperiode er valgt. Du må velge eller legge til minst en løpende periode.",
        inntektType: "Inntekt type må settes",
        navnMåFyllesUt: "Navn må fylles ut",
        kravbeløpMinVerdi: "Kravbeløp kan ikke være 0 eller mindre",
        kunneIkkeBeregneSivilstandPerioder: "Kunne ikke beregne sivilstand tidslinje basert på virkningstidspunkt.",
        personFinnesIkke: "Finner ikke person med ident: {}",
        statusMåFyllesUt: "Status må fylles ut",
        utgiftstypeMåFyllesUt: "Utgiftstype må fylles ut",
        godkjentBeløpKanIkkeVæreHøyereEnnKravbeløp: "Godkjent beløp kan ikke være høyere enn kravbeløp",
        begrunnelseMåFyllesUt: "Begrunnelse må fylles ut hvis godkjent beløp er ulik kravbeløp",
        tomDatoKanIkkeVæreFørFomDato: "Tom dato kan ikke være før fom dato",
        ugyldigBoststatusFør18: "Ugyldig boststatus for periode før barnet har fylt 18 år.",
        ugyldigBoststatusEtter18: "Ugyldig bosstatus for periode etter barnet har fylt 18 år.",
    },
    label: {
        addUtgifter: "+ Legg til ny utgift",
        angreSisteSteg: "Angre siste steg",
        antallBarn: "Antall barn i husstand",
        arbeidsgiver: "Arbeidsgiver",
        avslag: "Avslag",
        avslagsGrunn: "Avslagsgrunn",
        opphør: "Opphør",
        avbryt: "Avbryt",
        barn: "Barn",
        måned: "Måned",
        nytt: "Nytt",
        barnetillegg: "Barnetillegg",
        kommentar: "Kommentar",
        begrunnelse: "Begrunnelse",
        begrunnelseUtgiftErForeldet: "Utgiften er foreldet",
        begrunnelseKunINotat: "Begrunnelse (kun med i notat)",
        begrunnelseMedIVedtaket: "Begrunnelse (med i vedtaket og notat)",
        beløp: "Beløp",
        beløpMnd: "Beløp (mnd)",
        beløp12Mnd: "Beløp (12 mnd)",
        beskrivelse: "Beskrivelse",
        betaltAvBp: "Betalt av BP",
        direkteBetalt: "Direkte betalt",
        direkteBetaltAvBP: "Direkte betalt av BP",
        fastlønn: "Fastlønn",
        fatteVedtakButton: "Fatte vedtak",
        forfallsdato: "Forfallsdato",
        forskudd: "Forskudd",
        fraDato: "Fra dato",
        fraOgMed: "Fra og med",
        fødselsdato: "Fødselsdato",
        fødselsnummerDnummer: "Fødselsnummer/d-nummer",
        godkjentBeløp: "Godkjent beløp",
        godkjentBeløpSkalSkjønsjusteres: "Godkjent beløp skal skjønnsjusteres",
        gåVidere: "Gå videre",
        gåVidereUtenÅLagre: "Gå videre uten å lagre",
        historiskInntekt: "Vis historisk inntekt (3 år)",
        lagrePåNytt: "Lagre på nytt",
        inntekt: "Inntekt",
        jaSlett: "Ja, slett",
        kategori: "Kategori",
        kategoriGjelder: "Gjelder",
        kilde: "Kilde",
        klageMottattdato: "Klage mottatt dato",
        kontantstøtte: "Kontantstøtte",
        kravbeløp: "Kravbeløp",
        leggTilPeriode: "+ Legg til periode",
        lukk: "Lukk",
        lønnsendring: "Lønnsendring",
        lønnsinntektMedTrygdeavgiftspliktOgMedTrekkplikt: "Lønnsinntekt med trygdeavgiftsplikt og med trekkplikt: {}",
        maksGodkjentBeløp: "Maks godkjent beløp",
        mottattdato: "Mottatt dato",
        navn: "Navn",
        notatButton: "Vis notat",
        nåværendeArbeidsforhold: "Nåværende arbeidsforhold",
        oppdater: "Oppdater",
        periode: "Periode",
        resultat: "Resultat",
        sivilstand: "Sivilstand",
        sivilstandBM: "Sivilstand til BM",
        skattepliktigeInntekter: "Skattepliktige inntekter",
        småbarnstillegg: "Småbarnstillegg",
        stilling: "Stilling",
        sum: "Sum",
        status: "Status",
        søknadstype: "Søknadstype",
        søknadfra: "Søknad fra",
        søktfradato: "Søkt fra dato",
        taMed: "Ta med",
        tilbakeTilUtfylling: "Tilbake til utfylling",
        forkastEndringer: "Forkast endringer",
        tilOgMed: "Til og med",
        totalt: "Totalt",
        type: "Type",
        utvidetBarnetrygd: "Utvidet barnetrygd",
        utgift: "Utgift",
        utgiftskategori: "Utgiftskategori",
        virkningstidspunkt: "Virkningstidspunkt",
        årsak: "Årsak",
        opplysninger: "Opplysninger",
    },
    loading: "venter...",
    refresh: "Last på nytt",
    select: {
        avslagPlaceholder: "Velg avslag",
        barnPlaceholder: "Velg barn",
        inntektPlaceholder: "Velg type inntekt",
        typePlaceholder: "Velg type",
        årsakAvslagPlaceholder: "Velg årsak/avslag",
    },
    skjermbildeNavn: {
        forskudd: "Søknad om forskudd",
        særbidrag: "Søknad om særbidrag",
        bidrag: "Søknad om barnebidrag",
    },
    title: {
        andreVoksneIHusstanden: "Andre voksne i husstanden",
        arbeidsforhold: "Arbeidsforhold",
        barn: "Barn",
        barnetillegg: "Barnetillegg",
        barnOver18: "Barn over 18 år",
        begrunnelse: "Begrunnelse",
        beregnetTotalt: "Beregnet totalt",
        betaltAvBp: "Betalt av BP",
        boforhold: "Boforhold",
        boforholdBM: "Boforhold (BM)",
        boforholdBp: "Boforhold (BP)",
        copyButton: "Kopier {}",
        detaljer: "Detaljer",
        direkteBetaltAvBp: "Direkte betalt av BP",
        inntekt: "Inntekt",
        kontantstøtte: "Kontantstøtte",
        sivilstand: "Sivilstand",
        sjekkNotatOgOpplysninger: "Sjekk notatet og bekreft at opplysningene stemmer",
        skattepliktigeogPensjonsgivendeInntekt: "Skattepliktige og pensjonsgivende inntekter",
        småbarnstillegg: "Småbarnstillegg",
        opplysningerFraFolkeregistret: "Opplysninger fra offentlige registre",
        oppsummering: "Oppsummering",
        oversiktOverUtgifter: "Oversikt over utgifter",
        underholdskostnad: "Underholdskostnad",
        samvær: "Samvær",
        utvidetBarnetrygd: "Utvidet barnetrygd",
        utgift: "Utgift",
        vedtak: "Vedtak",
        virkningstidspunkt: "Virkningstidspunkt",
        vedtakFattet: "Vedtak er fattet",
    },
    varsel: {
        beregneFeil: "For å fatte vedtak må du rette opp feil i følgende steder:",
        vedtakFattet: "Notat og forsendelse er opprettet og er tilgjengelig i journalen. Åpner sakshistorikken.",
        ukjentNavn: "UKJENT",
        bekreftFatteVedtak: "Jeg har sjekket notat og opplysninger i søknaden og bekrefter at opplysningene stemmer.",
        vedtakNotat:
            "Så snart vedtaket er fattet, kan den gjenfinnes i sakshistorikk. Notatet blir generert automatisk basert på opplysningene oppgitt.",
        ønskerDuÅSlette: "Ønsker du å slette?",
        ønskerDuÅSletteBarnet: "Ønsker du å slette barnet som er lagt til i beregningen?",
        ønskerDuÅGåVidere: "Feil ved utfylling",
        statusIkkeLagret: "Statusen er ikke lagret",
        statusIkkeLagretDescription: "Hvis ikke statusen lagres vil ikke endringene tas med i beregningen",
        lagringFeilet: "Noe gikk galt og endringene ble ikke lagret",
        endringerIkkeLagret: "Noe gikk galt og endringene ble ikke lagret",
        ønskerDuÅGåVidereDescription:
            "Et eller flere feltene mangler verdi. Vedtak kan ikke bli fattet før feilen rettes opp.",
    },
    barnetHarFylt18SjekkBostatus: "Barnet har fylt 18 år i løpet av perioden. Sjekk om bostatus til barnet er riktig.",
    resetTilOpplysninger: "Reset til opplysninger fra offentlig register",
    feilVedInnhentingAvOffentligData: "Innhenting av data fra offentlig registre feiler",
    år: "år",
};
export const mapOpplysningtypeSomMåBekreftesTilFeilmelding = (
    opplysningstype: MaBekrefteNyeOpplysninger,
    behandlingType: TypeBehandling
) => {
    const forRolle =
        behandlingType !== TypeBehandling.FORSKUDD ? ` (${rolletypeTilVisningsnavn(opplysningstype.rolle)})` : "";
    switch (opplysningstype.type) {
        case OpplysningerType.KONTANTSTOTTE:
            return `Inntekter: ${
                tekster.alert.nyeOpplysningerMåBekreftes
            } for ${tekster.title.kontantstøtte.toLowerCase()}${forRolle}`;
        case OpplysningerType.SMABARNSTILLEGG:
            return `Inntekter: ${
                tekster.alert.nyeOpplysningerMåBekreftes
            } for ${tekster.title.småbarnstillegg.toLowerCase()}${forRolle}`;
        case OpplysningerType.UTVIDET_BARNETRYGD:
            return `Inntekter: ${
                tekster.alert.nyeOpplysningerMåBekreftes
            } for ${tekster.title.utvidetBarnetrygd.toLowerCase()}${forRolle}`;
        case OpplysningerType.BARNETILLEGG:
            return `Inntekter: ${
                tekster.alert.nyeOpplysningerMåBekreftes
            } for ${tekster.title.barnetillegg.toLowerCase()}${forRolle}`;
        case OpplysningerType.BARNETILSYN:
            return `Inntekter: ${tekster.alert.nyeOpplysningerMåBekreftes} for barnetilsyn ${forRolle}`;
        case OpplysningerType.SKATTEPLIKTIGE_INNTEKTER:
            return `Inntekter: ${
                tekster.alert.nyeOpplysningerMåBekreftes
            } for ${tekster.title.skattepliktigeogPensjonsgivendeInntekt.toLowerCase()}${forRolle}`;
        case OpplysningerType.BOFORHOLD:
            return opplysningstype.gjelderBarn
                ? `Boforhold: ${tekster.alert.nyeOpplysningerMåBekreftes} for barn ${opplysningstype.gjelderBarn?.navn}`
                : `Boforhold: ${tekster.alert.nyeOpplysningerMåBekreftes}`;
        case OpplysningerType.BOFORHOLD_ANDRE_VOKSNE_I_HUSSTANDEN:
            return `Andre voksne i husstanden: ${tekster.alert.nyeOpplysningerMåBekreftes}`;
        case OpplysningerType.SIVILSTAND:
            return `Sivilstand: ${tekster.alert.nyeOpplysningerMåBekreftes}`;
        default:
            return tekster.alert.nyeOpplysningerMåBekreftes;
    }
};
export const rolletypeTilVisningsnavn = (rolle?: RolleDto): string => {
    if (!rolle) return "";
    switch (rolle.rolletype) {
        case Rolletype.BM:
            return "Bidragsmottaker";
        case Rolletype.BA:
            return "Barn";
        case Rolletype.BP:
            return "Bidragspliktig";
        default:
            return rolle.rolletype;
    }
};
export default tekster;
