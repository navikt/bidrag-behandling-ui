/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export enum NotatMalType {
  FORSKUDD = "FORSKUDD",
  SAeRBIDRAG = "SÆRBIDRAG",
  BIDRAG = "BIDRAG",
}

export enum Beslutningstype {
  AVVIST = "AVVIST",
  STADFESTELSE = "STADFESTELSE",
  ENDRING = "ENDRING",
  DELVEDTAK = "DELVEDTAK",
}

export enum BehandlingsrefKilde {
  BEHANDLING_ID = "BEHANDLING_ID",
  BISYSSOKNAD = "BISYS_SØKNAD",
  BISYSKLAGEREFSOKNAD = "BISYS_KLAGE_REF_SØKNAD",
  ALDERSJUSTERING_BIDRAG = "ALDERSJUSTERING_BIDRAG",
  ALDERSJUSTERING_FORSKUDD = "ALDERSJUSTERING_FORSKUDD",
}

export enum Valutakode {
  ALL = "ALL",
  ANG = "ANG",
  AUD = "AUD",
  BAM = "BAM",
  BGN = "BGN",
  BRL = "BRL",
  CAD = "CAD",
  CHF = "CHF",
  CNY = "CNY",
  CZK = "CZK",
  DKK = "DKK",
  EEK = "EEK",
  EUR = "EUR",
  GBP = "GBP",
  HKD = "HKD",
  HRK = "HRK",
  HUF = "HUF",
  INR = "INR",
  ISK = "ISK",
  JPY = "JPY",
  LTL = "LTL",
  LVL = "LVL",
  MAD = "MAD",
  NOK = "NOK",
  NZD = "NZD",
  PKR = "PKR",
  PLN = "PLN",
  RON = "RON",
  RSD = "RSD",
  SEK = "SEK",
  THB = "THB",
  TND = "TND",
  TRY = "TRY",
  UAH = "UAH",
  USD = "USD",
  VND = "VND",
  ZAR = "ZAR",
  PHP = "PHP",
}

export enum Utgiftstype {
  KONFIRMASJONSAVGIFT = "KONFIRMASJONSAVGIFT",
  KONFIRMASJONSLEIR = "KONFIRMASJONSLEIR",
  SELSKAP = "SELSKAP",
  KLAeR = "KLÆR",
  REISEUTGIFT = "REISEUTGIFT",
  TANNREGULERING = "TANNREGULERING",
  OPTIKK = "OPTIKK",
  ANNET = "ANNET",
}

export enum TypeBehandling {
  FORSKUDD = "FORSKUDD",
  SAeRBIDRAG = "SÆRBIDRAG",
  BIDRAG = "BIDRAG",
  BIDRAG18AR = "BIDRAG_18_ÅR",
}

export enum Saerbidragskategori {
  KONFIRMASJON = "KONFIRMASJON",
  TANNREGULERING = "TANNREGULERING",
  OPTIKK = "OPTIKK",
  ANNET = "ANNET",
}

export enum SivilstandskodePDL {
  GIFT = "GIFT",
  UGIFT = "UGIFT",
  UOPPGITT = "UOPPGITT",
  ENKE_ELLER_ENKEMANN = "ENKE_ELLER_ENKEMANN",
  SKILT = "SKILT",
  SEPARERT = "SEPARERT",
  REGISTRERT_PARTNER = "REGISTRERT_PARTNER",
  SEPARERT_PARTNER = "SEPARERT_PARTNER",
  SKILT_PARTNER = "SKILT_PARTNER",
  GJENLEVENDE_PARTNER = "GJENLEVENDE_PARTNER",
}

export enum GrunnlagInntektEndringstype {
  ENDRING = "ENDRING",
  INGEN_ENDRING = "INGEN_ENDRING",
  SLETTET = "SLETTET",
  NY = "NY",
}

export enum TypeArsakstype {
  FRABARNETSFODSEL = "FRA_BARNETS_FØDSEL",
  FRA_SAMLIVSBRUDD = "FRA_SAMLIVSBRUDD",
  FRABARNETSFLYTTEMANED = "FRA_BARNETS_FLYTTEMÅNED",
  FRAMANEDENETTERFYLTE18AR = "FRA_MÅNEDEN_ETTER_FYLTE_18_ÅR",
  FRA_KRAVFREMSETTELSE = "FRA_KRAVFREMSETTELSE",
  TREMANEDERTILBAKE = "TRE_MÅNEDER_TILBAKE",
  FRASOKNADSTIDSPUNKT = "FRA_SØKNADSTIDSPUNKT",
  TREARSREGELEN = "TRE_ÅRS_REGELEN",
  FRA_OPPHOLDSTILLATELSE = "FRA_OPPHOLDSTILLATELSE",
  AUTOMATISK_JUSTERING = "AUTOMATISK_JUSTERING",
  FRASAMMEMANEDSOMINNTEKTENBLEREDUSERT = "FRA_SAMME_MÅNED_SOM_INNTEKTEN_BLE_REDUSERT",
  FRAMANEDETTERENDRETSOKNAD = "FRA_MÅNED_ETTER_ENDRET_SØKNAD",
  FORHOYELSETILBAKEITID = "FORHØYELSE_TILBAKE_I_TID",
  FRAMANEDETTERINNTEKTENOKTE = "FRA_MÅNED_ETTER_INNTEKTEN_ØKTE",
  SOKNADSTIDSPUNKTENDRING = "SØKNADSTIDSPUNKT_ENDRING",
  NEDSETTELSE_TILBAKE_I_TID = "NEDSETTELSE_TILBAKE_I_TID",
  ENDRING3MANEDERTILBAKE = "ENDRING_3_MÅNEDER_TILBAKE",
  AVSLAGFORHOYELSETILBAKE = "AVSLAG_FORHØYELSE_TILBAKE",
  ENDRING3ARSREGELEN = "ENDRING_3_ÅRS_REGELEN",
  AVSLAG_NEDSETTELSE_TILBAKE = "AVSLAG_NEDSETTELSE_TILBAKE",
  TIDLIGERE_FEILAKTIG_AVSLAG = "TIDLIGERE_FEILAKTIG_AVSLAG",
  REVURDERINGMANEDENETTER = "REVURDERING_MÅNEDEN_ETTER",
  ANNET = "ANNET",
  OMREGNING = "OMREGNING",
  PRIVAT_AVTALE = "PRIVAT_AVTALE",
  FRAMANEDENETTERIPAVENTEAVBIDRAGSSAK = "FRA_MÅNEDEN_ETTER_I_PÅVENTE_AV_BIDRAGSSAK",
  FRAMANEDENETTERPRIVATAVTALE = "FRA_MÅNEDEN_ETTER_PRIVAT_AVTALE",
  FRA_ENDRINGSTIDSPUNKT = "FRA_ENDRINGSTIDSPUNKT",
  BIDRAGSPLIKTIGHARIKKEBIDRATTTILFORSORGELSE = "BIDRAGSPLIKTIG_HAR_IKKE_BIDRATT_TIL_FORSØRGELSE",
  MANEDETTERBETALTFORFALTBIDRAG = "MÅNED_ETTER_BETALT_FORFALT_BIDRAG",
}

export enum Vedtakstype {
  INDEKSREGULERING = "INDEKSREGULERING",
  ALDERSJUSTERING = "ALDERSJUSTERING",
  OPPHOR = "OPPHØR",
  ALDERSOPPHOR = "ALDERSOPPHØR",
  REVURDERING = "REVURDERING",
  FASTSETTELSE = "FASTSETTELSE",
  INNKREVING = "INNKREVING",
  KLAGE = "KLAGE",
  ENDRING = "ENDRING",
  ENDRING_MOTTAKER = "ENDRING_MOTTAKER",
}

export enum SoktAvType {
  BIDRAGSMOTTAKER = "BIDRAGSMOTTAKER",
  BIDRAGSPLIKTIG = "BIDRAGSPLIKTIG",
  BARN18AR = "BARN_18_ÅR",
  BM_I_ANNEN_SAK = "BM_I_ANNEN_SAK",
  NAV_BIDRAG = "NAV_BIDRAG",
  FYLKESNEMDA = "FYLKESNEMDA",
  NAV_INTERNASJONALT = "NAV_INTERNASJONALT",
  KOMMUNE = "KOMMUNE",
  NORSKE_MYNDIGHET = "NORSKE_MYNDIGHET",
  UTENLANDSKE_MYNDIGHET = "UTENLANDSKE_MYNDIGHET",
  VERGE = "VERGE",
  TRYGDEETATEN_INNKREVING = "TRYGDEETATEN_INNKREVING",
  KLAGE_ANKE = "KLAGE_ANKE",
  KONVERTERING = "KONVERTERING",
}

export enum Stonadstype {
  BIDRAG = "BIDRAG",
  FORSKUDD = "FORSKUDD",
  BIDRAG18AAR = "BIDRAG18AAR",
  EKTEFELLEBIDRAG = "EKTEFELLEBIDRAG",
  MOTREGNING = "MOTREGNING",
  OPPFOSTRINGSBIDRAG = "OPPFOSTRINGSBIDRAG",
}

export enum Sivilstandskode {
  GIFT_SAMBOER = "GIFT_SAMBOER",
  BOR_ALENE_MED_BARN = "BOR_ALENE_MED_BARN",
  ENSLIG = "ENSLIG",
  SAMBOER = "SAMBOER",
  UKJENT = "UKJENT",
}

export enum Samvaersklasse {
  SAMVAeRSKLASSE0 = "SAMVÆRSKLASSE_0",
  SAMVAeRSKLASSE1 = "SAMVÆRSKLASSE_1",
  SAMVAeRSKLASSE2 = "SAMVÆRSKLASSE_2",
  SAMVAeRSKLASSE3 = "SAMVÆRSKLASSE_3",
  SAMVAeRSKLASSE4 = "SAMVÆRSKLASSE_4",
  DELT_BOSTED = "DELT_BOSTED",
}

export enum SamvaerskalkulatorNetterFrekvens {
  HVERTAR = "HVERT_ÅR",
  ANNETHVERTAR = "ANNET_HVERT_ÅR",
}

export enum SamvaerskalkulatorFerietype {
  JULNYTTAR = "JUL_NYTTÅR",
  VINTERFERIE = "VINTERFERIE",
  PASKE = "PÅSKE",
  SOMMERFERIE = "SOMMERFERIE",
  HOSTFERIE = "HØSTFERIE",
  ANNET = "ANNET",
}

export enum Rolletype {
  BA = "BA",
  BM = "BM",
  BP = "BP",
  FR = "FR",
  RM = "RM",
}

export enum Resultatkode {
  OPPHOR = "OPPHØR",
  GEBYR_FRITATT = "GEBYR_FRITATT",
  GEBYR_ILAGT = "GEBYR_ILAGT",
  BARNETERSELVFORSORGET = "BARNET_ER_SELVFORSØRGET",
  DIREKTEOPPGJOR = "DIREKTE_OPPGJØR",
  IKKE_DOKUMENTERT_SKOLEGANG = "IKKE_DOKUMENTERT_SKOLEGANG",
  AVSLUTTET_SKOLEGANG = "AVSLUTTET_SKOLEGANG",
  IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT = "IKKE_STERK_NOK_GRUNN_OG_BIDRAGET_HAR_OPPHØRT",
  IKKE_OMSORG_FOR_BARNET = "IKKE_OMSORG_FOR_BARNET",
  BARNETERDODT = "BARNET_ER_DØDT",
  BIDRAGSMOTTAKER_HAR_OMSORG_FOR_BARNET = "BIDRAGSMOTTAKER_HAR_OMSORG_FOR_BARNET",
  BIDRAGSPLIKTIGERDOD = "BIDRAGSPLIKTIG_ER_DØD",
  BEREGNET_BIDRAG = "BEREGNET_BIDRAG",
  REDUSERT_FORSKUDD_50_PROSENT = "REDUSERT_FORSKUDD_50_PROSENT",
  ORDINAeRTFORSKUDD75PROSENT = "ORDINÆRT_FORSKUDD_75_PROSENT",
  FORHOYETFORSKUDD100PROSENT = "FORHØYET_FORSKUDD_100_PROSENT",
  FORHOYETFORSKUDD11AR125PROSENT = "FORHØYET_FORSKUDD_11_ÅR_125_PROSENT",
  SAeRTILSKUDDINNVILGET = "SÆRTILSKUDD_INNVILGET",
  SAeRBIDRAGINNVILGET = "SÆRBIDRAG_INNVILGET",
  SAeRTILSKUDDIKKEFULLBIDRAGSEVNE = "SÆRTILSKUDD_IKKE_FULL_BIDRAGSEVNE",
  SAeRBIDRAGIKKEFULLBIDRAGSEVNE = "SÆRBIDRAG_IKKE_FULL_BIDRAGSEVNE",
  SAeRBIDRAGMANGLERBIDRAGSEVNE = "SÆRBIDRAG_MANGLER_BIDRAGSEVNE",
  AVSLAG = "AVSLAG",
  AVSLAG2 = "AVSLAG2",
  PARTENBEROMOPPHOR = "PARTEN_BER_OM_OPPHØR",
  AVSLAGOVER18AR = "AVSLAG_OVER_18_ÅR",
  AVSLAGIKKEREGISTRERTPAADRESSE = "AVSLAG_IKKE_REGISTRERT_PÅ_ADRESSE",
  AVSLAGHOYINNTEKT = "AVSLAG_HØY_INNTEKT",
  PAGRUNNAVBARNEPENSJON = "PÅ_GRUNN_AV_BARNEPENSJON",
  IKKE_OMSORG = "IKKE_OMSORG",
  BARNETS_EKTESKAP = "BARNETS_EKTESKAP",
  BARNETS_INNTEKT = "BARNETS_INNTEKT",
  PAGRUNNAVYTELSEFRAFOLKETRYGDEN = "PÅ_GRUNN_AV_YTELSE_FRA_FOLKETRYGDEN",
  FULLT_UNDERHOLDT_AV_OFFENTLIG = "FULLT_UNDERHOLDT_AV_OFFENTLIG",
  IKKE_OPPHOLD_I_RIKET = "IKKE_OPPHOLD_I_RIKET",
  MANGLENDE_DOKUMENTASJON = "MANGLENDE_DOKUMENTASJON",
  PAGRUNNAVSAMMENFLYTTING = "PÅ_GRUNN_AV_SAMMENFLYTTING",
  OPPHOLD_I_UTLANDET = "OPPHOLD_I_UTLANDET",
  UTENLANDSK_YTELSE = "UTENLANDSK_YTELSE",
  AVSLAG_PRIVAT_AVTALE_BIDRAG = "AVSLAG_PRIVAT_AVTALE_BIDRAG",
  IKKESOKTOMINNKREVINGAVBIDRAG = "IKKE_SØKT_OM_INNKREVING_AV_BIDRAG",
  IKKE_INNKREVING_AV_BIDRAG = "IKKE_INNKREVING_AV_BIDRAG",
  UTGIFTER_DEKKES_AV_BARNEBIDRAGET = "UTGIFTER_DEKKES_AV_BARNEBIDRAGET",
  IKKENODVENDIGEUTGIFTER = "IKKE_NØDVENDIGE_UTGIFTER",
  PRIVAT_AVTALE = "PRIVAT_AVTALE",
  AVSLAGPRIVATAVTALEOMSAeRBIDRAG = "AVSLAG_PRIVAT_AVTALE_OM_SÆRBIDRAG",
  ALLE_UTGIFTER_ER_FORELDET = "ALLE_UTGIFTER_ER_FORELDET",
  GODKJENTBELOPERLAVEREENNFORSKUDDSSATS = "GODKJENT_BELØP_ER_LAVERE_ENN_FORSKUDDSSATS",
  INGEN_ENDRING_UNDER_GRENSE = "INGEN_ENDRING_UNDER_GRENSE",
  INNVILGET_VEDTAK = "INNVILGET_VEDTAK",
  SKJONNUTLANDET = "SKJØNN_UTLANDET",
  LAVERE_ENN_INNTEKTSEVNE_BEGGE_PARTER = "LAVERE_ENN_INNTEKTSEVNE_BEGGE_PARTER",
  LAVERE_ENN_INNTEKTSEVNE_BIDRAGSPLIKTIG = "LAVERE_ENN_INNTEKTSEVNE_BIDRAGSPLIKTIG",
  LAVERE_ENN_INNTEKTSEVNE_BIDRAGSMOTTAKER = "LAVERE_ENN_INNTEKTSEVNE_BIDRAGSMOTTAKER",
  MANGLER_DOKUMENTASJON_AV_INNTEKT_BEGGE_PARTER = "MANGLER_DOKUMENTASJON_AV_INNTEKT_BEGGE_PARTER",
  MANGLER_DOKUMENTASJON_AV_INNTEKT_BIDRAGSPLIKTIG = "MANGLER_DOKUMENTASJON_AV_INNTEKT_BIDRAGSPLIKTIG",
  MANGLER_DOKUMENTASJON_AV_INNTEKT_BIDRAGSMOTTAKER = "MANGLER_DOKUMENTASJON_AV_INNTEKT_BIDRAGSMOTTAKER",
  INNTIL1ARTILBAKE = "INNTIL_1_ÅR_TILBAKE",
  MAKS_25_PROSENT_AV_INNTEKT = "MAKS_25_PROSENT_AV_INNTEKT",
  MANGLER_BIDRAGSEVNE = "MANGLER_BIDRAGSEVNE",
  KOSTNADSBEREGNET_BIDRAG = "KOSTNADSBEREGNET_BIDRAG",
  INNKREVINGSGRUNNLAG = "INNKREVINGSGRUNNLAG",
  INDEKSREGULERING = "INDEKSREGULERING",
}

export enum PrivatAvtaleType {
  PRIVAT_AVTALE = "PRIVAT_AVTALE",
  DOM_RETTSFORLIK = "DOM_RETTSFORLIK",
  VEDTAK_FRA_NAV = "VEDTAK_FRA_NAV",
}

export enum OpplysningerType {
  ARBEIDSFORHOLD = "ARBEIDSFORHOLD",
  BARNETILLEGG = "BARNETILLEGG",
  BARNETILSYN = "BARNETILSYN",
  ANDRE_BARN = "ANDRE_BARN",
  BOFORHOLD = "BOFORHOLD",
  BOFORHOLDBMSOKNADSBARN = "BOFORHOLD_BM_SØKNADSBARN",
  BOFORHOLD_ANDRE_VOKSNE_I_HUSSTANDEN = "BOFORHOLD_ANDRE_VOKSNE_I_HUSSTANDEN",
  KONTANTSTOTTE = "KONTANTSTØTTE",
  SIVILSTAND = "SIVILSTAND",
  UTVIDET_BARNETRYGD = "UTVIDET_BARNETRYGD",
  SMABARNSTILLEGG = "SMÅBARNSTILLEGG",
  SKATTEPLIKTIGE_INNTEKTER = "SKATTEPLIKTIGE_INNTEKTER",
  SUMMERTEMANEDSINNTEKTER = "SUMMERTE_MÅNEDSINNTEKTER",
  TILLEGGSSTONAD = "TILLEGGSSTØNAD",
  MANUELLE_VEDTAK = "MANUELLE_VEDTAK",
  BELOPSHISTORIKKBIDRAG = "BELØPSHISTORIKK_BIDRAG",
  ETTERFOLGENDEVEDTAK = "ETTERFØLGENDE_VEDTAK",
  BELOPSHISTORIKKFORSKUDD = "BELØPSHISTORIKK_FORSKUDD",
  BELOPSHISTORIKKBIDRAG18AR = "BELØPSHISTORIKK_BIDRAG_18_ÅR",
  AINNTEKT = "AINNTEKT",
  SKATTEGRUNNLAG = "SKATTEGRUNNLAG",
  BOFORHOLD_BEARBEIDET = "BOFORHOLD_BEARBEIDET",
  HUSSTANDSMEDLEMMER = "HUSSTANDSMEDLEMMER",
  INNTEKT_BEARBEIDET = "INNTEKT_BEARBEIDET",
  INNTEKTSOPPLYSNINGER = "INNTEKTSOPPLYSNINGER",
  SUMMERTEARSINNTEKTER = "SUMMERTE_ÅRSINNTEKTER",
}

export enum Kilde {
  MANUELL = "MANUELL",
  OFFENTLIG = "OFFENTLIG",
}

export enum Inntektstype {
  AAP = "AAP",
  DAGPENGER = "DAGPENGER",
  FORELDREPENGER = "FORELDREPENGER",
  INTRODUKSJONSSTONAD = "INTRODUKSJONSSTØNAD",
  KVALIFISERINGSSTONAD = "KVALIFISERINGSSTØNAD",
  OVERGANGSSTONAD = "OVERGANGSSTØNAD",
  PENSJON = "PENSJON",
  SYKEPENGER = "SYKEPENGER",
  KONTANTSTOTTE = "KONTANTSTØTTE",
  SMABARNSTILLEGG = "SMÅBARNSTILLEGG",
  UTVIDET_BARNETRYGD = "UTVIDET_BARNETRYGD",
  KAPITALINNTEKT = "KAPITALINNTEKT",
  LONNSINNTEKT = "LØNNSINNTEKT",
  NAeRINGSINNTEKT = "NÆRINGSINNTEKT",
  BARNETILSYN = "BARNETILSYN",
  BARNETILLEGG_PENSJON = "BARNETILLEGG_PENSJON",
  BARNETILLEGGUFORETRYGD = "BARNETILLEGG_UFØRETRYGD",
  BARNETILLEGG_DAGPENGER = "BARNETILLEGG_DAGPENGER",
  BARNETILLEGGKVALIFISERINGSSTONAD = "BARNETILLEGG_KVALIFISERINGSSTØNAD",
  BARNETILLEGG_AAP = "BARNETILLEGG_AAP",
  BARNETILLEGG_DNB = "BARNETILLEGG_DNB",
  BARNETILLEGG_NORDEA = "BARNETILLEGG_NORDEA",
  BARNETILLEGG_STOREBRAND = "BARNETILLEGG_STOREBRAND",
  BARNETILLEGG_KLP = "BARNETILLEGG_KLP",
  BARNETILLEGG_SPK = "BARNETILLEGG_SPK",
  BARNETILLEGG_TILTAKSPENGER = "BARNETILLEGG_TILTAKSPENGER",
  BARNETILLEGG_SUMMERT = "BARNETILLEGG_SUMMERT",
}

export enum Inntektsrapportering {
  AINNTEKT = "AINNTEKT",
  AINNTEKT_BEREGNET_3MND = "AINNTEKT_BEREGNET_3MND",
  AINNTEKT_BEREGNET_12MND = "AINNTEKT_BEREGNET_12MND",
  AINNTEKT_BEREGNET_3MND_FRA_OPPRINNELIG_VEDTAKSTIDSPUNKT = "AINNTEKT_BEREGNET_3MND_FRA_OPPRINNELIG_VEDTAKSTIDSPUNKT",
  AINNTEKT_BEREGNET_12MND_FRA_OPPRINNELIG_VEDTAKSTIDSPUNKT = "AINNTEKT_BEREGNET_12MND_FRA_OPPRINNELIG_VEDTAKSTIDSPUNKT",
  AINNTEKT_BEREGNET_3MND_FRA_OPPRINNELIG_VEDTAK = "AINNTEKT_BEREGNET_3MND_FRA_OPPRINNELIG_VEDTAK",
  AINNTEKT_BEREGNET_12MND_FRA_OPPRINNELIG_VEDTAK = "AINNTEKT_BEREGNET_12MND_FRA_OPPRINNELIG_VEDTAK",
  KAPITALINNTEKT = "KAPITALINNTEKT",
  LIGNINGSINNTEKT = "LIGNINGSINNTEKT",
  KONTANTSTOTTE = "KONTANTSTØTTE",
  SMABARNSTILLEGG = "SMÅBARNSTILLEGG",
  UTVIDET_BARNETRYGD = "UTVIDET_BARNETRYGD",
  AAP = "AAP",
  DAGPENGER = "DAGPENGER",
  FORELDREPENGER = "FORELDREPENGER",
  INTRODUKSJONSSTONAD = "INTRODUKSJONSSTØNAD",
  KVALIFISERINGSSTONAD = "KVALIFISERINGSSTØNAD",
  OVERGANGSSTONAD = "OVERGANGSSTØNAD",
  PENSJON = "PENSJON",
  SYKEPENGER = "SYKEPENGER",
  BARNETILLEGG = "BARNETILLEGG",
  BARNETILSYN = "BARNETILSYN",
  PERSONINNTEKT_EGNE_OPPLYSNINGER = "PERSONINNTEKT_EGNE_OPPLYSNINGER",
  KAPITALINNTEKT_EGNE_OPPLYSNINGER = "KAPITALINNTEKT_EGNE_OPPLYSNINGER",
  SAKSBEHANDLER_BEREGNET_INNTEKT = "SAKSBEHANDLER_BEREGNET_INNTEKT",
  LONNMANUELTBEREGNET = "LØNN_MANUELT_BEREGNET",
  NAeRINGSINNTEKTMANUELTBEREGNET = "NÆRINGSINNTEKT_MANUELT_BEREGNET",
  YTELSE_FRA_OFFENTLIG_MANUELT_BEREGNET = "YTELSE_FRA_OFFENTLIG_MANUELT_BEREGNET",
  AINNTEKT_KORRIGERT_FOR_BARNETILLEGG = "AINNTEKT_KORRIGERT_FOR_BARNETILLEGG",
  BARNETRYGD_MANUELL_VURDERING = "BARNETRYGD_MANUELL_VURDERING",
  BARNS_SYKDOM = "BARNS_SYKDOM",
  SKJONNMANGLERDOKUMENTASJON = "SKJØNN_MANGLER_DOKUMENTASJON",
  FORDELSAeRFRADRAGENSLIGFORSORGER = "FORDEL_SÆRFRADRAG_ENSLIG_FORSØRGER",
  FODSELADOPSJON = "FØDSEL_ADOPSJON",
  INNTEKTSOPPLYSNINGER_FRA_ARBEIDSGIVER = "INNTEKTSOPPLYSNINGER_FRA_ARBEIDSGIVER",
  LIGNINGSOPPLYSNINGER_MANGLER = "LIGNINGSOPPLYSNINGER_MANGLER",
  LIGNING_FRA_SKATTEETATEN = "LIGNING_FRA_SKATTEETATEN",
  LONNSOPPGAVEFRASKATTEETATEN = "LØNNSOPPGAVE_FRA_SKATTEETATEN",
  LONNSOPPGAVEFRASKATTEETATENKORRIGERTFORBARNETILLEGG = "LØNNSOPPGAVE_FRA_SKATTEETATEN_KORRIGERT_FOR_BARNETILLEGG",
  SKJONNMANGLENDEBRUKAVEVNE = "SKJØNN_MANGLENDE_BRUK_AV_EVNE",
  NETTO_KAPITALINNTEKT = "NETTO_KAPITALINNTEKT",
  PENSJON_KORRIGERT_FOR_BARNETILLEGG = "PENSJON_KORRIGERT_FOR_BARNETILLEGG",
  REHABILITERINGSPENGER = "REHABILITERINGSPENGER",
  SKATTEGRUNNLAG_KORRIGERT_FOR_BARNETILLEGG = "SKATTEGRUNNLAG_KORRIGERT_FOR_BARNETILLEGG",
}

export enum Innkrevingstype {
  MED_INNKREVING = "MED_INNKREVING",
  UTEN_INNKREVING = "UTEN_INNKREVING",
}

export enum Grunnlagstype {
  UKJENT = "UKJENT",
  INNTEKT_SKATTELEMENT = "INNTEKT_SKATTELEMENT",
  SAeRFRADRAG = "SÆRFRADRAG",
  SKATTEKLASSE = "SKATTEKLASSE",
  SAMVAeRSKLASSE = "SAMVÆRSKLASSE",
  BIDRAGSEVNE = "BIDRAGSEVNE",
  LOPENDEBIDRAG = "LØPENDE_BIDRAG",
  FAKTISK_UTGIFT_PERIODE = "FAKTISK_UTGIFT_PERIODE",
  TILLEGGSSTONADPERIODE = "TILLEGGSSTØNAD_PERIODE",
  BARNETILSYNMEDSTONADPERIODE = "BARNETILSYN_MED_STØNAD_PERIODE",
  FORPLEINING_UTGIFT = "FORPLEINING_UTGIFT",
  NETTO_BARNETILSYN = "NETTO_BARNETILSYN",
  UNDERHOLDSKOSTNAD = "UNDERHOLDSKOSTNAD",
  BPS_ANDEL_UNDERHOLDSKOSTNAD = "BPS_ANDEL_UNDERHOLDSKOSTNAD",
  TILLEGGSBIDRAG = "TILLEGGSBIDRAG",
  MAKS_BIDRAG_PER_BARN = "MAKS_BIDRAG_PER_BARN",
  MAKS_GRENSE_25_INNTEKT = "MAKS_GRENSE_25_INNTEKT",
  GEBYRFRITAK = "GEBYRFRITAK",
  INNBETALTBELOP = "INNBETALT_BELØP",
  FORHOLDSMESSIG_FORDELING = "FORHOLDSMESSIG_FORDELING",
  KLAGE_STATISTIKK = "KLAGE_STATISTIKK",
  NETTO_TILSYNSUTGIFT = "NETTO_TILSYNSUTGIFT",
  SAMVAeRSPERIODE = "SAMVÆRSPERIODE",
  SAMVAeRSKALKULATOR = "SAMVÆRSKALKULATOR",
  DELBEREGNINGSAMVAeRSKLASSE = "DELBEREGNING_SAMVÆRSKLASSE",
  DELBEREGNINGSAMVAeRSKLASSENETTER = "DELBEREGNING_SAMVÆRSKLASSE_NETTER",
  SJABLON_SJABLONTALL = "SJABLON_SJABLONTALL",
  SJABLON_BIDRAGSEVNE = "SJABLON_BIDRAGSEVNE",
  SJABLON_TRINNVIS_SKATTESATS = "SJABLON_TRINNVIS_SKATTESATS",
  SJABLON_BARNETILSYN = "SJABLON_BARNETILSYN",
  SJABLON_FORBRUKSUTGIFTER = "SJABLON_FORBRUKSUTGIFTER",
  SJABLON_SAMVARSFRADRAG = "SJABLON_SAMVARSFRADRAG",
  SJABLON_MAKS_FRADRAG = "SJABLON_MAKS_FRADRAG",
  SJABLON_MAKS_TILSYN = "SJABLON_MAKS_TILSYN",
  SJABLON_INDEKSREGULERING_FAKTOR = "SJABLON_INDEKSREGULERING_FAKTOR",
  BOSTATUS_PERIODE = "BOSTATUS_PERIODE",
  SIVILSTAND_PERIODE = "SIVILSTAND_PERIODE",
  INNTEKT_RAPPORTERING_PERIODE = "INNTEKT_RAPPORTERING_PERIODE",
  SOKNAD = "SØKNAD",
  VIRKNINGSTIDSPUNKT = "VIRKNINGSTIDSPUNKT",
  NOTAT = "NOTAT",
  PRIVAT_AVTALE_GRUNNLAG = "PRIVAT_AVTALE_GRUNNLAG",
  PRIVAT_AVTALE_PERIODE_GRUNNLAG = "PRIVAT_AVTALE_PERIODE_GRUNNLAG",
  SAeRBIDRAGKATEGORI = "SÆRBIDRAG_KATEGORI",
  UTGIFT_DIREKTE_BETALT = "UTGIFT_DIREKTE_BETALT",
  UTGIFTMAKSGODKJENTBELOP = "UTGIFT_MAKS_GODKJENT_BELØP",
  UTGIFTSPOSTER = "UTGIFTSPOSTER",
  SLUTTBEREGNING_FORSKUDD = "SLUTTBEREGNING_FORSKUDD",
  DELBEREGNING_SUM_INNTEKT = "DELBEREGNING_SUM_INNTEKT",
  DELBEREGNING_BARN_I_HUSSTAND = "DELBEREGNING_BARN_I_HUSSTAND",
  SLUTTBEREGNINGSAeRBIDRAG = "SLUTTBEREGNING_SÆRBIDRAG",
  DELBEREGNING_BIDRAGSEVNE = "DELBEREGNING_BIDRAGSEVNE",
  DELBEREGNING_BIDRAGSPLIKTIGES_BEREGNEDE_TOTALBIDRAG = "DELBEREGNING_BIDRAGSPLIKTIGES_BEREGNEDE_TOTALBIDRAG",
  DELBEREGNING_VOKSNE_I_HUSSTAND = "DELBEREGNING_VOKSNE_I_HUSSTAND",
  DELBEREGNING_FAKTISK_UTGIFT = "DELBEREGNING_FAKTISK_UTGIFT",
  DELBEREGNINGTILLEGGSSTONAD = "DELBEREGNING_TILLEGGSSTØNAD",
  DELBEREGNING_BOFORHOLD = "DELBEREGNING_BOFORHOLD",
  DELBEREGNINGBIDRAGSPLIKTIGESANDELSAeRBIDRAG = "DELBEREGNING_BIDRAGSPLIKTIGES_ANDEL_SÆRBIDRAG",
  DELBEREGNING_BIDRAGSPLIKTIGES_ANDEL = "DELBEREGNING_BIDRAGSPLIKTIGES_ANDEL",
  DELBEREGNING_UTGIFT = "DELBEREGNING_UTGIFT",
  DELBEREGNINGSAMVAeRSFRADRAG = "DELBEREGNING_SAMVÆRSFRADRAG",
  DELBEREGNING_NETTO_TILSYNSUTGIFT = "DELBEREGNING_NETTO_TILSYNSUTGIFT",
  DELBEREGNING_BARNETILLEGG_SKATTESATS = "DELBEREGNING_BARNETILLEGG_SKATTESATS",
  DELBEREGNING_NETTO_BARNETILLEGG = "DELBEREGNING_NETTO_BARNETILLEGG",
  DELBEREGNING_UNDERHOLDSKOSTNAD = "DELBEREGNING_UNDERHOLDSKOSTNAD",
  DELBEREGNING_ENDRING_SJEKK_GRENSE_PERIODE = "DELBEREGNING_ENDRING_SJEKK_GRENSE_PERIODE",
  DELBEREGNING_ENDRING_SJEKK_GRENSE = "DELBEREGNING_ENDRING_SJEKK_GRENSE",
  DELBEREGNING_PRIVAT_AVTALE_PERIODE = "DELBEREGNING_PRIVAT_AVTALE_PERIODE",
  DELBEREGNING_PRIVAT_AVTALE = "DELBEREGNING_PRIVAT_AVTALE",
  DELBEREGNING_INDEKSREGULERING_PERIODE = "DELBEREGNING_INDEKSREGULERING_PERIODE",
  SLUTTBEREGNING_BARNEBIDRAG = "SLUTTBEREGNING_BARNEBIDRAG",
  SLUTTBEREGNING_BARNEBIDRAG_ALDERSJUSTERING = "SLUTTBEREGNING_BARNEBIDRAG_ALDERSJUSTERING",
  SLUTTBEREGNING_FORHOLDSMESSIG_FORDELING = "SLUTTBEREGNING_FORHOLDSMESSIG_FORDELING",
  SLUTTBEREGNING_INDEKSREGULERING = "SLUTTBEREGNING_INDEKSREGULERING",
  BARNETILLEGG_PERIODE = "BARNETILLEGG_PERIODE",
  BELOPSHISTORIKKBIDRAG = "BELØPSHISTORIKK_BIDRAG",
  BELOPSHISTORIKKBIDRAG18AR = "BELØPSHISTORIKK_BIDRAG_18_ÅR",
  BELOPSHISTORIKKFORSKUDD = "BELØPSHISTORIKK_FORSKUDD",
  MANUELLE_VEDTAK = "MANUELLE_VEDTAK",
  MANUELT_OVERSTYRT_GEBYR = "MANUELT_OVERSTYRT_GEBYR",
  DELBEREGNING_INNTEKTSBASERT_GEBYR = "DELBEREGNING_INNTEKTSBASERT_GEBYR",
  SLUTTBEREGNING_GEBYR = "SLUTTBEREGNING_GEBYR",
  PERSON = "PERSON",
  PERSON_BIDRAGSMOTTAKER = "PERSON_BIDRAGSMOTTAKER",
  PERSON_BIDRAGSPLIKTIG = "PERSON_BIDRAGSPLIKTIG",
  PERSON_REELL_MOTTAKER = "PERSON_REELL_MOTTAKER",
  PERSONSOKNADSBARN = "PERSON_SØKNADSBARN",
  PERSON_HUSSTANDSMEDLEM = "PERSON_HUSSTANDSMEDLEM",
  PERSON_BARN_BIDRAGSPLIKTIG = "PERSON_BARN_BIDRAGSPLIKTIG",
  PERSON_BARN_BIDRAGSMOTTAKER = "PERSON_BARN_BIDRAGSMOTTAKER",
  BEREGNET_INNTEKT = "BEREGNET_INNTEKT",
  INNHENTET_HUSSTANDSMEDLEM = "INNHENTET_HUSSTANDSMEDLEM",
  INNHENTET_ANDRE_VOKSNE_I_HUSSTANDEN = "INNHENTET_ANDRE_VOKSNE_I_HUSSTANDEN",
  INNHENTET_SIVILSTAND = "INNHENTET_SIVILSTAND",
  INNHENTET_ARBEIDSFORHOLD = "INNHENTET_ARBEIDSFORHOLD",
  INNHENTETTILLEGGSSTONAD = "INNHENTET_TILLEGGSSTØNAD",
  INNHENTETTILLEGGSSTONADBEGRENSET = "INNHENTET_TILLEGGSSTØNAD_BEGRENSET",
  INNHENTET_BARNETILSYN = "INNHENTET_BARNETILSYN",
  INNHENTET_ANDRE_BARN_TIL_BIDRAGSMOTTAKER = "INNHENTET_ANDRE_BARN_TIL_BIDRAGSMOTTAKER",
  INNHENTET_INNTEKT_SKATTEGRUNNLAG_PERIODE = "INNHENTET_INNTEKT_SKATTEGRUNNLAG_PERIODE",
  INNHENTET_INNTEKT_AORDNING = "INNHENTET_INNTEKT_AORDNING",
  INNHENTET_INNTEKT_BARNETILLEGG = "INNHENTET_INNTEKT_BARNETILLEGG",
  INNHENTETINNTEKTKONTANTSTOTTE = "INNHENTET_INNTEKT_KONTANTSTØTTE",
  INNHENTET_INNTEKT_AINNTEKT = "INNHENTET_INNTEKT_AINNTEKT",
  INNHENTETINNTEKTSMABARNSTILLEGG = "INNHENTET_INNTEKT_SMÅBARNSTILLEGG",
  INNHENTET_INNTEKT_UTVIDETBARNETRYGD = "INNHENTET_INNTEKT_UTVIDETBARNETRYGD",
  UNNTAK = "UNNTAK",
  KOPI_DELBEREGNING_UNDERHOLDSKOSTNAD = "KOPI_DELBEREGNING_UNDERHOLDSKOSTNAD",
  KOPI_DELBEREGNING_BIDRAGSPLIKTIGES_ANDEL = "KOPI_DELBEREGNING_BIDRAGSPLIKTIGES_ANDEL",
  KOPIBARNETILSYNMEDSTONADPERIODE = "KOPI_BARNETILSYN_MED_STØNAD_PERIODE",
  KOPISAMVAeRSPERIODE = "KOPI_SAMVÆRSPERIODE",
  ALDERSJUSTERING_DETALJER = "ALDERSJUSTERING_DETALJER",
  RESULTAT_FRA_VEDTAK = "RESULTAT_FRA_VEDTAK",
  VEDTAK_ORKESTRERING_DETALJER = "VEDTAK_ORKESTRERING_DETALJER",
  ETTERFOLGENDEMANUELLEVEDTAK = "ETTERFØLGENDE_MANUELLE_VEDTAK",
}

export enum Engangsbeloptype {
  DIREKTE_OPPGJOR = "DIREKTE_OPPGJOR",
  DIREKTEOPPGJOR = "DIREKTE_OPPGJØR",
  ETTERGIVELSE = "ETTERGIVELSE",
  ETTERGIVELSE_TILBAKEKREVING = "ETTERGIVELSE_TILBAKEKREVING",
  GEBYR_MOTTAKER = "GEBYR_MOTTAKER",
  GEBYR_SKYLDNER = "GEBYR_SKYLDNER",
  INNKREVING_GJELD = "INNKREVING_GJELD",
  TILBAKEKREVING = "TILBAKEKREVING",
  SAERTILSKUDD = "SAERTILSKUDD",
  SAeRTILSKUDD = "SÆRTILSKUDD",
  SAeRBIDRAG = "SÆRBIDRAG",
}

export enum Bostatuskode {
  MED_FORELDER = "MED_FORELDER",
  DOKUMENTERT_SKOLEGANG = "DOKUMENTERT_SKOLEGANG",
  IKKE_MED_FORELDER = "IKKE_MED_FORELDER",
  DELT_BOSTED = "DELT_BOSTED",
  REGNES_IKKE_SOM_BARN = "REGNES_IKKE_SOM_BARN",
  BOR_MED_ANDRE_VOKSNE = "BOR_MED_ANDRE_VOKSNE",
  BOR_IKKE_MED_ANDRE_VOKSNE = "BOR_IKKE_MED_ANDRE_VOKSNE",
  UNNTAK_HOS_ANDRE = "UNNTAK_HOS_ANDRE",
  UNNTAK_ALENE = "UNNTAK_ALENE",
  UNNTAKENSLIGASYLSOKER = "UNNTAK_ENSLIG_ASYLSØKER",
  MED_VERGE = "MED_VERGE",
  ALENE = "ALENE",
}

export enum BeregnTil {
  OPPRINNELIG_VEDTAKSTIDSPUNKT = "OPPRINNELIG_VEDTAKSTIDSPUNKT",
  INNEVAeRENDEMANED = "INNEVÆRENDE_MÅNED",
  ETTERFOLGENDEMANUELLVEDTAK = "ETTERFØLGENDE_MANUELL_VEDTAK",
}

export enum Behandlingstype {
  ENDRING = "ENDRING",
  EGET_TILTAK = "EGET_TILTAK",
  SOKNAD = "SØKNAD",
  INNKREVINGSGRUNNLAG = "INNKREVINGSGRUNNLAG",
  ALDERSJUSTERING = "ALDERSJUSTERING",
  INDEKSREGULERING = "INDEKSREGULERING",
  KLAGE_BEGRENSET_SATS = "KLAGE_BEGRENSET_SATS",
  KLAGE = "KLAGE",
  FOLGERKLAGE = "FØLGER_KLAGE",
  KORRIGERING = "KORRIGERING",
  KONVERTERING = "KONVERTERING",
  OPPHOR = "OPPHØR",
  PRIVAT_AVTALE = "PRIVAT_AVTALE",
  BEGRENSET_REVURDERING = "BEGRENSET_REVURDERING",
  REVURDERING = "REVURDERING",
  OPPJUSTERT_FORSKUDD = "OPPJUSTERT_FORSKUDD",
  OMGJORING = "OMGJØRING",
  OMGJORINGBEGRENSETSATS = "OMGJØRING_BEGRENSET_SATS",
  PARAGRAF_35_C = "PARAGRAF_35_C",
  PARAGRAF_35_C_BEGRENSET_SATS = "PARAGRAF_35_C_BEGRENSET_SATS",
}

export enum Behandlingstema {
  AVSKRIVNING = "AVSKRIVNING",
  BIDRAG = "BIDRAG",
  BIDRAG_PLUSS_TILLEGGSBIDRAG = "BIDRAG_PLUSS_TILLEGGSBIDRAG",
  DIREKTEOPPGJOR = "DIREKTE_OPPGJØR",
  EKTEFELLEBIDRAG = "EKTEFELLEBIDRAG",
  ETTERGIVELSE = "ETTERGIVELSE",
  ERSTATNING = "ERSTATNING",
  FARSSKAP = "FARSSKAP",
  KUNNSKAP_OM_BIOLOGISK_FAR = "KUNNSKAP_OM_BIOLOGISK_FAR",
  FORSKUDD = "FORSKUDD",
  GEBYR = "GEBYR",
  INNKREVING = "INNKREVING",
  MORSSKAP = "MORSSKAP",
  MOTREGNING = "MOTREGNING",
  OPPFOSTRINGSBIDRAG = "OPPFOSTRINGSBIDRAG",
  REFUSJON_BIDRAG = "REFUSJON_BIDRAG",
  SAKSOMKOSTNINGER = "SAKSOMKOSTNINGER",
  SAeRBIDRAG = "SÆRBIDRAG",
  TILLEGGSBIDRAG = "TILLEGGSBIDRAG",
  TILBAKEKREVING_ETTERGIVELSE = "TILBAKEKREVING_ETTERGIVELSE",
  TILBAKEKREVING = "TILBAKEKREVING",
  BIDRAG18ARPLUSSTILLEGGSBIDRAG = "BIDRAG_18_ÅR_PLUSS_TILLEGGSBIDRAG",
  BIDRAG18AR = "BIDRAG_18_ÅR",
  REISEKOSTNADER = "REISEKOSTNADER",
}

export enum Behandlingstatus {
  DOMTAVSLUTTET = "DØMT_AVSLUTTET",
  ERKJENT_AVSLUTTET = "ERKJENT_AVSLUTTET",
  ENDELIG_VEDTAK_FATTET = "ENDELIG_VEDTAK_FATTET",
  AVVIST = "AVVIST",
  MIDLERTIDLIG_VEDTAK = "MIDLERTIDLIG_VEDTAK",
  UNNTAS_KLAGE = "UNNTAS_KLAGE",
  G4 = "G4",
  SENDT_UTLANDET_LUKKET = "SENDT_UTLANDET_LUKKET",
  ERKLAeRINGSENDTREKOMMANDERT = "ERKLÆRING_SENDT_REKOMMANDERT",
  FAR_UKJENT = "FAR_UKJENT",
  HJEMSENDT_TIL_TK = "HJEMSENDT_TIL_TK",
  INGEN_HENDELSE = "INGEN_HENDELSE",
  OVERFORTKLAGEOGANKE = "OVERFØRT_KLAGE_OG_ANKE",
  OVERFORTRTV = "OVERFØRT_RTV",
  FOLKEHELSEINSTITUTTET = "FOLKEHELSEINSTITUTTET",
  SENDT_NAV_FARSKAPSENHET = "SENDT_NAV_FARSKAPSENHET",
  STEVNING_SENDT_TINGRETTEN = "STEVNING_SENDT_TINGRETTEN",
  SENDT_UTLANDET = "SENDT_UTLANDET",
  SENDT_UTENRIKSSTASJON = "SENDT_UTENRIKSSTASJON",
  FEILREGISTRERT = "FEILREGISTRERT",
  TRUKKET = "TRUKKET",
  UNDER_BEHANDLING = "UNDER_BEHANDLING",
  VEDTAK_FATTET = "VEDTAK_FATTET",
}

/** Grunnlag */
export interface GrunnlagDto {
  /** Referanse (unikt navn på grunnlaget) */
  referanse: string;
  /** Grunnlagstype */
  type: Grunnlagstype;
  /** Grunnlagsinnhold (generisk) */
  innhold: JsonNode;
  /** Liste over grunnlagsreferanser */
  grunnlagsreferanseListe: string[];
  /** Referanse til personobjektet grunnlaget gjelder */
  gjelderReferanse?: string;
  /** Referanse til barn personobjektet grunnlaget gjelder */
  gjelderBarnReferanse?: string;
}

export interface GrunnlagFraVedtak {
  /**
   * Årstall for aldersjustering av grunnlag. Brukes hvis det er et vedtak som skal brukes for aldersjustering av grunnlag. Dette er relevant ved omgjøring/klagebehanding i bidrag ellers aldersjusteres det for inneværende år eller ikke er relevant
   * @format int32
   */
  aldersjusteringForÅr?: number;
  /** @format int32 */
  vedtak?: number;
  grunnlagFraOmgjøringsvedtak: boolean;
  /** @format date-time */
  vedtakstidspunkt?: string;
  /** Perioder i vedtaket som er valgt. Brukes når vedtakstype er innkreving og det er valgt å innkreve en vedtak fra NAV som opprinnelig var uten innkreving */
  perioder: VedtakPeriodeDto[];
}

/** Grunnlagsinnhold (generisk) */
export type JsonNode = any;

export interface LesemodusVedtak {
  erAvvist: boolean;
  opprettetAvBatch: boolean;
  erOrkestrertVedtak: boolean;
}

export interface SamvaerskalkulatorDetaljer {
  ferier: SamvaerskalkulatorFerie[];
  regelmessigSamværNetter: number;
}

export interface SamvaerskalkulatorFerie {
  type: SamvaerskalkulatorFerietype;
  bidragsmottakerNetter: number;
  bidragspliktigNetter: number;
  frekvens: SamvaerskalkulatorNetterFrekvens;
}

export interface VedtakPeriodeDto {
  /** Periode med fra-og-med-dato og til-dato med format ÅÅÅÅ-MM */
  periode: TypeArManedsperiode;
  /** Beregnet stønadsbeløp */
  beløp?: number;
  /** Valutakoden tilhørende stønadsbeløpet */
  valutakode?: string;
  /** Resultatkoden tilhørende stønadsbeløpet */
  resultatkode: string;
  /** Referanse - delytelseId/beslutningslinjeId -> bidrag-regnskap. Skal fjernes senere */
  delytelseId?: string;
  /** Liste over alle grunnlag som inngår i perioden */
  grunnlagReferanseListe: string[];
}

export type TypeArManedsperiode = UtilRequiredKeys<PeriodeLocalDate, "fom"> & {
  /**
   * @pattern YYYY-MM
   * @example "2023-01"
   */
  fom: string;
  /**
   * @pattern YYYY-MM
   * @example "2023-01"
   */
  til?: string;
};

export interface OppdatereBegrunnelse {
  /** Saksbehandlers begrunnelse */
  nyBegrunnelse: string;
  /**
   * Id til rollen begrunnelsen gjelder for
   * @format int64
   */
  rolleid?: number;
  /** Deprekert - Erstattes av nyBegrunnelse */
  kunINotat?: string;
}

export interface OppdatereVirkningstidspunkt {
  /** @format int64 */
  rolleId?: number;
  /** Oppdater årsak. Hvis verdien er satt til null så vil det ikke bli gjort noe endringer. Hvis verdien er satt så vil årsak settes til samme verdi fra forespørsel og avslag settes til null */
  årsak?: TypeArsakstype;
  /** Oppdater avslag. Hvis verdien er satt til null så vil det ikke bli gjort noe endringer. Hvis verdien er satt så vil avslag settes til samme verdi fra forespørsel og årsak settes til null */
  avslag?: Resultatkode;
  /**
   * Oppdater virkningsdato. Hvis verdien er satt til null vil det ikke bli gjort noe endringer
   * @format date
   * @example "2025-01-25"
   */
  virkningstidspunkt?: string;
  /** @format date */
  beregnTilDato?: string;
  /** Oppdatere saksbehandlers begrunnelse */
  oppdatereBegrunnelse?: OppdatereBegrunnelse;
  /** Oppdatere saksbehandlers begrunnelse for vurdering av skolegang. Dette kan bare settes hvis det er 18 års bidrag */
  oppdaterBegrunnelseVurderingAvSkolegang?: OppdatereBegrunnelse;
  /** Deprekert - Bruk oppdatereBegrunnelse i stedet */
  notat?: OppdatereBegrunnelse;
}

export interface AktiveGrunnlagsdata {
  /** @uniqueItems true */
  arbeidsforhold: ArbeidsforholdGrunnlagDto[];
  /** @uniqueItems true */
  husstandsmedlemBM: HusstandsmedlemGrunnlagDto[];
  /** @uniqueItems true */
  husstandsmedlem: HusstandsmedlemGrunnlagDto[];
  andreVoksneIHusstanden?: AndreVoksneIHusstandenGrunnlagDto;
  sivilstand?: SivilstandAktivGrunnlagDto;
  stønadTilBarnetilsyn?: StonadTilBarnetilsynAktiveGrunnlagDto;
  /**
   * Erstattes av husstandsmedlem
   * @deprecated
   * @uniqueItems true
   */
  husstandsbarn: HusstandsmedlemGrunnlagDto[];
}

export interface AndreVoksneIHusstandenDetaljerDto {
  navn: string;
  /** @format date */
  fødselsdato?: string;
  harRelasjonTilBp: boolean;
  /**
   * Relasjon til BP. Brukes for debugging
   * @deprecated
   */
  relasjon: AndreVoksneIHusstandenDetaljerDtoRelasjonEnum;
  erBeskyttet: boolean;
}

export interface AndreVoksneIHusstandenGrunnlagDto {
  /** @uniqueItems true */
  perioder: PeriodeAndreVoksneIHusstanden[];
  /** @format date-time */
  innhentet: string;
}

export interface AndreVoksneIHusstandenPeriodeseringsfeil {
  hullIPerioder: Datoperiode[];
  overlappendePerioder: OverlappendeBostatusperiode[];
  /** Er sann hvis det finnes en eller flere perioder som starter senere enn starten av dagens måned. */
  fremtidigPeriode: boolean;
  /** Er sann hvis det mangler sivilstand perioder." */
  manglerPerioder: boolean;
  /** Er sann hvis det ikke finnes noe løpende periode. Det vil si en periode hvor datoTom er null */
  ingenLøpendePeriode: boolean;
  harFeil: boolean;
}

export interface Ansettelsesdetaljer {
  /** Fradato for ansettelsesdetalj. År + måned */
  periodeFra?: string;
  /** Eventuell sluttdato for ansettelsesdetalj. År + måned */
  periodeTil?: string;
  /** Type arbeidsforhold, Ordinaer, Maritim, Forenklet, Frilanser' */
  arbeidsforholdType?: string;
  /** Beskrivelse av arbeidstidsordning. Eks: 'Ikke skift' */
  arbeidstidsordningBeskrivelse?: string;
  /** Beskrivelse av ansettelsesform. Eks: 'Fast ansettelse' */
  ansettelsesformBeskrivelse?: string;
  /** Beskrivelse av yrke. Eks: 'KONTORLEDER' */
  yrkeBeskrivelse?: string;
  /**
   * Avtalt antall timer i uken
   * @format double
   */
  antallTimerPrUke?: number;
  /**
   * Avtalt stillingsprosent
   * @format double
   */
  avtaltStillingsprosent?: number;
  /**
   * Dato for forrige endring i stillingsprosent
   * @format date
   */
  sisteStillingsprosentendringDato?: string;
  /**
   * Dato for forrige lønnsendring
   * @format date
   */
  sisteLønnsendringDato?: string;
}

export interface ArbeidsforholdGrunnlagDto {
  /** Id til personen arbeidsforholdet gjelder */
  partPersonId: string;
  /**
   * Startdato for arbeidsforholdet
   * @format date
   */
  startdato?: string;
  /**
   * Eventuell sluttdato for arbeidsforholdet
   * @format date
   */
  sluttdato?: string;
  /** Navn på arbeidsgiver */
  arbeidsgiverNavn?: string;
  /** Arbeidsgivers organisasjonsnummer */
  arbeidsgiverOrgnummer?: string;
  /** Liste av ansettelsesdetaljer, med eventuell historikk */
  ansettelsesdetaljerListe?: Ansettelsesdetaljer[];
  /** Liste over registrerte permisjoner */
  permisjonListe?: Permisjon[];
  /** Liste over registrerte permitteringer */
  permitteringListe?: Permittering[];
}

export interface BarnetilsynGrunnlagDto {
  /** Id til personen som mottar barnetilsynet */
  partPersonId: string;
  /** Id til barnet barnetilsynet er for */
  barnPersonId: string;
  /**
   * Periode fra-dato
   * @format date
   */
  periodeFra: string;
  /**
   * Periode til-dato
   * @format date
   */
  periodeTil?: string;
  /**
   * Beløpet barnetilsynet er på
   * @format int32
   */
  beløp?: number;
  /** Angir om barnetilsynet er heltid eller deltid */
  tilsynstype?: BarnetilsynGrunnlagDtoTilsynstypeEnum;
  /** Angir om barnet er over eller under skolealder */
  skolealder?: BarnetilsynGrunnlagDtoSkolealderEnum;
}

export interface BegrunnelseDto {
  innhold: string;
  gjelder?: RolleDto;
  /**
   * Bruk innhold
   * @deprecated
   */
  kunINotat: string;
}

export interface BehandlingDtoV2 {
  /** @format int64 */
  id: number;
  type: TypeBehandling;
  lesemodus?: LesemodusVedtak;
  erBisysVedtak: boolean;
  erVedtakUtenBeregning: boolean;
  /** @format int32 */
  grunnlagFraVedtaksid?: number;
  medInnkreving: boolean;
  innkrevingstype: Innkrevingstype;
  vedtakstype: Vedtakstype;
  opprinneligVedtakstype?: Vedtakstype;
  stønadstype?: Stonadstype;
  engangsbeløptype?: Engangsbeloptype;
  erVedtakFattet: boolean;
  erDelvedtakFattet: boolean;
  kanBehandlesINyLøsning: boolean;
  kanIkkeBehandlesBegrunnelse?: string;
  erKlageEllerOmgjøring: boolean;
  skalInnkrevingKunneUtsettes: boolean;
  /** @format date-time */
  opprettetTidspunkt: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  søktFomDato: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  mottattdato: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  klageMottattdato?: string;
  søktAv: SoktAvType;
  saksnummer: string;
  /** @format int64 */
  søknadsid?: number;
  /** @format int64 */
  søknadRefId?: number;
  /** @format int32 */
  vedtakRefId?: number;
  /** @format int32 */
  omgjørVedtakId?: number;
  /** @format int32 */
  opprinneligVedtakId?: number;
  /** @format int32 */
  sisteVedtakBeregnetUtNåværendeMåned?: number;
  behandlerenhet: string;
  /** @uniqueItems true */
  roller: RolleDto[];
  virkningstidspunkt: VirkningstidspunktDto;
  virkningstidspunktV2: VirkningstidspunktDtoV2[];
  inntekter: InntekterDtoV2;
  boforhold: BoforholdDtoV2;
  gebyr?: GebyrDto;
  aktiveGrunnlagsdata: AktiveGrunnlagsdata;
  ikkeAktiverteEndringerIGrunnlagsdata: IkkeAktiveGrunnlagsdata;
  /** @uniqueItems true */
  feilOppståttVedSisteGrunnlagsinnhenting?: Grunnlagsinnhentingsfeil[];
  /** Utgiftsgrunnlag for særbidrag. Vil alltid være null for forskudd og bidrag */
  utgift?: SaerbidragUtgifterDto;
  /** Samværsperioder. Vil alltid være null for forskudd og særbidrag */
  samvær?: SamvaerDto[];
  privatAvtale?: PrivatAvtaleDto[];
  /** @uniqueItems true */
  underholdskostnader: UnderholdDto[];
  vedtakstypeVisningsnavn: string;
}

export interface BeregnetInntekterDto {
  ident: string;
  rolle: Rolletype;
  inntekter: InntektPerBarn[];
}

export interface BeregnetPrivatAvtaleDto {
  gjelderBarn: PersoninfoDto;
  perioder: BeregnetPrivatAvtalePeriodeDto[];
}

export interface BeregnetPrivatAvtalePeriodeDto {
  periode: Datoperiode;
  indeksprosent: number;
  beløp: number;
}

export interface BoforholdDtoV2 {
  /** @uniqueItems true */
  husstandsmedlem: HusstandsmedlemDtoV2[];
  /** @uniqueItems true */
  andreVoksneIHusstanden: BostatusperiodeDto[];
  /** @uniqueItems true */
  sivilstand: SivilstandDto[];
  /** Saksbehandlers begrunnelse */
  begrunnelse: BegrunnelseDto;
  begrunnelseFraOpprinneligVedtak?: BegrunnelseDto;
  valideringsfeil: BoforholdValideringsfeil;
  /** Er sann hvis status på andre voksne i husstanden er 'BOR_IKKE_MED_ANDRE_VOKSNE', men det er 18 åring i husstanden som regnes som voksen i husstanden */
  egetBarnErEnesteVoksenIHusstanden?: boolean;
  beregnetBoforhold: DelberegningBoforhold[];
  /**
   * Erstattes av husstandsmedlem
   * @deprecated
   * @uniqueItems true
   */
  husstandsbarn: HusstandsmedlemDtoV2[];
  /**
   * Saksbehandlers begrunnelse
   * @deprecated
   */
  notat: BegrunnelseDto;
}

export interface BoforholdPeriodeseringsfeil {
  hullIPerioder: Datoperiode[];
  overlappendePerioder: OverlappendeBostatusperiode[];
  /** Er sann hvis husstandsmedlem har en periode som starter senere enn starten av dagens måned. */
  fremtidigPeriode: boolean;
  ugyldigSluttperiode: boolean;
  /**
   * Er sann hvis husstandsmedlem mangler perioder.
   *         Dette vil si at husstandsmedlem ikke har noen perioder i det hele tatt."
   */
  manglerPerioder: boolean;
  /** Er sann hvis husstandsmedlem ikke har noen løpende periode. Det vil si en periode hvor datoTom er null */
  ingenLøpendePeriode: boolean;
  barn: HusstandsmedlemPeriodiseringsfeilDto;
}

export interface BoforholdValideringsfeil {
  andreVoksneIHusstanden?: AndreVoksneIHusstandenPeriodeseringsfeil;
  husstandsmedlem?: BoforholdPeriodeseringsfeil[];
  sivilstand?: SivilstandPeriodeseringsfeil;
}

export interface BostatusperiodeDto {
  /** @format int64 */
  id?: number;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoFom?: string;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoTom?: string;
  bostatus: Bostatuskode;
  kilde: Kilde;
}

export interface BostatusperiodeGrunnlagDto {
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoFom?: string;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoTom?: string;
  bostatus: Bostatuskode;
}

export type Datoperiode = UtilRequiredKeys<PeriodeLocalDate, "fom">;

export interface DatoperiodeDto {
  /** @format date */
  fom: string;
  /** @format date */
  tom?: string;
}

export interface DelberegningBoforhold {
  periode: TypeArManedsperiode;
  /** @format double */
  antallBarn: number;
  borMedAndreVoksne: boolean;
}

export interface DelberegningSumInntekt {
  periode: TypeArManedsperiode;
  totalinntekt: number;
  kontantstøtte?: number;
  skattepliktigInntekt?: number;
  barnetillegg?: number;
  utvidetBarnetrygd?: number;
  småbarnstillegg?: number;
}

export interface EksisterendeOpphorsvedtakDto {
  /** @format int32 */
  vedtaksid: number;
  /** @format date */
  opphørsdato: string;
  /** @format date */
  vedtaksdato: string;
}

export interface EtterfolgendeVedtakDto {
  /** @format date-time */
  vedtaksttidspunkt: string;
  vedtakstype: Vedtakstype;
  virkningstidspunkt: string;
  sistePeriodeDatoFom: string;
  opphørsdato?: string;
  /** @format int32 */
  vedtaksid: number;
}

export interface FaktiskTilsynsutgiftDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  utgift: number;
  kostpenger?: number;
  kommentar?: string;
  total: number;
}

export interface GebyrDto {
  gebyrRoller: GebyrRolleDto[];
  valideringsfeil?: GebyrValideringsfeilDto[];
}

export interface GebyrInntektDto {
  skattepliktigInntekt: number;
  maksBarnetillegg?: number;
  totalInntekt: number;
}

export interface GebyrRolleDto {
  inntekt: GebyrInntektDto;
  beløpGebyrsats: number;
  beregnetIlagtGebyr: boolean;
  endeligIlagtGebyr: boolean;
  begrunnelse?: string;
  rolle: RolleDto;
  erManueltOverstyrt: boolean;
}

export interface GebyrValideringsfeilDto {
  gjelder: RolleDto;
  manglerBegrunnelse: boolean;
}

export interface Grunnlagsinnhentingsfeil {
  rolle: RolleDto;
  grunnlagsdatatype: OpplysningerType;
  feilmelding: string;
  periode?: Datoperiode | TypeArManedsperiode;
}

export interface HusstandsmedlemDtoV2 {
  /** @format int64 */
  id?: number;
  kilde: Kilde;
  medIBehandling: boolean;
  /** @uniqueItems true */
  perioder: BostatusperiodeDto[];
  ident?: string;
  navn?: string;
  /**
   * @format date
   * @example "2025-01-25"
   */
  fødselsdato?: string;
}

export interface HusstandsmedlemGrunnlagDto {
  /** @uniqueItems true */
  perioder: BostatusperiodeGrunnlagDto[];
  ident?: string;
  /** @format date-time */
  innhentetTidspunkt: string;
}

export interface HusstandsmedlemPeriodiseringsfeilDto {
  navn?: string;
  ident?: string;
  /** @format date */
  fødselsdato: string;
  /**
   * Teknisk id på husstandsmedlem som har periodiseringsfeil
   * @format int64
   */
  husstandsmedlemId: number;
  erSøknadsbarn: boolean;
}

export interface IkkeAktivInntektDto {
  /** @format int64 */
  originalId?: number;
  /** @format date-time */
  innhentetTidspunkt: string;
  endringstype: GrunnlagInntektEndringstype;
  rapporteringstype: Inntektsrapportering;
  beløp: number;
  periode: TypeArManedsperiode;
  ident: string;
  gjelderBarn?: string;
  /** @uniqueItems true */
  inntektsposter: InntektspostDtoV2[];
  /** @uniqueItems true */
  inntektsposterSomErEndret: InntektspostEndringDto[];
}

export interface IkkeAktiveGrunnlagsdata {
  inntekter: IkkeAktiveInntekter;
  /** @uniqueItems true */
  husstandsmedlemBM: HusstandsmedlemGrunnlagDto[];
  /** @uniqueItems true */
  husstandsmedlem: HusstandsmedlemGrunnlagDto[];
  /** @uniqueItems true */
  arbeidsforhold: ArbeidsforholdGrunnlagDto[];
  andreVoksneIHusstanden?: AndreVoksneIHusstandenGrunnlagDto;
  sivilstand?: SivilstandIkkeAktivGrunnlagDto;
  stønadTilBarnetilsyn?: StonadTilBarnetilsynIkkeAktiveGrunnlagDto;
  /**
   * Erstattes av husstandsmedlem
   * @deprecated
   * @uniqueItems true
   */
  husstandsbarn: HusstandsmedlemGrunnlagDto[];
}

export interface IkkeAktiveInntekter {
  /** @uniqueItems true */
  barnetillegg: IkkeAktivInntektDto[];
  /** @uniqueItems true */
  utvidetBarnetrygd: IkkeAktivInntektDto[];
  /** @uniqueItems true */
  kontantstøtte: IkkeAktivInntektDto[];
  /** @uniqueItems true */
  småbarnstillegg: IkkeAktivInntektDto[];
  /** @uniqueItems true */
  årsinntekter: IkkeAktivInntektDto[];
}

export interface InntektDtoV2 {
  /** @format int64 */
  id?: number;
  taMed: boolean;
  rapporteringstype: Inntektsrapportering;
  beløp: number;
  /**
   * @format date
   * @example "2024-01-01"
   */
  datoFom?: string;
  /**
   * @format date
   * @example "2024-12-31"
   */
  datoTom?: string;
  /**
   * @format date
   * @example "2024-01-01"
   */
  opprinneligFom?: string;
  /**
   * @format date
   * @example "2024-12-31"
   */
  opprinneligTom?: string;
  ident: string;
  gjelderBarn?: string;
  kilde: Kilde;
  /** @uniqueItems true */
  inntektsposter: InntektspostDtoV2[];
  /** @uniqueItems true */
  inntektstyper: Inntektstype[];
  historisk?: boolean;
  /** Avrundet månedsbeløp for barnetillegg */
  månedsbeløp?: number;
}

/** Periodisert inntekt per barn */
export interface InntektPerBarn {
  /** Referanse til barn */
  inntektGjelderBarnIdent?: string;
  /** Liste over summerte inntektsperioder */
  summertInntektListe: DelberegningSumInntekt[];
}

export interface InntektValideringsfeil {
  /** @uniqueItems true */
  overlappendePerioder: OverlappendePeriode[];
  fremtidigPeriode: boolean;
  /** Liste med perioder hvor det mangler inntekter. Vil alltid være tom liste for ytelser */
  hullIPerioder: Datoperiode[];
  /** Er sann hvis det ikke finnes noen valgte inntekter. Vil alltid være false hvis det er ytelse */
  manglerPerioder: boolean;
  /** Hvis det er inntekter som har periode som starter før virkningstidspunkt */
  perioderFørVirkningstidspunkt: boolean;
  ugyldigSluttPeriode: boolean;
  /** Personident ytelsen gjelder for. Kan være null hvis det er en ytelse som ikke gjelder for et barn. */
  gjelderBarn?: string;
  rolle?: RolleDto;
  ident?: string;
  /** Er sann hvis det ikke finnes noe løpende periode. Det vil si en periode hvor datoTom er null. Er bare relevant for årsinntekter */
  ingenLøpendePeriode: boolean;
}

export interface InntektValideringsfeilDto {
  /** @uniqueItems true */
  barnetillegg?: InntektValideringsfeil[];
  utvidetBarnetrygd?: InntektValideringsfeil;
  /** @uniqueItems true */
  kontantstøtte?: InntektValideringsfeil[];
  småbarnstillegg?: InntektValideringsfeil;
  /** @uniqueItems true */
  årsinntekter?: InntektValideringsfeil[];
}

export interface InntekterDtoV2 {
  /** @uniqueItems true */
  barnetillegg: InntektDtoV2[];
  /** @uniqueItems true */
  utvidetBarnetrygd: InntektDtoV2[];
  /** @uniqueItems true */
  kontantstøtte: InntektDtoV2[];
  /** @uniqueItems true */
  månedsinntekter: InntektDtoV2[];
  /** @uniqueItems true */
  småbarnstillegg: InntektDtoV2[];
  /** @uniqueItems true */
  årsinntekter: InntektDtoV2[];
  beregnetInntekter: BeregnetInntekterDto[];
  /**
   * Saksbehandlers begrunnelser
   * @uniqueItems true
   */
  begrunnelser: BegrunnelseDto[];
  /** @uniqueItems true */
  begrunnelserFraOpprinneligVedtak: BegrunnelseDto[];
  valideringsfeil: InntektValideringsfeilDto;
  /**
   * Saksbehandlers begrunnelse
   * @deprecated
   */
  notat: BegrunnelseDto;
}

export interface InntektspostDtoV2 {
  kode: string;
  visningsnavn: string;
  inntektstype?: Inntektstype;
  beløp?: number;
}

export interface InntektspostEndringDto {
  kode: string;
  visningsnavn: string;
  inntektstype?: Inntektstype;
  beløp?: number;
  endringstype: GrunnlagInntektEndringstype;
}

export interface MaksGodkjentBelopDto {
  taMed: boolean;
  beløp?: number;
  begrunnelse?: string;
}

export interface MaksGodkjentBelopValideringsfeil {
  manglerBeløp: boolean;
  manglerBegrunnelse: boolean;
  harFeil: boolean;
}

export interface ManuellVedtakDto {
  valgt: boolean;
  /** @format int32 */
  vedtaksid: number;
  /** @format int64 */
  barnId: number;
  /** @format date-time */
  fattetTidspunkt: string;
  /** @format date */
  virkningsDato: string;
  vedtakstype: Vedtakstype;
  resultatSistePeriode: string;
  manglerGrunnlag: boolean;
  innkrevingstype: Innkrevingstype;
  søknadstype: string;
}

export interface OpphorsdetaljerDto {
  /** @format date */
  opphørsdato?: string;
  opphørRoller: OpphorsdetaljerRolleDto[];
}

export interface OpphorsdetaljerRolleDto {
  rolle: RolleDto;
  /** @format date */
  opphørsdato?: string;
  /** Løpende opphørsvedtak detaljer. Er satt hvis det finnes en vedtak hvor bidraget er opphørt */
  eksisterendeOpphør?: EksisterendeOpphorsvedtakDto;
}

export interface OverlappendeBostatusperiode {
  periode: Datoperiode;
  /** @uniqueItems true */
  bosstatus: Bostatuskode[];
}

export interface OverlappendePeriode {
  periode: DatoperiodeDto;
  overlapperMedPerioder: DatoperiodeDto[];
}

export interface PeriodeAndreVoksneIHusstanden {
  periode: TypeArManedsperiode;
  status: Bostatuskode;
  /**
   * Total antall husstandsmedlemmer som bor hos BP for gjeldende periode
   * @format int32
   */
  totalAntallHusstandsmedlemmer: number;
  /** Detaljer om husstandsmedlemmer som bor hos BP for gjeldende periode. Antall hustandsmedlemmer er begrenset til maks 10 personer */
  husstandsmedlemmer: AndreVoksneIHusstandenDetaljerDto[];
}

export interface PeriodeLocalDate {
  /** @format date */
  til?: string;
  /** @format date */
  fom: string;
}

export interface Permisjon {
  /** @format date */
  startdato?: string;
  /** @format date */
  sluttdato?: string;
  beskrivelse?: string;
  /** @format double */
  prosent?: number;
}

export interface Permittering {
  /** @format date */
  startdato?: string;
  /** @format date */
  sluttdato?: string;
  beskrivelse?: string;
  /** @format double */
  prosent?: number;
}

export interface PersoninfoDto {
  /** @format int64 */
  id?: number;
  ident?: string;
  navn?: string;
  /** @format date */
  fødselsdato?: string;
  kilde?: Kilde;
  medIBehandlingen?: boolean;
}

export interface PrivatAvtaleDto {
  /** @format int64 */
  id: number;
  gjelderBarn: PersoninfoDto;
  perioderLøperBidrag: TypeArManedsperiode[];
  /** @format date */
  avtaleDato?: string;
  avtaleType?: PrivatAvtaleType;
  skalIndeksreguleres: boolean;
  begrunnelse?: string;
  begrunnelseFraOpprinneligVedtak?: string;
  valideringsfeil?: PrivatAvtaleValideringsfeilDto;
  perioder: PrivatAvtalePeriodeDto[];
  beregnetPrivatAvtale?: BeregnetPrivatAvtaleDto;
  manuelleVedtakUtenInnkreving?: ManuellVedtakDto[];
}

export interface PrivatAvtalePeriodeDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  beløp: number;
}

export interface PrivatAvtaleValideringsfeilDto {
  /** @format int64 */
  privatAvtaleId: number;
  /** @uniqueItems true */
  perioderOverlapperMedLøpendeBidrag: Datoperiode[];
  manglerBegrunnelse: boolean;
  manglerAvtaledato: boolean;
  manglerAvtaletype: boolean;
  måVelgeVedtakHvisAvtaletypeErVedtakFraNav: boolean;
  ingenLøpendePeriode: boolean;
  /** @uniqueItems true */
  overlappendePerioder: OverlappendePeriode[];
  harPeriodiseringsfeil: boolean;
  gjelderBarnNavn?: string;
  gjelderBarn?: string;
}

export interface RolleDto {
  /** @format int64 */
  id: number;
  rolletype: Rolletype;
  ident?: string;
  navn?: string;
  /** @format date */
  fødselsdato?: string;
  harInnvilgetTilleggsstønad?: boolean;
}

export interface SamvaerDto {
  /** @format int64 */
  id: number;
  gjelderBarn: string;
  begrunnelse?: BegrunnelseDto;
  begrunnelseFraOpprinneligVedtak?: BegrunnelseDto;
  valideringsfeil?: SamvaerValideringsfeilDto;
  perioder: SamvaersperiodeDto[];
}

export interface SamvaerValideringsfeilDto {
  /** @format int64 */
  samværId: number;
  manglerBegrunnelse: boolean;
  ingenLøpendeSamvær: boolean;
  manglerSamvær: boolean;
  ugyldigSluttperiode: boolean;
  /** @uniqueItems true */
  overlappendePerioder: OverlappendePeriode[];
  /** Liste med perioder hvor det mangler inntekter. Vil alltid være tom liste for ytelser */
  hullIPerioder: Datoperiode[];
  harPeriodiseringsfeil: boolean;
  gjelderBarnNavn?: string;
  gjelderBarn?: string;
}

export interface SamvaersperiodeDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  samværsklasse: Samvaersklasse;
  gjennomsnittligSamværPerMåned: number;
  beregning?: SamvaerskalkulatorDetaljer;
}

export interface SivilstandAktivGrunnlagDto {
  /** @uniqueItems true */
  grunnlag: SivilstandGrunnlagDto[];
  /** @format date-time */
  innhentetTidspunkt: string;
}

export interface SivilstandDto {
  /** @format int64 */
  id?: number;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoFom: string;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoTom?: string;
  sivilstand: Sivilstandskode;
  kilde: Kilde;
}

export interface SivilstandGrunnlagDto {
  /** Id til personen sivilstanden er rapportert for */
  personId?: string;
  /** Type sivilstand fra PDL */
  type?: SivilstandskodePDL;
  /**
   * Dato sivilstanden er gyldig fra
   * @format date
   */
  gyldigFom?: string;
  /** Personid som kun er satt om personen er ektefelle eller separert ektefelle */
  relatertVedSivilstand?: string;
  /**
   * Dato NAV tidligst har fått bekreftet sivilstanden
   * @format date
   */
  bekreftelsesdato?: string;
  /** Master for opplysningen om sivilstand (FREG eller PDL) */
  master?: string;
  /**
   * Tidspunktet sivilstanden er registrert
   * @format date-time
   */
  registrert?: string;
  /** Angir om sivilstanden er historisk (true) eller aktiv (false) */
  historisk?: boolean;
}

export interface SivilstandIkkeAktivGrunnlagDto {
  sivilstand: SivilstandDto[];
  /** @uniqueItems true */
  grunnlag: SivilstandGrunnlagDto[];
  /** @format date-time */
  innhentetTidspunkt: string;
}

export interface SivilstandOverlappendePeriode {
  periode: Datoperiode;
  /** @uniqueItems true */
  sivilstandskode: Sivilstandskode[];
}

export interface SivilstandPeriodeseringsfeil {
  hullIPerioder: Datoperiode[];
  overlappendePerioder: SivilstandOverlappendePeriode[];
  /** Er sann hvis det finnes en eller flere perioder som starter senere enn starten av dagens måned. */
  fremtidigPeriode: boolean;
  /** Er sann hvis det mangler sivilstand perioder." */
  manglerPerioder: boolean;
  /** Er sann hvis en eller flere perioder har status UKJENT." */
  ugyldigStatus: boolean;
  /** Er sann hvis det ikke finnes noe løpende periode. Det vil si en periode hvor datoTom er null */
  ingenLøpendePeriode: boolean;
  harFeil: boolean;
}

export interface StonadTilBarnetilsynAktiveGrunnlagDto {
  grunnlag: Record<string, BarnetilsynGrunnlagDto[]>;
  /** @format date-time */
  innhentetTidspunkt: string;
}

export interface StonadTilBarnetilsynDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  skolealder?: StonadTilBarnetilsynDtoSkolealderEnum;
  tilsynstype?: StonadTilBarnetilsynDtoTilsynstypeEnum;
  kilde: Kilde;
}

export interface StonadTilBarnetilsynIkkeAktiveGrunnlagDto {
  stønadTilBarnetilsyn: Record<string, StonadTilBarnetilsynDto[]>;
  grunnlag: Record<string, BarnetilsynGrunnlagDto[]>;
  /** @format date-time */
  innhentetTidspunkt: string;
}

export interface SaerbidragKategoriDto {
  kategori: Saerbidragskategori;
  beskrivelse?: string;
}

export interface SaerbidragUtgifterDto {
  avslag?: Resultatkode;
  kategori: SaerbidragKategoriDto;
  beregning?: UtgiftBeregningDto;
  maksGodkjentBeløp?: MaksGodkjentBelopDto;
  /** Saksbehandlers begrunnelse */
  begrunnelse: BegrunnelseDto;
  begrunnelseFraOpprinneligVedtak?: BegrunnelseDto;
  utgifter: UtgiftspostDto[];
  valideringsfeil?: UtgiftValideringsfeilDto;
  totalBeregning: TotalBeregningUtgifterDto[];
  /**
   * Saksbehandlers begrunnelse
   * @deprecated
   */
  notat: BegrunnelseDto;
}

export interface TilleggsstonadDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  dagsats: number;
  total: number;
}

export interface TilsynsutgiftBarn {
  gjelderBarn: PersoninfoDto;
  totalTilsynsutgift: number;
  beløp: number;
  kostpenger?: number;
  tilleggsstønadDagsats?: number;
  tilleggsstønad?: number;
}

export interface TotalBeregningUtgifterDto {
  betaltAvBp: boolean;
  utgiftstype: string;
  totalKravbeløp: number;
  totalGodkjentBeløp: number;
  utgiftstypeVisningsnavn: string;
}

export interface UnderholdBarnDto {
  /** @format int64 */
  id?: number;
  navn?: string;
  ident?: string;
  /** @format date */
  fødselsdato: string;
  medIBehandlingen: boolean;
  kilde?: Kilde;
}

export interface UnderholdDto {
  /** @format int64 */
  id: number;
  gjelderBarn: PersoninfoDto;
  harTilsynsordning?: boolean;
  /** @uniqueItems true */
  stønadTilBarnetilsyn: StonadTilBarnetilsynDto[];
  /** @uniqueItems true */
  faktiskTilsynsutgift: FaktiskTilsynsutgiftDto[];
  /** @uniqueItems true */
  tilleggsstønad: TilleggsstonadDto[];
  /** @uniqueItems true */
  underholdskostnad: UnderholdskostnadDto[];
  begrunnelse?: string;
  begrunnelseFraOpprinneligVedtak?: string;
  /** @uniqueItems true */
  beregnetUnderholdskostnad: UnderholdskostnadDto[];
  valideringsfeil?: UnderholdskostnadValideringsfeil;
}

export interface UnderholdskostnadDto {
  periode: DatoperiodeDto;
  forbruk: number;
  boutgifter: number;
  stønadTilBarnetilsyn: number;
  tilsynsutgifter: number;
  barnetrygd: number;
  forpleining?: number;
  total: number;
  beregningsdetaljer?: UnderholdskostnadPeriodeBeregningsdetaljer;
}

export interface UnderholdskostnadPeriodeBeregningsdetaljer {
  tilsynsutgifterBarn: TilsynsutgiftBarn[];
  sjablonMaksTilsynsutgift: number;
  sjablonMaksFradrag: number;
  /** @format int32 */
  antallBarnBMUnderTolvÅr: number;
  /** @format int32 */
  antallBarnBMBeregnet: number;
  /** @format int32 */
  antallBarnMedTilsynsutgifter: number;
  /** @format int32 */
  antallBarnBMOver12ÅrMedTilsynsutgifter: number;
  skattesatsFaktor: number;
  totalTilsynsutgift: number;
  sumTilsynsutgifter: number;
  bruttoTilsynsutgift: number;
  justertBruttoTilsynsutgift: number;
  nettoTilsynsutgift: number;
  erBegrensetAvMaksTilsyn: boolean;
  fordelingFaktor: number;
  skattefradragPerBarn: number;
  skattefradrag: number;
  skattefradragMaksFradrag: number;
  skattefradragTotalTilsynsutgift: number;
}

export interface UnderholdskostnadValideringsfeil {
  tilleggsstønad?: UnderholdskostnadValideringsfeilTabell;
  faktiskTilsynsutgift?: UnderholdskostnadValideringsfeilTabell;
  stønadTilBarnetilsyn?: UnderholdskostnadValideringsfeilTabell;
  /**
   * Tilleggsstønadsperioder som ikke overlapper fullstendig med faktiske tilsynsutgifter.
   * @uniqueItems true
   */
  tilleggsstønadsperioderUtenFaktiskTilsynsutgift: DatoperiodeDto[];
  /** Minst en periode må legges til hvis det ikke finnes noen offentlige opplysninger for stønad til barnetilsyn */
  manglerPerioderForTilsynsordning: boolean;
  /** Må ha fylt ut begrunnelse hvis minst en periode er lagt til underholdskostnad */
  manglerBegrunnelse: boolean;
  gjelderBarn: UnderholdBarnDto;
  /** @format int64 */
  id: number;
}

export interface UnderholdskostnadValideringsfeilTabell {
  /** Overlappende perioder i stønad til barnetilsyn eller tillegsstønad. */
  overlappendePerioder: OverlappendePeriode[];
  /** Perioder som starter senere enn starten av dagens måned. */
  fremtidigePerioder: DatoperiodeDto[];
  /** Er sann hvis antall perioder er 0." */
  harIngenPerioder: boolean;
  ugyldigPerioder: DatoperiodeDto[];
  /** Er sann hvis det er satt at BM har tilsynsordning for barnet men det mangler perioder for tilsynsutgifter. */
  manglerPerioderForTilsynsutgifter: boolean;
}

export interface UtgiftBeregningDto {
  /** Beløp som er direkte betalt av BP */
  beløpDirekteBetaltAvBp: number;
  /** Summen av godkjente beløp som brukes for beregningen */
  totalGodkjentBeløp: number;
  /** Summen av kravbeløp */
  totalKravbeløp: number;
  /** Summen av godkjente beløp som brukes for beregningen */
  totalGodkjentBeløpBp?: number;
  /** Summen av godkjent beløp for utgifter BP har betalt plus beløp som er direkte betalt av BP */
  totalBeløpBetaltAvBp: number;
}

export interface UtgiftValideringsfeilDto {
  maksGodkjentBeløp?: MaksGodkjentBelopValideringsfeil;
  manglerUtgifter: boolean;
  ugyldigUtgiftspost: boolean;
}

export interface UtgiftspostDto {
  /**
   * Når utgifter gjelder. Kan være feks dato på kvittering
   * @format date
   */
  dato: string;
  /** Type utgift. Kan feks være hva som ble kjøpt for kravbeløp (bugnad, klær, sko, etc) */
  type: Utgiftstype | string;
  /** Beløp som er betalt for utgiften det gjelder */
  kravbeløp: number;
  /** Beløp som er godkjent for beregningen */
  godkjentBeløp: number;
  /** Begrunnelse for hvorfor godkjent beløp avviker fra kravbeløp. Må settes hvis godkjent beløp er ulik kravbeløp */
  kommentar: string;
  /**
   * Begrunnelse for hvorfor godkjent beløp avviker fra kravbeløp. Må settes hvis godkjent beløp er ulik kravbeløp
   * @deprecated
   */
  begrunnelse: string;
  /** Om utgiften er betalt av BP */
  betaltAvBp: boolean;
  /** @format int64 */
  id: number;
  utgiftstypeVisningsnavn: string;
}

export interface VirkningstidspunktDto {
  /**
   * @format date
   * @example "01.12.2025"
   */
  virkningstidspunkt?: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  opprinneligVirkningstidspunkt?: string;
  årsak?: TypeArsakstype;
  avslag?: Resultatkode;
  /** Saksbehandlers begrunnelse */
  begrunnelse: BegrunnelseDto;
  harLøpendeBidrag: boolean;
  begrunnelseFraOpprinneligVedtak?: BegrunnelseDto;
  opphør?: OpphorsdetaljerDto;
  /**
   * Bruk begrunnelse
   * @deprecated
   */
  notat: BegrunnelseDto;
}

export interface VirkningstidspunktDtoV2 {
  rolle: RolleDto;
  /**
   * @format date
   * @example "01.12.2025"
   */
  virkningstidspunkt?: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  opprinneligVirkningstidspunkt?: string;
  /** @format date */
  opprinneligVedtakstidspunkt?: string;
  /** @format date */
  omgjortVedtakVedtakstidspunkt?: string;
  årsak?: TypeArsakstype;
  avslag?: Resultatkode;
  /** Saksbehandlers begrunnelse */
  begrunnelse: BegrunnelseDto;
  begrunnelseVurderingAvSkolegang?: BegrunnelseDto;
  begrunnelseVurderingAvSkolegangFraOpprinneligVedtak?: BegrunnelseDto;
  harLøpendeBidrag: boolean;
  harLøpendeForskudd: boolean;
  begrunnelseFraOpprinneligVedtak?: BegrunnelseDto;
  /** @format date */
  opphørsdato?: string;
  beregnTil?: BeregnTil;
  /** @format date */
  beregnTilDato?: string;
  /** @format date */
  globalOpphørsdato?: string;
  /** Løpende opphørsvedtak detaljer. Er satt hvis det finnes en vedtak hvor bidraget er opphørt */
  eksisterendeOpphør?: EksisterendeOpphorsvedtakDto;
  /**
   * Manuell vedtak valgt for beregning av aldersjustering
   * @format int32
   */
  grunnlagFraVedtak?: number;
  kanSkriveVurderingAvSkolegang: boolean;
  etterfølgendeVedtak?: EtterfolgendeVedtakDto;
  manuelleVedtak: ManuellVedtakDto[];
  valideringsfeil?: VirkningstidspunktFeilDto;
  /**
   * Bruk begrunnelse
   * @deprecated
   */
  notat: BegrunnelseDto;
}

export interface VirkningstidspunktFeilDto {
  manglerVirkningstidspunkt: boolean;
  manglerOpphørsdato: RolleDto[];
  kanIkkeSetteOpphørsdatoEtterEtterfølgendeVedtak: RolleDto[];
  manglerÅrsakEllerAvslag: boolean;
  måVelgeVedtakForBeregning: RolleDto[];
  manglerBegrunnelse: boolean;
  manglerVurderingAvSkolegang: boolean;
  virkningstidspunktKanIkkeVæreSenereEnnOpprinnelig: boolean;
}

export interface OppdatereUtgift {
  /**
   * Når utgifter gjelder. Kan være feks dato på kvittering
   * @format date
   */
  dato: string;
  /** Type utgift. Kan feks være hva som ble kjøpt for kravbeløp (bugnad, klær, sko, etc). Skal bare settes for kategori konfirmasjon */
  type?: Utgiftstype | string;
  /** Beløp som er betalt for utgiften det gjelder */
  kravbeløp: number;
  /** Beløp som er godkjent for beregningen */
  godkjentBeløp: number;
  /** Kommentar kan brukes til å legge inn nærmere informasjon om utgiften f.eks. fakturanr., butikk det er handlet i, informasjon om hvorfor man ikke har godkjent hele kravbeløpet */
  kommentar?: string;
  /** Om utgiften er betalt av BP */
  betaltAvBp: boolean;
  /** @format int64 */
  id?: number;
}

export interface OppdatereUtgiftRequest {
  /** Oppdater avslag. */
  avslag?: Resultatkode;
  beløpDirekteBetaltAvBp?: number;
  maksGodkjentBeløp?: MaksGodkjentBelopDto;
  /** Legg til eller endre en utgift. Utgift kan ikke endres eller oppdateres hvis avslag er satt */
  nyEllerEndretUtgift?: OppdatereUtgift;
  /**
   * Slette en utgift. Utgift kan ikke endres eller oppdateres hvis avslag er satt
   * @format int64
   */
  sletteUtgift?: number;
  /** Oppdatere saksbehandlers begrunnelse */
  oppdatereBegrunnelse?: OppdatereBegrunnelse;
  /** Deprekert - bruk oppdatereBegrunnelse i stedet */
  notat?: OppdatereBegrunnelse;
}

export interface OppdatereUtgiftResponse {
  /** Utgiftspost som ble oppdatert */
  oppdatertUtgiftspost?: UtgiftspostDto;
  utgiftposter: UtgiftspostDto[];
  /**
   * Saksbehandlers begrunnelse
   * @deprecated
   */
  begrunnelse?: string;
  beregning?: UtgiftBeregningDto;
  maksGodkjentBeløp?: MaksGodkjentBelopDto;
  avslag?: Resultatkode;
  valideringsfeil?: UtgiftValideringsfeilDto;
  totalBeregning: TotalBeregningUtgifterDto[];
  /**
   * Saksbehandlers begrunnelse
   * @deprecated
   */
  oppdatertNotat?: string;
}

export interface OppdatereTilleggsstonadRequest {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  dagsats: number;
}

export interface BeregnetUnderholdskostnad {
  gjelderBarn: PersoninfoDto;
  /** @uniqueItems true */
  perioder: UnderholdskostnadDto[];
}

export interface OppdatereUnderholdResponse {
  /** @uniqueItems true */
  stønadTilBarnetilsyn: StonadTilBarnetilsynDto[];
  /** @uniqueItems true */
  faktiskTilsynsutgift: FaktiskTilsynsutgiftDto[];
  /** @uniqueItems true */
  tilleggsstønad: TilleggsstonadDto[];
  /** @uniqueItems true */
  valideringsfeil?: UnderholdskostnadValideringsfeil[];
  /** @uniqueItems true */
  beregnetUnderholdskostnader: BeregnetUnderholdskostnad[];
}

export interface OppdatereFaktiskTilsynsutgiftRequest {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  utgift: number;
  kostpenger?: number;
  kommentar?: string;
}

export interface OppdatereBegrunnelseRequest {
  /**
   * Id til underhold begrunnelsen gjelder for hvis søknadsbarn. Null for andre barn.
   * @format int64
   */
  underholdsid?: number;
  begrunnelse: string;
}

export interface OppdaterSamvaerDto {
  gjelderBarn: string;
  periode?: OppdaterSamvaersperiodeDto;
  /** Oppdatere saksbehandlers begrunnelse */
  oppdatereBegrunnelse?: OppdatereBegrunnelse;
}

export interface OppdaterSamvaersperiodeDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  samværsklasse?: Samvaersklasse;
  beregning?: SamvaerskalkulatorDetaljer;
}

export interface OppdaterSamvaerResponsDto {
  /** Samvær som ble oppdatert */
  oppdatertSamvær?: SamvaerDto;
}

export interface OppdaterePrivatAvtalePeriodeDto {
  /** @format int64 */
  id?: number;
  periode: DatoperiodeDto;
  beløp: number;
}

export interface OppdaterePrivatAvtaleRequest {
  /**
   * Setter avtaledato på privat avtalen. Dersom avtaleDato er null, vil avtaledato fjernes.
   * @format date
   */
  avtaleDato?: string;
  /** Setter om privat avtale periodene skal indeksreguleres eller ikke. Dersom skalIndeksreguleres er null, vil ikke indeksregulering endres. */
  skalIndeksreguleres?: boolean;
  /** Oppdater begrunnelse */
  begrunnelse?: string;
  avtaleType?: PrivatAvtaleType;
  oppdaterPeriode?: OppdaterePrivatAvtalePeriodeDto;
  /** @format int64 */
  slettePeriodeId?: number;
}

export interface OppdaterePrivatAvtaleResponsDto {
  /** Privat avtale som ble oppdatert */
  oppdatertPrivatAvtale?: PrivatAvtaleDto;
}

export interface OppdaterOpphorsdatoRequestDto {
  /** @format int64 */
  idRolle: number;
  /** @format date */
  opphørsdato?: string;
  simulerEndring: boolean;
}

export interface OppdatereInntektRequest {
  /** Angi periodeinformasjon for inntekt */
  oppdatereInntektsperiode?: OppdaterePeriodeInntekt;
  /** Opprette eller oppdatere manuelt oppgitt inntekt */
  oppdatereManuellInntekt?: OppdatereManuellInntekt;
  /** Oppdatere begrunnelse for inntekt */
  oppdatereBegrunnelse?: OppdatereBegrunnelse;
  /** Deprekert, bruk oppdatereBegrunnelse i stedet */
  oppdatereNotat?: OppdatereBegrunnelse;
  /**
   * Angi id til inntekt som skal slettes
   * @format int64
   */
  sletteInntekt?: number;
  henteOppdatereBegrunnelse?: OppdatereBegrunnelse;
}

export interface OppdatereManuellInntekt {
  /**
   * Inntektens databaseid. Oppgis ikke ved opprettelse av inntekt.
   * @format int64
   */
  id?: number;
  /** Angir om inntekten skal inkluderes i beregning. Hvis ikke spesifisert inkluderes inntekten. */
  taMed: boolean;
  /**
   * Angir inntektens rapporteringstype.
   * @example "KONTANTSTØTTE"
   */
  type: Inntektsrapportering;
  /** Inntektens beløp i norske kroner */
  beløp: number;
  /**
   * @format date
   * @example "2024-01-01"
   */
  datoFom: string;
  /**
   * @format date
   * @example "2024-12-31"
   */
  datoTom?: string;
  /**
   * Ident til personen inntekten gjenlder for.
   * @example 12345678910
   */
  ident: string;
  /**
   * Ident til barnet en ytelse gjelder for. sBenyttes kun for ytelser som er koblet til ett spesifikt barn, f.eks kontantstøtte
   * @example 12345678910
   */
  gjelderBarn?: string;
  /** Spesifisere inntektstype for detaljpost */
  inntektstype?: Inntektstype;
}

export interface OppdaterePeriodeInntekt {
  /**
   * Id til inntekt som skal oppdateres
   * @format int64
   */
  id: number;
  /** Anig om inntekten skal inkluderes i beregning */
  taMedIBeregning: boolean;
  /** Angi periode inntekten skal dekke ved beregnings */
  angittPeriode?: Datoperiode;
}

export interface OppdatereInntektResponse {
  /**
   * Inntekt som ble oppdatert
   * @deprecated
   */
  inntekt?: InntektDtoV2;
  inntekter: InntekterDtoV2;
  gebyr?: GebyrDto;
  beregnetGebyrErEndret: boolean;
  /** Periodiserte inntekter */
  beregnetInntekter: BeregnetInntekterDto[];
  /** Oppdatert begrunnelse */
  begrunnelse?: string;
  valideringsfeil: InntektValideringsfeilDto;
  /**
   * Oppdatert begrunnelse
   * @deprecated
   */
  notat?: string;
}

export interface OppdaterGebyrDto {
  /** @format int64 */
  rolleId: number;
  /** Om gebyr skal overstyres. Settes til motsatte verdi av beregnet verdi */
  overstyrGebyr: boolean;
  begrunnelse?: string;
}

export interface OppdatereAndreVoksneIHusstanden {
  /** Oppdatere bor-med-andre-voksne-status på periode */
  oppdaterePeriode?: OppdatereAndreVoksneIHusstandenperiode;
  /**
   * Id til perioden som skal slettes
   * @format int64
   */
  slettePeriode?: number;
  /** Angi om historikken skal tilbakestilles til siste aktiverte grunnlagsdata */
  tilbakestilleHistorikk: boolean;
  /** Angi om siste endring skal angres */
  angreSisteEndring: boolean;
}

export interface OppdatereAndreVoksneIHusstandenperiode {
  /**
   * Id til bostatusperioden som skal oppdateres, oppretter ny hvis null
   * @format int64
   */
  idPeriode?: number;
  /**
   * Periode, fra-og-med til-og-med måned. Ignoreres for særbidrag
   * @format date
   * @example "2025-01"
   */
  periode: TypeArManedsperiode;
  borMedAndreVoksne: boolean;
}

/** Oppdaterer husstandsmedlem, sivilstand, eller notat */
export interface OppdatereBoforholdRequestV2 {
  oppdaterePeriodeMedAndreVoksneIHusstand?: OppdatereAndreVoksneIHusstanden;
  oppdatereHusstandsmedlem?: OppdatereHusstandsmedlem;
  oppdatereSivilstand?: OppdatereSivilstand;
  /** Oppdatere saksbehandlers begrunnelse */
  oppdatereBegrunnelse?: OppdatereBegrunnelse;
  /** Deprekert - Bruk oppdatereBegrunnelse i stedet */
  oppdatereNotat?: OppdatereBegrunnelse;
  henteOppdatereBegrunnelse?: OppdatereBegrunnelse;
}

export interface OppdatereBostatusperiode {
  /**
   * Id til husstandsbarnet perioden skal gjelde for
   * @deprecated
   * @format int64
   */
  idHusstandsbarn: number;
  /**
   * Id til husstandsmedlemmet perioden skal gjelde for
   * @format int64
   */
  idHusstandsmedlem: number;
  /**
   * Id til perioden som skal oppdateres
   * @format int64
   */
  idPeriode?: number;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoFom?: string;
  /**
   * @format date
   * @example "2025-01-25"
   */
  datoTom?: string;
  periode: TypeArManedsperiode;
  bostatus: Bostatuskode;
}

export interface OppdatereHusstandsmedlem {
  /** Informasjon om husstandsmedlem som skal opprettes */
  opprettHusstandsmedlem?: OpprettHusstandsstandsmedlem;
  oppdaterPeriode?: OppdatereBostatusperiode;
  /**
   * Id til perioden som skal slettes
   * @format int64
   */
  slettPeriode?: number;
  /**
   * Id til husstandsmedlemmet som skal slettes
   * @format int64
   */
  slettHusstandsmedlem?: number;
  /**
   * Id til husstandsmedlemmet perioden skal resettes for.
   *         |Dette vil resette til opprinnelig perioder hentet fra offentlige registre
   * @format int64
   */
  tilbakestillPerioderForHusstandsmedlem?: number;
  /**
   * Id til husstandsmedlemmet siste steg skal angres for
   * @format int64
   */
  angreSisteStegForHusstandsmedlem?: number;
}

export interface OppdatereSivilstand {
  nyEllerEndretSivilstandsperiode?: Sivilstandsperiode;
  /** @format int64 */
  sletteSivilstandsperiode?: number;
  /** Tilbakestiller til historikk fra offentlige registre */
  tilbakestilleHistorikk: boolean;
  /** Settes til true for å angre siste endring */
  angreSisteEndring: boolean;
}

export interface OpprettHusstandsstandsmedlem {
  personident?: string;
  /** @format date */
  fødselsdato: string;
  navn?: string;
}

export interface Sivilstandsperiode {
  /** @format date */
  fraOgMed: string;
  /** @format date */
  tilOgMed?: string;
  sivilstand: Sivilstandskode;
  /** @format int64 */
  id?: number;
}

export interface OppdatereBoforholdResponse {
  /**
   * Oppdaterte perioder med andre voksne i Bps husstand
   * @uniqueItems true
   */
  oppdatertePerioderMedAndreVoksne: BostatusperiodeDto[];
  /** Husstandsmedlem som ble opprettet */
  oppdatertHusstandsmedlem?: HusstandsmedlemDtoV2;
  egetBarnErEnesteVoksenIHusstanden?: boolean;
  /** @uniqueItems true */
  oppdatertSivilstandshistorikk: SivilstandDto[];
  begrunnelse?: string;
  valideringsfeil: BoforholdValideringsfeil;
  beregnetBoforhold: DelberegningBoforhold[];
  /**
   * Erstattes av oppdatertHusstandsmedlem
   * @deprecated
   */
  oppdatertHusstandsbarn?: HusstandsmedlemDtoV2;
  /**
   * Saksbehandlers notat
   * @deprecated
   */
  oppdatertNotat?: OppdatereBegrunnelse;
}

export interface OppdaterBeregnTilDatoRequestDto {
  /** @format int64 */
  idRolle: number;
  beregnTil?: BeregnTil;
}

export interface AktivereGrunnlagRequestV2 {
  /** Personident tilhørende rolle i behandling grunnlag skal aktiveres for */
  personident?: string;
  /** Grunnlagstype som skal aktiveres */
  grunnlagstype: OpplysningerType;
  /** Angi om manuelle opplysninger skal overskrives */
  overskriveManuelleOpplysninger: boolean;
  /** Ident på person grunnlag gjelder. Er relevant for blant annet Barnetillegg, Kontantstøtte og Boforhold */
  gjelderIdent?: string;
}

export interface AktivereGrunnlagResponseV2 {
  inntekter: InntekterDtoV2;
  boforhold: BoforholdDtoV2;
  aktiveGrunnlagsdata: AktiveGrunnlagsdata;
  ikkeAktiverteEndringerIGrunnlagsdata: IkkeAktiveGrunnlagsdata;
}

export interface OppdaterRollerRequest {
  roller: OpprettRolleDto[];
}

/** Rolle beskrivelse som er brukte til å opprette nye roller */
export interface OpprettRolleDto {
  rolletype: Rolletype;
  /** F.eks fødselsnummer. Påkrevd for alle rolletyper utenom for barn som ikke inngår i beregning. */
  ident?: string;
  /** Navn på rolleinnehaver hvis ident er ukjent. Gjelder kun barn som ikke inngår i beregning */
  navn?: string;
  /**
   * F.eks fødselsdato
   * @format date
   */
  fødselsdato?: string;
  innbetaltBeløp?: number;
  erSlettet: boolean;
  erUkjent: boolean;
  harGebyrsøknad: boolean;
  behandlingstatus?: Behandlingstatus;
  behandlingstema?: Behandlingstema;
}

export interface OppdaterRollerResponse {
  status: OppdaterRollerResponseStatusEnum;
}

export interface DelberegningSamvaersklasse {
  samværsklasse: Samvaersklasse;
  gjennomsnittligSamværPerMåned: number;
}

export interface OpprettBehandlingRequest {
  søknadstype?: Behandlingstype;
  behandlingstype?: Behandlingstype;
  behandlingstema?: Behandlingstema;
  vedtakstype: Vedtakstype;
  /** @format date */
  søktFomDato: string;
  /** @format date */
  mottattdato: string;
  søknadFra: SoktAvType;
  /**
   * @minLength 7
   * @maxLength 7
   */
  saksnummer: string;
  /**
   * @minLength 4
   * @maxLength 4
   */
  behandlerenhet: string;
  /**
   * @maxItems 2147483647
   * @minItems 2
   * @uniqueItems true
   */
  roller: OpprettRolleDto[];
  stønadstype: Stonadstype;
  engangsbeløpstype: Engangsbeloptype;
  /** @format int64 */
  søknadsid: number;
  /** @format int32 */
  vedtaksid?: number;
  /** @format int64 */
  søknadsreferanseid?: number;
  kategori?: OpprettKategoriRequestDto;
  innkrevingstype?: Innkrevingstype;
}

export interface OpprettKategoriRequestDto {
  kategori: string;
  /** Beskrivelse av kategorien som er valgt. Er påkrevd hvis kategori er ANNET  */
  beskrivelse?: string;
}

export interface OpprettBehandlingResponse {
  /** @format int64 */
  id: number;
}

export interface BarnDto {
  /** @format int64 */
  id?: number;
  personident?: string;
  navn?: string;
  /** @format date */
  fødselsdato?: string;
}

export interface OpprettUnderholdskostnadBarnResponse {
  underholdskostnad: UnderholdDto;
  /** @uniqueItems true */
  valideringsfeil?: UnderholdskostnadValideringsfeil[];
  /** @uniqueItems true */
  beregnetUnderholdskostnader: BeregnetUnderholdskostnad[];
}

export interface OppdaterManuellVedtakRequest {
  /** @format int64 */
  barnId: number;
  /** @format int32 */
  vedtaksid?: number;
  grunnlagFraOmgjøringsvedtak?: boolean;
  /** @format int32 */
  aldersjusteringForÅr?: number;
}

export interface OppdaterManuellVedtakResponse {
  erVedtakUtenBeregning: boolean;
  /** @uniqueItems true */
  underholdskostnader: UnderholdDto[];
}

export interface OpprettBehandlingFraVedtakRequest {
  vedtakstype: Vedtakstype;
  /** @format date */
  søktFomDato: string;
  /** @format date */
  mottattdato: string;
  søknadFra: SoktAvType;
  /**
   * @minLength 7
   * @maxLength 7
   */
  saksnummer: string;
  /**
   * @minLength 4
   * @maxLength 4
   */
  behandlerenhet: string;
  /** @format int64 */
  søknadsid: number;
  /** @format int64 */
  søknadsreferanseid?: number;
  søknadstype?: Behandlingstype;
}

export interface KanBehandlesINyLosningRequest {
  /**
   * @minLength 7
   * @maxLength 7
   */
  saksnummer: string;
  /**
   * @maxItems 2147483647
   * @minItems 2
   */
  roller: SjekkRolleDto[];
  stønadstype: Stonadstype;
  vedtakstype: Vedtakstype;
  engangsbeløpstype: Engangsbeloptype;
  søknadstype?: Behandlingstype;
  harReferanseTilAnnenBehandling: boolean;
  skruddAvManuelt?: string;
  /** @format date */
  søktFomDato?: string;
  /** @format date */
  mottattdato?: string;
  /** Rolle beskrivelse som er brukte til å opprette nye roller */
  bidragsmottaker?: SjekkRolleDto;
  /** Rolle beskrivelse som er brukte til å opprette nye roller */
  bidragspliktig?: SjekkRolleDto;
  søknadsbarn: SjekkRolleDto[];
}

/** Rolle beskrivelse som er brukte til å opprette nye roller */
export interface SjekkRolleDto {
  rolletype: Rolletype;
  /** F.eks fødselsnummer. Påkrevd for alle rolletyper utenom for barn som ikke inngår i beregning. */
  ident?: string;
  erUkjent?: boolean;
}

export interface FatteVedtakRequestDto {
  /** @format int64 */
  innkrevingUtsattAntallDager?: number;
  enhet?: string;
}

export interface FatteVedtakFeil {
  feilmelding: string;
  ugyldigPerioder: TypeArManedsperiode[];
}

export interface BeregnetBidragPerBarn {
  gjelderBarn: string;
  saksnummer: string;
  løpendeBeløp: number;
  valutakode: string;
  samværsklasse: Samvaersklasse;
  samværsfradrag: number;
  beregnetBeløp: number;
  faktiskBeløp: number;
  reduksjonUnderholdskostnad: number;
  beregnetBidrag: number;
}

export interface BeregnetBidragPerBarnDto {
  beregnetBidragPerBarn: BeregnetBidragPerBarn;
  personidentBarn: string;
}

export interface BidragsevneUtgifterBolig {
  borMedAndreVoksne: boolean;
  boutgiftBeløp: number;
  underholdBeløp: number;
}

export interface DelberegningBidragsevneDto {
  sumInntekt25Prosent: number;
  bidragsevne: number;
  skatt: Skatt;
  underholdEgneBarnIHusstand: UnderholdEgneBarnIHusstand;
  utgifter: BidragsevneUtgifterBolig;
}

export interface DelberegningBidragspliktigesAndel {
  periode: TypeArManedsperiode;
  endeligAndelFaktor: number;
  andelBeløp: number;
  beregnetAndelFaktor: number;
  barnEndeligInntekt: number;
  barnetErSelvforsørget: boolean;
}

export interface DelberegningBidragspliktigesBeregnedeTotalbidragDto {
  beregnetBidragPerBarnListe: BeregnetBidragPerBarnDto[];
  bidragspliktigesBeregnedeTotalbidrag: number;
  periode: TypeArManedsperiode;
}

export interface DelberegningUtgift {
  periode: TypeArManedsperiode;
  sumBetaltAvBp: number;
  sumGodkjent: number;
}

export interface ResultatBeregningInntekterDto {
  inntektBM?: number;
  inntektBP?: number;
  inntektBarn?: number;
  barnEndeligInntekt?: number;
  inntektBarnMånedlig?: number;
  totalEndeligInntekt: number;
  inntektBPMånedlig?: number;
  inntektBMMånedlig?: number;
}

export interface ResultatSaerbidragsberegningDto {
  periode: TypeArManedsperiode;
  bpsAndel?: DelberegningBidragspliktigesAndel;
  beregning?: UtgiftBeregningDto;
  inntekter?: ResultatBeregningInntekterDto;
  utgiftsposter: UtgiftspostDto[];
  delberegningUtgift?: DelberegningUtgift;
  delberegningBidragsevne?: DelberegningBidragsevneDto;
  delberegningBidragspliktigesBeregnedeTotalBidrag?: DelberegningBidragspliktigesBeregnedeTotalbidragDto;
  maksGodkjentBeløp?: number;
  forskuddssats?: number;
  resultat: number;
  resultatKode: Resultatkode;
  /** @format double */
  antallBarnIHusstanden?: number;
  voksenIHusstanden?: boolean;
  enesteVoksenIHusstandenErEgetBarn?: boolean;
  erDirekteAvslag: boolean;
  bpHarEvne: boolean;
  beløpSomInnkreves: number;
}

export interface Skatt {
  sumSkattFaktor: number;
  sumSkatt: number;
  skattAlminneligInntekt: number;
  trinnskatt: number;
  trygdeavgift: number;
  skattAlminneligInntektMånedsbeløp: number;
  trinnskattMånedsbeløp: number;
  trygdeavgiftMånedsbeløp: number;
  skattMånedsbeløp: number;
}

export interface UnderholdEgneBarnIHusstand {
  getårsbeløp: number;
  sjablon: number;
  /** @format double */
  antallBarnIHusstanden: number;
  måndesbeløp: number;
}

export interface ResultatBeregningBarnDto {
  barn: ResultatRolle;
  perioder: ResultatPeriodeDto[];
}

export interface ResultatPeriodeDto {
  periode: TypeArManedsperiode;
  beløp: number;
  resultatKode: Resultatkode;
  vedtakstype?: Vedtakstype;
  regel: string;
  sivilstand?: Sivilstandskode;
  inntekt: number;
  /** @format int32 */
  antallBarnIHusstanden: number;
  resultatkodeVisningsnavn: string;
}

export interface ResultatRolle {
  ident?: string;
  navn: string;
  /** @format date */
  fødselsdato: string;
  innbetaltBeløp?: number;
  referanse: string;
  grunnlagFraVedtak: GrunnlagFraVedtak[];
}

export interface AldersjusteringDetaljerGrunnlag {
  periode: TypeArManedsperiode;
  /** Om grunnlaget er manuelt registrert av saksbehandler eller om det er innhentet fra ekstern kilde (skatt/folkregisteret...) */
  manueltRegistrert: boolean;
  /** @format int32 */
  grunnlagFraVedtak?: number;
  aldersjustert: boolean;
  /** Er sann hvis automatiske løsningen ikke kunne aldersjustere og det må utføres manuelt */
  aldersjusteresManuelt: boolean;
  /** Er sann hvis aldersjustering er gjort manuelt */
  aldersjustertManuelt: boolean;
  /**
   * Vedtaksid som er opprettet av automatisk aldersjustering. Dette settes hvis det er fattet manuell vedtak etter at automatisk aldersjustering ikke kunne hente grunnlag fra siste manuelle vedtak Vil bare bli satt hvis aldersjustertManuelt=true
   * @format int32
   */
  følgerAutomatiskVedtak?: number;
  begrunnelser?: string[];
}

export interface BarnetilleggDetaljerDto {
  bruttoBeløp: number;
  nettoBeløp: number;
  visningsnavn: string;
}

export interface Belop {
  verdi: number;
  valutakode?: Valutakode;
}

export interface BeregningsdetaljerSamvaersfradrag {
  samværsfradrag: number;
  samværsklasse: Samvaersklasse;
  gjennomsnittligSamværPerMåned: number;
}

export interface BidragPeriodeBeregningsdetaljer {
  bpHarEvne: boolean;
  /** @format double */
  antallBarnIHusstanden?: number;
  forskuddssats: number;
  barnetilleggBM: DelberegningBarnetilleggDto;
  barnetilleggBP: DelberegningBarnetilleggDto;
  voksenIHusstanden?: boolean;
  enesteVoksenIHusstandenErEgetBarn?: boolean;
  bpsAndel?: DelberegningBidragspliktigesAndel;
  inntekter?: ResultatBeregningInntekterDto;
  delberegningBidragsevne?: DelberegningBidragsevneDto;
  samværsfradrag?: BeregningsdetaljerSamvaersfradrag;
  endringUnderGrense?: DelberegningEndringSjekkGrensePeriode;
  sluttberegning?: SluttberegningBarnebidrag;
  sluttberegningAldersjustering?: SluttberegningBarnebidragAldersjustering;
  delberegningUnderholdskostnad?: DelberegningUnderholdskostnad;
  indeksreguleringDetaljer?: IndeksreguleringDetaljer;
  delberegningBidragspliktigesBeregnedeTotalBidrag?: DelberegningBidragspliktigesBeregnedeTotalbidragDto;
  deltBosted: boolean;
}

export interface DelberegningBarnetilleggDto {
  barnetillegg: BarnetilleggDetaljerDto[];
  skattFaktor: number;
  delberegningSkattesats?: DelberegningBarnetilleggSkattesats;
  sumInntekt: number;
  sumNettoBeløp: number;
  sumBruttoBeløp: number;
}

export interface DelberegningBarnetilleggSkattesats {
  periode: TypeArManedsperiode;
  skattFaktor: number;
  minstefradrag: number;
  skattAlminneligInntekt: number;
  trygdeavgift: number;
  trinnskatt: number;
  sumSkatt: number;
  sumInntekt: number;
}

export interface DelberegningEndringSjekkGrensePeriode {
  periode: TypeArManedsperiode;
  løpendeBidragBeløp?: number;
  løpendeBidragFraPrivatAvtale: boolean;
  beregnetBidragBeløp?: number;
  faktiskEndringFaktor?: number;
  endringErOverGrense: boolean;
}

export interface DelberegningUnderholdskostnad {
  periode: TypeArManedsperiode;
  forbruksutgift: number;
  boutgift: number;
  barnetilsynMedStønad?: number;
  nettoTilsynsutgift?: number;
  barnetrygd: number;
  underholdskostnad: number;
  forpleining?: number;
}

export interface DelvedtakDto {
  type?: Vedtakstype;
  omgjøringsvedtak: boolean;
  /** @format int32 */
  vedtaksid?: number;
  delvedtak: boolean;
  beregnet: boolean;
  /** @format int32 */
  indeksår: number;
  /** @format date-time */
  resultatFraVedtakVedtakstidspunkt?: string;
  perioder: ResultatBarnebidragsberegningPeriodeDto[];
  grunnlagFraVedtak: GrunnlagFraVedtak[];
  endeligVedtak: boolean;
}

export interface EtterfolgendeVedtakSomOverlapper {
  /** @format int32 */
  vedtaksid: number;
  virkningstidspunkt: string;
}

export interface IndeksreguleringDetaljer {
  sluttberegning?: SluttberegningIndeksregulering;
  faktor: number;
}

export interface KlageOmgjoringDetaljer {
  /** @format int32 */
  resultatFraVedtak?: number;
  /** @format date-time */
  resultatFraVedtakVedtakstidspunkt?: string;
  beregnTilDato?: string;
  omgjøringsvedtak: boolean;
  manuellAldersjustering: boolean;
  delAvVedtaket: boolean;
  kanOpprette35c: boolean;
  skalOpprette35c: boolean;
}

export interface ResultatBarnebidragsberegningPeriodeDto {
  periode: TypeArManedsperiode;
  ugyldigBeregning?: UgyldigResultatPeriode;
  aldersjusteringDetaljer?: AldersjusteringDetaljerGrunnlag;
  underholdskostnad: number;
  bpsAndelU: number;
  bpsAndelBeløp: number;
  samværsfradrag: number;
  beregnetBidrag: number;
  faktiskBidrag: number;
  resultatKode?: Resultatkode;
  erDirekteAvslag: boolean;
  erOpphør: boolean;
  endeligVedtak: boolean;
  erBeregnetAvslag: boolean;
  erEndringUnderGrense: boolean;
  beregningsdetaljer?: BidragPeriodeBeregningsdetaljer;
  vedtakstype: Vedtakstype;
  klageOmgjøringDetaljer?: KlageOmgjoringDetaljer;
  resultatFraVedtak?: ResultatFraVedtakGrunnlag;
  resultatkodeVisningsnavn?: string;
  delvedtakstypeVisningsnavn: string;
}

export interface ResultatBidragberegningDto {
  resultatBarn: ResultatBidragsberegningBarnDto[];
}

export interface ResultatBidragsberegningBarnDto {
  barn: ResultatRolle;
  innkrevesFraDato?: string;
  resultatUtenBeregning: boolean;
  /** @format int32 */
  indeksår?: number;
  ugyldigBeregning?: UgyldigBeregningDto;
  forsendelseDistribueresAutomatisk: boolean;
  erAvvisning: boolean;
  perioder: ResultatBarnebidragsberegningPeriodeDto[];
  delvedtak: DelvedtakDto[];
}

export interface ResultatFraVedtakGrunnlag {
  /** @format int32 */
  vedtaksid?: number;
  omgjøringsvedtak: boolean;
  beregnet: boolean;
  opprettParagraf35c: boolean;
  /** @format date-time */
  vedtakstidspunkt?: string;
  vedtakstype?: Vedtakstype;
}

export interface SluttberegningBarnebidrag {
  periode: TypeArManedsperiode;
  beregnetBeløp?: number;
  resultatBeløp?: number;
  uMinusNettoBarnetilleggBM?: number;
  bruttoBidragEtterBarnetilleggBM: number;
  nettoBidragEtterBarnetilleggBM: number;
  bruttoBidragJustertForEvneOg25Prosent: number;
  bruttoBidragEtterBegrensetRevurdering: number;
  bruttoBidragEtterBarnetilleggBP: number;
  nettoBidragEtterSamværsfradrag: number;
  bpAndelAvUVedDeltBostedFaktor: number;
  bpAndelAvUVedDeltBostedBeløp: number;
  løpendeForskudd?: number;
  løpendeBidrag?: number;
  barnetErSelvforsørget: boolean;
  bidragJustertForDeltBosted: boolean;
  bidragJustertForNettoBarnetilleggBP: boolean;
  bidragJustertForNettoBarnetilleggBM: boolean;
  bidragJustertNedTilEvne: boolean;
  bidragJustertNedTil25ProsentAvInntekt: boolean;
  bidragJustertTilForskuddssats: boolean;
  bidragJustertManueltTilForskuddssats: boolean;
  begrensetRevurderingUtført: boolean;
  ikkeOmsorgForBarnet: boolean;
  tilleggsbidrag?: number;
  forsvaretsBarnetillegg?: boolean;
  bpEvneVedForholdsmessigFordeling?: number;
  bpAndelAvUVedForholdsmessigFordelingFaktor?: number;
  bpSumAndelAvU?: number;
  uminusNettoBarnetilleggBM: number;
}

export interface SluttberegningBarnebidragAldersjustering {
  periode: TypeArManedsperiode;
  beregnetBeløp: number;
  resultatBeløp: number;
  bpAndelBeløp: number;
  bpAndelFaktorVedDeltBosted?: number;
  deltBosted: boolean;
}

export interface SluttberegningIndeksregulering {
  periode: TypeArManedsperiode;
  beløp: Belop;
  originaltBeløp: Belop;
  nesteIndeksreguleringsår?: string;
}

export interface UgyldigBeregningDto {
  tittel: string;
  begrunnelse: string;
  vedtaksliste: EtterfolgendeVedtakSomOverlapper[];
  resultatPeriode: UgyldigResultatPeriode[];
  perioder: TypeArManedsperiode[];
}

export interface UgyldigResultatPeriode {
  periode: TypeArManedsperiode;
  type: UgyldigResultatPeriodeTypeEnum;
}

export interface BehandlingInfoDto {
  vedtakId?: string;
  behandlingId?: string;
  soknadId?: string;
  engangsBelopType?: Engangsbeloptype;
  stonadType?: Stonadstype;
  /** Brukes bare hvis stonadType og engangsbelopType er null */
  behandlingType?: string;
  vedtakType?: Vedtakstype;
  /** Soknadtype er gamle kodeverdier som er erstattet av vedtaktype. */
  soknadType?: string;
  erFattetBeregnet?: boolean;
  /** Hvis resultatkoden fra BBM er IT så skal denne være sann */
  erVedtakIkkeTilbakekreving?: boolean;
  soknadFra?: SoktAvType;
  barnIBehandling: string[];
}

export interface ForsendelseRolleDto {
  fødselsnummer?: string;
  type: Rolletype;
}

export interface InitalizeForsendelseRequest {
  /**
   * @minLength 0
   * @maxLength 7
   */
  saksnummer: string;
  behandlingInfo: BehandlingInfoDto;
  enhet?: string;
  tema?: InitalizeForsendelseRequestTemaEnum;
  roller: ForsendelseRolleDto[];
  behandlingStatus?: InitalizeForsendelseRequestBehandlingStatusEnum;
}

export interface OppdaterParagraf35CDetaljerDto {
  ident: string;
  /** @format int32 */
  vedtaksid: number;
  opprettP35c: boolean;
}

export interface BeregningValideringsfeil {
  virkningstidspunkt?: VirkningstidspunktFeilDto;
  utgift?: UtgiftValideringsfeilDto;
  inntekter?: InntektValideringsfeilDto;
  privatAvtale?: PrivatAvtaleValideringsfeilDto[];
  husstandsmedlem?: BoforholdPeriodeseringsfeil[];
  andreVoksneIHusstanden?: AndreVoksneIHusstandenPeriodeseringsfeil;
  sivilstand?: SivilstandPeriodeseringsfeil;
  /** @uniqueItems true */
  samvær?: SamvaerValideringsfeilDto[];
  /** @uniqueItems true */
  gebyr?: GebyrValideringsfeilDto[];
  /** @uniqueItems true */
  underholdskostnad?: UnderholdskostnadValideringsfeil[];
  /** @uniqueItems true */
  måBekrefteNyeOpplysninger: MaBekrefteNyeOpplysninger[];
}

export interface HusstandsmedlemDto {
  navn?: string;
  ident?: string;
  /** @format date */
  fødselsdato: string;
  /**
   * Teknisk id på husstandsmedlem som har periodiseringsfeil
   * @format int64
   */
  husstandsmedlemId: number;
}

export interface MaBekrefteNyeOpplysninger {
  type: OpplysningerType;
  rolle: RolleDto;
  /** Barn som det må bekreftes nye opplysninger for. Vil bare være satt hvis type = BOFORHOLD */
  gjelderBarn?: HusstandsmedlemDto;
  /** @format int64 */
  underholdskostnadId?: number;
}

export interface ArbeidOgInntektLenkeRequest {
  /** @format int64 */
  behandlingId: number;
  ident: string;
}

export interface BehandlingsreferanseDto {
  /** Kilde/type for en behandlingsreferanse */
  kilde: BehandlingsrefKilde;
  /** Kildesystemets referanse til behandlingen */
  referanse: string;
}

export interface EngangsbelopDto {
  /** Type Engangsbeløp. Særbidrag, gebyr m.m. */
  type: Engangsbeloptype;
  /** Referanse til sak */
  sak: string;
  /** Personidenten til den som skal betale engangsbeløpet */
  skyldner: string;
  /** Personidenten til den som krever engangsbeløpet */
  kravhaver: string;
  /** Personidenten til den som mottar engangsbeløpet */
  mottaker: string;
  /** Beregnet engangsbeløp */
  beløp?: number;
  /** Valutakoden tilhørende engangsbeløpet */
  valutakode?: string;
  /** Resultatkoden tilhørende engangsbeløpet */
  resultatkode: string;
  /** Angir om engangsbeløpet skal innkreves */
  innkreving: Innkrevingstype;
  /** Angir om søknaden om engangsbeløp er besluttet avvist, stadfestet eller skal medføre endringGyldige verdier er 'AVVIST', 'STADFESTELSE' og 'ENDRING' */
  beslutning: Beslutningstype;
  /**
   * Id for vedtaket det er klaget på. Utgjør sammen med referanse en unik id for et engangsbeløp
   * @format int32
   */
  omgjørVedtakId?: number;
  /** Referanse til engangsbeløp, brukes for å kunne omgjøre engangsbeløp senere i et klagevedtak. Unik innenfor et vedtak.Referansen er enten angitt i requesten for opprettelse av vedtak eller generert av bidrag-vedtak hvis den ikke var angitt i requesten. */
  referanse: string;
  /** Referanse - delytelsesId/beslutningslinjeId -> bidrag-regnskap. Skal fjernes senere */
  delytelseId?: string;
  /** Referanse som brukes i utlandssaker */
  eksternReferanse?: string;
  /** Liste over alle grunnlag som inngår i beregningen */
  grunnlagReferanseListe: string[];
  /** Beløp BP allerede har betalt. Kan være 0 eller høyere. */
  betaltBeløp?: number;
}

export interface StonadsendringDto {
  /** Stønadstype */
  type: Stonadstype;
  /** Referanse til sak */
  sak: string;
  /** Personidenten til den som skal betale bidraget */
  skyldner: string;
  /** Personidenten til den som krever bidraget */
  kravhaver: string;
  /** Personidenten til den som mottar bidraget */
  mottaker: string;
  /**
   * Vedtaksid for siste vedtak. Ikke utfyllt for førstegangsvedtak
   * @format int32
   */
  sisteVedtaksid?: number;
  /**
   * Angir første år en stønad skal indeksreguleres
   * @format int32
   */
  førsteIndeksreguleringsår?: number;
  /** Angir om stønaden skal innkreves */
  innkreving: Innkrevingstype;
  /** Angir om søknaden om engangsbeløp er besluttet avvist, stadfestet eller skal medføre endringGyldige verdier er 'AVVIST', 'STADFESTELSE' og 'ENDRING' */
  beslutning: Beslutningstype;
  /**
   * Id for vedtaket det er klaget på
   * @format int32
   */
  omgjørVedtakId?: number;
  /** Referanse som brukes i utlandssaker */
  eksternReferanse?: string;
  /** Liste over grunnlag som er knyttet direkte til stønadsendringen */
  grunnlagReferanseListe: string[];
  /** Liste over alle perioder som inngår i stønadsendringen */
  periodeListe: VedtakPeriodeDto[];
}

export interface VedtakDto {
  /** @format int32 */
  vedtaksid: number;
  /** Hva er kilden til vedtaket. Automatisk eller manuelt */
  kilde: VedtakDtoKildeEnum;
  /** Type vedtak */
  type: Vedtakstype;
  /** Id til saksbehandler eller batchjobb som opprettet vedtaket. For saksbehandler er ident hentet fra token */
  opprettetAv: string;
  /** Saksbehandlers navn */
  opprettetAvNavn?: string;
  /** Navn på applikasjon som vedtaket er opprettet i */
  kildeapplikasjon: string;
  /**
   * Tidspunkt/timestamp når vedtaket er fattet. Er null for vedtaksforslag
   * @format date-time
   */
  vedtakstidspunkt?: string;
  /** Referanse som er unik for vedtaket */
  unikReferanse?: string;
  /** Enheten som er ansvarlig for vedtaket. Kan være null for feks batch */
  enhetsnummer?: string;
  /**
   * Settes hvis overføring til Elin skal utsettes
   * @format date
   */
  innkrevingUtsattTilDato?: string;
  /** Settes hvis vedtaket er fastsatt i utlandet */
  fastsattILand?: string;
  /**
   * Tidspunkt vedtaket er fattet
   * @format date-time
   */
  opprettetTidspunkt: string;
  /** Liste over alle grunnlag som inngår i vedtaket */
  grunnlagListe: GrunnlagDto[];
  /** Liste over alle stønadsendringer som inngår i vedtaket */
  stønadsendringListe: StonadsendringDto[];
  /** Liste over alle engangsbeløp som inngår i vedtaket */
  engangsbeløpListe: EngangsbelopDto[];
  /** Liste med referanser til alle behandlinger som ligger som grunnlag til vedtaket */
  behandlingsreferanseListe: BehandlingsreferanseDto[];
}

export interface ManuellVedtakResponse {
  manuelleVedtak: ManuellVedtakDto[];
}

export interface BehandlingDetaljerDtoV2 {
  /** @format int64 */
  id: number;
  type: TypeBehandling;
  innkrevingstype: Innkrevingstype;
  vedtakstype: Vedtakstype;
  opprinneligVedtakstype?: Vedtakstype;
  stønadstype?: Stonadstype;
  engangsbeløptype?: Engangsbeloptype;
  erVedtakFattet: boolean;
  erKlageEllerOmgjøring: boolean;
  /** @format date-time */
  opprettetTidspunkt: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  søktFomDato: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  mottattdato: string;
  søktAv: SoktAvType;
  saksnummer: string;
  /** @format int64 */
  søknadsid: number;
  /** @format int64 */
  søknadRefId?: number;
  /** @format int32 */
  vedtakRefId?: number;
  behandlerenhet: string;
  /** @uniqueItems true */
  roller: RolleDto[];
  /**
   * @format date
   * @example "01.12.2025"
   */
  virkningstidspunkt?: string;
  årsak?: TypeArsakstype;
  avslag?: Resultatkode;
  kategori?: SaerbidragKategoriDto;
  opprettetAv: SaksbehandlerDto;
}

export interface SaksbehandlerDto {
  ident: string;
  /** Saksbehandlers navn (med eventuelt fornavn bak komma) */
  navn?: string;
}

export interface Arbeidsforhold {
  periode: TypeArManedsperiode;
  arbeidsgiver: string;
  stillingProsent?: string;
  /** @format date */
  lønnsendringDato?: string;
}

export interface BoforholdBarn {
  gjelder: DokumentmalPersonDto;
  medIBehandling: boolean;
  kilde: Kilde;
  opplysningerFraFolkeregisteret: OpplysningerFraFolkeregisteretMedDetaljerBostatuskodeUnit[];
  opplysningerBruktTilBeregning: OpplysningerBruktTilBeregningBostatuskode[];
}

export interface DokumentmalBidragsevneUtgifterBolig {
  borMedAndreVoksne: boolean;
  boutgiftBeløp: number;
  underholdBeløp: number;
}

export interface DokumentmalDelberegningBidragsevneDto {
  sumInntekt25Prosent: number;
  bidragsevne: number;
  skatt: DokumentmalSkattBeregning;
  underholdEgneBarnIHusstand: DokumentmalUnderholdEgneBarnIHusstand;
  utgifter: DokumentmalBidragsevneUtgifterBolig;
}

export interface DokumentmalDelberegningBidragspliktigesBeregnedeTotalbidragDto {
  beregnetBidragPerBarnListe: NotatBeregnetBidragPerBarnDto[];
  bidragspliktigesBeregnedeTotalbidrag: number;
  periode: TypeArManedsperiode;
}

export interface DokumentmalManuellVedtak {
  valgt: boolean;
  /** @format date-time */
  fattetTidspunkt: string;
  /** @format date */
  virkningsDato: string;
  vedtakstype: Vedtakstype;
  resultatSistePeriode: string;
  privatAvtale: boolean;
  begrensetRevurdering: boolean;
  søknadstype: string;
}

export interface DokumentmalPersonDto {
  rolle?: Rolletype;
  navn?: string;
  /** @format date */
  fødselsdato?: string;
  ident?: string;
  erBeskyttet: boolean;
  innbetaltBeløp?: number;
  /** @format date */
  opphørsdato?: string;
  /** @format date */
  virkningstidspunkt?: string;
}

export interface DokumentmalResultatBeregningInntekterDto {
  inntektBM?: number;
  inntektBP?: number;
  inntektBarn?: number;
  barnEndeligInntekt?: number;
  inntektBarnMånedlig?: number;
  totalEndeligInntekt: number;
  inntektBPMånedlig?: number;
  inntektBMMånedlig?: number;
}

export type DokumentmalResultatBidragsberegningBarnDto = UtilRequiredKeys<
  VedtakResultatInnhold,
  "type"
> & {
  barn: DokumentmalPersonDto;
  /** @format int32 */
  indeksår?: number;
  innkrevesFraDato?: string;
  orkestrertVedtak?: EndeligOrkestrertVedtak;
  perioder: ResultatBarnebidragsberegningPeriodeDto[];
};

export interface DokumentmalSkattBeregning {
  sumSkatt: number;
  skattAlminneligInntekt: number;
  trinnskatt: number;
  trygdeavgift: number;
  skattAlminneligInntektMånedsbeløp: number;
  trinnskattMånedsbeløp: number;
  trygdeavgiftMånedsbeløp: number;
  skattMånedsbeløp: number;
}

export interface DokumentmalUnderholdEgneBarnIHusstand {
  getårsbeløp: number;
  sjablon: number;
  /** @format double */
  antallBarnIHusstanden: number;
  måndesbeløp: number;
}

export interface EndeligOrkestrertVedtak {
  type?: Vedtakstype;
  perioder: ResultatBarnebidragsberegningPeriodeDto[];
}

export interface InntekterPerRolle {
  gjelder: DokumentmalPersonDto;
  arbeidsforhold: Arbeidsforhold[];
  årsinntekter: NotatInntektDto[];
  barnetillegg: NotatInntektDto[];
  utvidetBarnetrygd: NotatInntektDto[];
  småbarnstillegg: NotatInntektDto[];
  kontantstøtte: NotatInntektDto[];
  beregnetInntekter: NotatBeregnetInntektDto[];
  harInntekter: boolean;
}

export interface NotatAndreVoksneIHusstanden {
  opplysningerFraFolkeregisteret: OpplysningerFraFolkeregisteretMedDetaljerBostatuskodeNotatAndreVoksneIHusstandenDetaljerDto[];
  opplysningerBruktTilBeregning: OpplysningerBruktTilBeregningBostatuskode[];
}

export interface NotatAndreVoksneIHusstandenDetaljerDto {
  /** @format int32 */
  totalAntallHusstandsmedlemmer: number;
  husstandsmedlemmer: NotatVoksenIHusstandenDetaljerDto[];
}

export interface NotatBarnetilsynOffentligeOpplysninger {
  periode: TypeArManedsperiode;
  tilsynstype?: NotatBarnetilsynOffentligeOpplysningerTilsynstypeEnum;
  skolealder?: NotatBarnetilsynOffentligeOpplysningerSkolealderEnum;
}

/** Notat begrunnelse skrevet av saksbehandler */
export interface NotatBegrunnelseDto {
  innhold?: string;
  innholdFraOmgjortVedtak?: string;
  /** @deprecated */
  intern?: string;
  gjelder?: DokumentmalPersonDto;
}

export interface NotatBehandlingDetaljerDto {
  søknadstype?: string;
  vedtakstype?: Vedtakstype;
  opprinneligVedtakstype?: Vedtakstype;
  kategori?: NotatSaerbidragKategoriDto;
  søktAv?: SoktAvType;
  /** @format date */
  mottattDato?: string;
  søktFraDato?: string;
  /** @format date */
  virkningstidspunkt?: string;
  avslag?: Resultatkode;
  /** @format date */
  klageMottattDato?: string;
  kategoriVisningsnavn?: string;
  avslagVisningsnavnUtenPrefiks?: string;
  vedtakstypeVisningsnavn?: string;
  erAvvisning: boolean;
  avslagVisningsnavn?: string;
}

export interface NotatBeregnetBidragPerBarnDto {
  beregnetBidragPerBarn: BeregnetBidragPerBarn;
  personidentBarn: string;
}

export interface NotatBeregnetInntektDto {
  gjelderBarn: DokumentmalPersonDto;
  summertInntektListe: DelberegningSumInntekt[];
}

export interface NotatBeregnetPrivatAvtalePeriodeDto {
  periode: DatoperiodeDto;
  indeksfaktor: number;
  beløp: number;
}

export interface NotatBoforholdDto {
  barn: BoforholdBarn[];
  andreVoksneIHusstanden?: NotatAndreVoksneIHusstanden;
  boforholdBMSøknadsbarn: NotatBoforholdTilBMMedSoknadsbarn[];
  sivilstand: NotatSivilstand;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse: NotatBegrunnelseDto;
  /**
   * Bruk begrunnelse
   * @deprecated
   */
  notat: NotatBegrunnelseDto;
  beregnetBoforhold: DelberegningBoforhold[];
}

export interface NotatBoforholdTilBMMedSoknadsbarn {
  gjelderBarn: DokumentmalPersonDto;
  perioder: OpplysningerFraFolkeregisteretMedDetaljerBostatuskodeUnit[];
}

export interface NotatFaktiskTilsynsutgiftDto {
  periode: DatoperiodeDto;
  utgift: number;
  kostpenger?: number;
  kommentar?: string;
  total: number;
}

export interface NotatGebyrInntektDto {
  skattepliktigInntekt: number;
  maksBarnetillegg?: number;
  totalInntekt: number;
}

export interface NotatGebyrRolleDto {
  inntekt: NotatGebyrInntektDto;
  manueltOverstyrtGebyr?: NotatManueltOverstyrGebyrDto;
  beregnetIlagtGebyr: boolean;
  endeligIlagtGebyr: boolean;
  begrunnelse?: string;
  beløpGebyrsats: number;
  rolle: DokumentmalPersonDto;
  gebyrResultatVisningsnavn: string;
  erManueltOverstyrt: boolean;
}

export interface NotatInntektDto {
  periode?: TypeArManedsperiode;
  opprinneligPeriode?: TypeArManedsperiode;
  beløp: number;
  kilde: Kilde;
  type: Inntektsrapportering;
  medIBeregning: boolean;
  gjelderBarn?: DokumentmalPersonDto;
  historisk: boolean;
  inntektsposter: NotatInntektspostDto[];
  visningsnavn: string;
  /** Avrundet månedsbeløp for barnetillegg */
  månedsbeløp?: number;
}

export interface NotatInntekterDto {
  inntekterPerRolle: InntekterPerRolle[];
  offentligeInntekterPerRolle: InntekterPerRolle[];
  /** Notat begrunnelse skrevet av saksbehandler */
  notat: NotatBegrunnelseDto;
  /** @uniqueItems true */
  notatPerRolle: NotatBegrunnelseDto[];
  /** @uniqueItems true */
  begrunnelsePerRolle: NotatBegrunnelseDto[];
}

export interface NotatInntektspostDto {
  kode?: string;
  inntektstype?: Inntektstype;
  beløp: number;
  visningsnavn?: string;
}

export interface NotatMaksGodkjentBelopDto {
  taMed: boolean;
  beløp?: number;
  begrunnelse?: string;
}

export interface NotatManueltOverstyrGebyrDto {
  begrunnelse?: string;
  /** Skal bare settes hvis det er avslag */
  ilagtGebyr?: boolean;
}

export interface NotatOffentligeOpplysningerUnderhold {
  offentligeOpplysningerBarn: NotatOffentligeOpplysningerUnderholdBarn[];
  andreBarnTilBidragsmottaker: DokumentmalPersonDto[];
  bidragsmottakerHarInnvilgetTilleggsstønad: boolean;
}

export interface NotatOffentligeOpplysningerUnderholdBarn {
  gjelder: DokumentmalPersonDto;
  gjelderBarn?: DokumentmalPersonDto;
  barnetilsyn: NotatBarnetilsynOffentligeOpplysninger[];
  harTilleggsstønad: boolean;
}

export interface NotatPrivatAvtaleDto {
  gjelderBarn: DokumentmalPersonDto;
  /** @format date */
  avtaleDato?: string;
  avtaleType?: PrivatAvtaleType;
  skalIndeksreguleres: boolean;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse?: NotatBegrunnelseDto;
  perioder: NotatPrivatAvtalePeriodeDto[];
  vedtakslisteUtenInnkreving: DokumentmalManuellVedtak[];
  beregnetPrivatAvtalePerioder: NotatBeregnetPrivatAvtalePeriodeDto[];
  avtaleTypeVisningsnavn?: string;
}

export interface NotatPrivatAvtalePeriodeDto {
  periode: DatoperiodeDto;
  beløp: number;
}

export type NotatResultatForskuddBeregningBarnDto = UtilRequiredKeys<
  VedtakResultatInnhold,
  "type"
> & {
  barn: DokumentmalPersonDto;
  perioder: NotatResultatPeriodeDto[];
};

export interface NotatResultatPeriodeDto {
  periode: TypeArManedsperiode;
  beløp: number;
  resultatKode: Resultatkode;
  regel: string;
  sivilstand?: Sivilstandskode;
  inntekt: number;
  vedtakstype?: Vedtakstype;
  /** @format int32 */
  antallBarnIHusstanden: number;
  resultatKodeVisningsnavn: string;
  sivilstandVisningsnavn?: string;
}

export type NotatResultatSaerbidragsberegningDto = UtilRequiredKeys<
  VedtakResultatInnhold,
  "type"
> & {
  periode: TypeArManedsperiode;
  bpsAndel?: DelberegningBidragspliktigesAndel;
  beregning?: UtgiftBeregningDto;
  forskuddssats?: number;
  maksGodkjentBeløp?: number;
  inntekter?: DokumentmalResultatBeregningInntekterDto;
  delberegningBidragspliktigesBeregnedeTotalbidrag?: DokumentmalDelberegningBidragspliktigesBeregnedeTotalbidragDto;
  delberegningBidragsevne?: DokumentmalDelberegningBidragsevneDto;
  delberegningUtgift?: DelberegningUtgift;
  resultat: number;
  resultatKode: Resultatkode;
  /** @format double */
  antallBarnIHusstanden?: number;
  voksenIHusstanden?: boolean;
  enesteVoksenIHusstandenErEgetBarn?: boolean;
  erDirekteAvslag: boolean;
  bpHarEvne: boolean;
  resultatVisningsnavn: string;
  beløpSomInnkreves: number;
};

export interface NotatSamvaerDto {
  gjelderBarn: DokumentmalPersonDto;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse?: NotatBegrunnelseDto;
  perioder: NotatSamvaersperiodeDto[];
}

export interface NotatSamvaersperiodeDto {
  periode: DatoperiodeDto;
  samværsklasse: Samvaersklasse;
  gjennomsnittligSamværPerMåned: number;
  beregning?: SamvaerskalkulatorDetaljer;
  samværsklasseVisningsnavn: string;
  ferieVisningsnavnMap: Record<string, string>;
  frekvensVisningsnavnMap: Record<string, string>;
}

export interface NotatSivilstand {
  opplysningerFraFolkeregisteret: OpplysningerFraFolkeregisteretMedDetaljerSivilstandskodePDLUnit[];
  opplysningerBruktTilBeregning: OpplysningerBruktTilBeregningSivilstandskode[];
}

export interface NotatStonadTilBarnetilsynDto {
  periode: DatoperiodeDto;
  skolealder: NotatStonadTilBarnetilsynDtoSkolealderEnum;
  tilsynstype: NotatStonadTilBarnetilsynDtoTilsynstypeEnum;
  kilde: Kilde;
  skoleaderVisningsnavn: string;
  tilsynstypeVisningsnavn: string;
}

export interface NotatSaerbidragKategoriDto {
  kategori: Saerbidragskategori;
  beskrivelse?: string;
}

export interface NotatSaerbidragUtgifterDto {
  beregning?: NotatUtgiftBeregningDto;
  maksGodkjentBeløp?: NotatMaksGodkjentBelopDto;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse: NotatBegrunnelseDto;
  /**
   * Bruk begrunnelse
   * @deprecated
   */
  notat: NotatBegrunnelseDto;
  utgifter: NotatUtgiftspostDto[];
  totalBeregning: NotatTotalBeregningUtgifterDto[];
}

export interface NotatTilleggsstonadDto {
  periode: DatoperiodeDto;
  dagsats: number;
  total: number;
}

export interface NotatTilsynsutgiftBarn {
  gjelderBarn: DokumentmalPersonDto;
  totalTilsynsutgift: number;
  beløp: number;
  kostpenger?: number;
  tilleggsstønad?: number;
}

export interface NotatTotalBeregningUtgifterDto {
  betaltAvBp: boolean;
  utgiftstype: string;
  totalKravbeløp: number;
  totalGodkjentBeløp: number;
  utgiftstypeVisningsnavn: string;
}

export interface NotatUnderholdBarnDto {
  gjelderBarn: DokumentmalPersonDto;
  harTilsynsordning?: boolean;
  stønadTilBarnetilsyn: NotatStonadTilBarnetilsynDto[];
  faktiskTilsynsutgift: NotatFaktiskTilsynsutgiftDto[];
  tilleggsstønad: NotatTilleggsstonadDto[];
  underholdskostnad: NotatUnderholdskostnadBeregningDto[];
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse?: NotatBegrunnelseDto;
}

export interface NotatUnderholdDto {
  underholdskostnaderBarn: NotatUnderholdBarnDto[];
  offentligeOpplysninger: NotatOffentligeOpplysningerUnderholdBarn[];
  offentligeOpplysningerV2: NotatOffentligeOpplysningerUnderhold;
}

export interface NotatUnderholdskostnadBeregningDto {
  periode: DatoperiodeDto;
  forbruk: number;
  boutgifter: number;
  stønadTilBarnetilsyn: number;
  tilsynsutgifter: number;
  barnetrygd: number;
  total: number;
  beregningsdetaljer?: NotatUnderholdskostnadPeriodeBeregningsdetaljer;
}

export interface NotatUnderholdskostnadPeriodeBeregningsdetaljer {
  tilsynsutgifterBarn: NotatTilsynsutgiftBarn[];
  sjablonMaksTilsynsutgift: number;
  sjablonMaksFradrag: number;
  /** @format int32 */
  antallBarnBMUnderTolvÅr: number;
  /** @format int32 */
  antallBarnBMBeregnet: number;
  /** @format int32 */
  antallBarnMedTilsynsutgifter: number;
  skattesatsFaktor: number;
  totalTilsynsutgift: number;
  sumTilsynsutgifter: number;
  bruttoTilsynsutgift: number;
  justertBruttoTilsynsutgift: number;
  nettoTilsynsutgift: number;
  erBegrensetAvMaksTilsyn: boolean;
  fordelingFaktor: number;
  skattefradragPerBarn: number;
  maksfradragAndel: number;
  skattefradrag: number;
  skattefradragMaksFradrag: number;
  skattefradragTotalTilsynsutgift: number;
}

export interface NotatUtgiftBeregningDto {
  /** Beløp som er direkte betalt av BP */
  beløpDirekteBetaltAvBp: number;
  /** Summen av godkjente beløp som brukes for beregningen */
  totalGodkjentBeløp: number;
  /** Summen av kravbeløp */
  totalKravbeløp: number;
  /** Summen av godkjente beløp som brukes for beregningen */
  totalGodkjentBeløpBp?: number;
  /** Summen av godkjent beløp for utgifter BP har betalt plus beløp som er direkte betalt av BP */
  totalBeløpBetaltAvBp: number;
}

export interface NotatUtgiftspostDto {
  /**
   * Når utgifter gjelder. Kan være feks dato på kvittering
   * @format date
   */
  dato: string;
  /** Type utgift. Kan feks være hva som ble kjøpt for kravbeløp (bugnad, klær, sko, etc) */
  type: Utgiftstype | string;
  /** Beløp som er betalt for utgiften det gjelder */
  kravbeløp: number;
  /** Beløp som er godkjent for beregningen */
  godkjentBeløp: number;
  /** Begrunnelse for hvorfor godkjent beløp avviker fra kravbeløp. Må settes hvis godkjent beløp er ulik kravbeløp */
  begrunnelse?: string;
  /** Om utgiften er betalt av BP */
  betaltAvBp: boolean;
  utgiftstypeVisningsnavn: string;
}

export interface NotatVedtakDetaljerDto {
  erFattet: boolean;
  fattetAvSaksbehandler?: string;
  /** @format date-time */
  fattetTidspunkt?: string;
  resultat: (
    | DokumentmalResultatBidragsberegningBarnDto
    | NotatResultatForskuddBeregningBarnDto
    | NotatResultatSaerbidragsberegningDto
  )[];
}

export interface NotatVirkningstidspunktDto {
  søknadstype?: string;
  vedtakstype?: Vedtakstype;
  søktAv?: SoktAvType;
  /**
   * @format date
   * @example "01.12.2025"
   */
  mottattDato?: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  søktFraDato?: string;
  beregnTilDato?: string;
  beregnTil?: BeregnTil;
  etterfølgendeVedtakVirkningstidspunkt?: string;
  /**
   * @format date
   * @example "01.12.2025"
   */
  virkningstidspunkt?: string;
  avslag?: Resultatkode;
  årsak?: TypeArsakstype;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelse: NotatBegrunnelseDto;
  /** Notat begrunnelse skrevet av saksbehandler */
  begrunnelseVurderingAvSkolegang?: NotatBegrunnelseDto;
  /**
   * Bruk begrunnelse
   * @deprecated
   */
  notat: NotatBegrunnelseDto;
  avslagVisningsnavn?: string;
  årsakVisningsnavn?: string;
}

export interface NotatVoksenIHusstandenDetaljerDto {
  navn: string;
  /** @format date */
  fødselsdato?: string;
  erBeskyttet: boolean;
  harRelasjonTilBp: boolean;
}

export interface OpplysningerBruktTilBeregningBostatuskode {
  periode: TypeArManedsperiode;
  status: Bostatuskode;
  kilde: Kilde;
  statusVisningsnavn?: string;
}

export interface OpplysningerBruktTilBeregningSivilstandskode {
  periode: TypeArManedsperiode;
  status: Sivilstandskode;
  kilde: Kilde;
  statusVisningsnavn?: string;
}

export interface OpplysningerFraFolkeregisteretMedDetaljerBostatuskodeNotatAndreVoksneIHusstandenDetaljerDto {
  periode: TypeArManedsperiode;
  status?: Bostatuskode;
  detaljer?: NotatAndreVoksneIHusstandenDetaljerDto;
  statusVisningsnavn?: string;
}

export interface OpplysningerFraFolkeregisteretMedDetaljerBostatuskodeUnit {
  periode: TypeArManedsperiode;
  status?: Bostatuskode;
  statusVisningsnavn?: string;
}

export interface OpplysningerFraFolkeregisteretMedDetaljerSivilstandskodePDLUnit {
  periode: TypeArManedsperiode;
  status?: SivilstandskodePDL;
  statusVisningsnavn?: string;
}

export interface VedtakNotatDto {
  type: NotatMalType;
  erOrkestrertVedtak: boolean;
  stønadstype?: Stonadstype;
  medInnkreving: boolean;
  saksnummer: string;
  behandling: NotatBehandlingDetaljerDto;
  saksbehandlerNavn?: string;
  virkningstidspunkt: NotatVirkningstidspunktDto;
  utgift?: NotatSaerbidragUtgifterDto;
  boforhold: NotatBoforholdDto;
  samvær: NotatSamvaerDto[];
  gebyr?: NotatGebyrRolleDto[];
  underholdskostnader?: NotatUnderholdDto;
  personer: DokumentmalPersonDto[];
  privatavtale: NotatPrivatAvtaleDto[];
  roller: DokumentmalPersonDto[];
  inntekter: NotatInntekterDto;
  vedtak: NotatVedtakDetaljerDto;
}

export interface VedtakResultatInnhold {
  type: NotatMalType;
}

export interface SletteUnderholdselement {
  /** @format int64 */
  idUnderhold: number;
  /** @format int64 */
  idElement: number;
  type: SletteUnderholdselementTypeEnum;
}

export interface SletteSamvaersperiodeElementDto {
  gjelderBarn: string;
  /** @format int64 */
  samværsperiodeId: number;
}

/**
 * Relasjon til BP. Brukes for debugging
 * @deprecated
 */
export enum AndreVoksneIHusstandenDetaljerDtoRelasjonEnum {
  BARN = "BARN",
  FAR = "FAR",
  MEDMOR = "MEDMOR",
  MOR = "MOR",
  INGEN = "INGEN",
  FORELDER = "FORELDER",
  EKTEFELLE = "EKTEFELLE",
  MOTPART_TIL_FELLES_BARN = "MOTPART_TIL_FELLES_BARN",
  UKJENT = "UKJENT",
}

/** Angir om barnetilsynet er heltid eller deltid */
export enum BarnetilsynGrunnlagDtoTilsynstypeEnum {
  HELTID = "HELTID",
  DELTID = "DELTID",
  IKKE_ANGITT = "IKKE_ANGITT",
}

/** Angir om barnet er over eller under skolealder */
export enum BarnetilsynGrunnlagDtoSkolealderEnum {
  OVER = "OVER",
  UNDER = "UNDER",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum StonadTilBarnetilsynDtoSkolealderEnum {
  OVER = "OVER",
  UNDER = "UNDER",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum StonadTilBarnetilsynDtoTilsynstypeEnum {
  HELTID = "HELTID",
  DELTID = "DELTID",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum OppdaterRollerResponseStatusEnum {
  BEHANDLING_SLETTET = "BEHANDLING_SLETTET",
  ROLLER_OPPDATERT = "ROLLER_OPPDATERT",
}

export enum UgyldigResultatPeriodeTypeEnum {
  BEGRENSETREVURDERINGLIKELLERLAVEREENNLOPENDEBIDRAG = "BEGRENSET_REVURDERING_LIK_ELLER_LAVERE_ENN_LØPENDE_BIDRAG",
  BEGRENSETREVURDERINGUTENLOPENDEFORSKUDD = "BEGRENSET_REVURDERING_UTEN_LØPENDE_FORSKUDD",
}

export enum InitalizeForsendelseRequestTemaEnum {
  BID = "BID",
  FAR = "FAR",
}

export enum InitalizeForsendelseRequestBehandlingStatusEnum {
  OPPRETTET = "OPPRETTET",
  ENDRET = "ENDRET",
  FEILREGISTRERT = "FEILREGISTRERT",
}

/** Hva er kilden til vedtaket. Automatisk eller manuelt */
export enum VedtakDtoKildeEnum {
  MANUELT = "MANUELT",
  AUTOMATISK = "AUTOMATISK",
}

export enum NotatBarnetilsynOffentligeOpplysningerTilsynstypeEnum {
  HELTID = "HELTID",
  DELTID = "DELTID",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum NotatBarnetilsynOffentligeOpplysningerSkolealderEnum {
  OVER = "OVER",
  UNDER = "UNDER",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum NotatStonadTilBarnetilsynDtoSkolealderEnum {
  OVER = "OVER",
  UNDER = "UNDER",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum NotatStonadTilBarnetilsynDtoTilsynstypeEnum {
  HELTID = "HELTID",
  DELTID = "DELTID",
  IKKE_ANGITT = "IKKE_ANGITT",
}

export enum SletteUnderholdselementTypeEnum {
  BARN = "BARN",
  FAKTISK_TILSYNSUTGIFT = "FAKTISK_TILSYNSUTGIFT",
  STONADTILBARNETILSYN = "STØNAD_TIL_BARNETILSYN",
  TILLEGGSSTONAD = "TILLEGGSSTØNAD",
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8990",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title bidrag-behandling
 * @version v1
 * @baseUrl http://localhost:8990
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Oppdatere virkningstidspunkt for behandling. Returnerer oppdatert virkningstidspunkt
     *
     * @tags behandling-controller-v-2
     * @name OppdatereVirkningstidspunktV2
     * @request PUT:/api/v2/behandling/{behandlingsid}/virkningstidspunkt
     * @secure
     */
    oppdatereVirkningstidspunktV2: (
      behandlingsid: number,
      data: OppdatereVirkningstidspunkt,
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDtoV2, BehandlingDtoV2>({
        path: `/api/v2/behandling/${behandlingsid}/virkningstidspunkt`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere utgift for behandling. Returnerer oppdatert behandling detaljer.
     *
     * @tags behandling-controller-v-2
     * @name OppdatereUtgift
     * @request PUT:/api/v2/behandling/{behandlingsid}/utgift
     * @secure
     */
    oppdatereUtgift: (
      behandlingsid: number,
      data: OppdatereUtgiftRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereUtgiftResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/utgift`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Angir om søknadsbarn har tilsynsordning.
     *
     * @tags underhold-controller
     * @name OppdatereTilsynsordning
     * @request PUT:/api/v2/behandling/{behandlingsid}/underhold/{underholdsid}/tilsynsordning
     * @secure
     */
    oppdatereTilsynsordning: (
      behandlingsid: number,
      underholdsid: number,
      query: {
        harTilsynsordning: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/${underholdsid}/tilsynsordning`,
        method: "PUT",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Oppdatere tilleggsstønad for underholdskostnad i behandling. Returnerer oppdatert element.
     *
     * @tags underhold-controller
     * @name OppdatereTilleggsstonad
     * @request PUT:/api/v2/behandling/{behandlingsid}/underhold/{underholdsid}/tilleggsstonad
     * @secure
     */
    oppdatereTilleggsstonad: (
      behandlingsid: number,
      underholdsid: number,
      data: OppdatereTilleggsstonadRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereUnderholdResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/${underholdsid}/tilleggsstonad`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere faktisk tilsynsutgift for underholdskostnad i behandling. Returnerer oppdatert element.
     *
     * @tags underhold-controller
     * @name OppdatereFaktiskTilsynsutgift
     * @request PUT:/api/v2/behandling/{behandlingsid}/underhold/{underholdsid}/faktisk_tilsynsutgift
     * @secure
     */
    oppdatereFaktiskTilsynsutgift: (
      behandlingsid: number,
      underholdsid: number,
      data: OppdatereFaktiskTilsynsutgiftRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereUnderholdResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/${underholdsid}/faktisk_tilsynsutgift`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere stønad til barnetilsyn for underholdskostnad i behandling. Returnerer oppdatert element.
     *
     * @tags underhold-controller
     * @name OppdatereStonadTilBarnetilsyn
     * @request PUT:/api/v2/behandling/{behandlingsid}/underhold/{underholdsid}/barnetilsyn
     * @secure
     */
    oppdatereStonadTilBarnetilsyn: (
      behandlingsid: number,
      underholdsid: number,
      data: StonadTilBarnetilsynDto,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereUnderholdResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/${underholdsid}/barnetilsyn`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere begrunnelse for underhold relatert til søknadsbarn eller andre barn.
     *
     * @tags underhold-controller
     * @name OppdatereBegrunnelse
     * @request PUT:/api/v2/behandling/{behandlingsid}/underhold/begrunnelse
     * @secure
     */
    oppdatereBegrunnelse: (
      behandlingsid: number,
      data: OppdatereBegrunnelseRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/begrunnelse`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Oppdater samvær for en behandling.
     *
     * @tags samv-ær-controller
     * @name OppdaterSamvaer
     * @request PUT:/api/v2/behandling/{behandlingsid}/samvar
     * @secure
     */
    oppdaterSamvaer: (
      behandlingsid: number,
      data: OppdaterSamvaerDto,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterSamvaerResponsDto, any>({
        path: `/api/v2/behandling/${behandlingsid}/samvar`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere privat avtale. Returnerer oppdatert element.
     *
     * @tags privat-avtale-controller
     * @name OppdaterPrivatAvtale
     * @request PUT:/api/v2/behandling/{behandlingsid}/privatavtale/{privatavtaleid}
     * @secure
     */
    oppdaterPrivatAvtale: (
      behandlingsid: number,
      privatavtaleid: number,
      data: OppdaterePrivatAvtaleRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterePrivatAvtaleResponsDto, any>({
        path: `/api/v2/behandling/${behandlingsid}/privatavtale/${privatavtaleid}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sletter privat avtale.
     *
     * @tags privat-avtale-controller
     * @name SlettePrivatAvtale
     * @request DELETE:/api/v2/behandling/{behandlingsid}/privatavtale/{privatavtaleid}
     * @secure
     */
    slettePrivatAvtale: (
      behandlingsid: number,
      privatavtaleid: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/behandling/${behandlingsid}/privatavtale/${privatavtaleid}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Oppdatere opphørsdato for behandling.
     *
     * @tags virkningstidspunkt-controller
     * @name OppdatereOpphorsdato
     * @request PUT:/api/v2/behandling/{behandlingsid}/opphorsdato
     * @secure
     */
    oppdatereOpphorsdato: (
      behandlingsid: number,
      data: OppdaterOpphorsdatoRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDtoV2, any>({
        path: `/api/v2/behandling/${behandlingsid}/opphorsdato`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere inntekt for behandling. Returnerer inntekt som ble endret, opprettet, eller slettet.
     *
     * @tags behandling-controller-v-2
     * @name OppdatereInntekt
     * @request PUT:/api/v2/behandling/{behandlingsid}/inntekt
     * @secure
     */
    oppdatereInntekt: (
      behandlingsid: number,
      data: OppdatereInntektRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereInntektResponse, OppdatereInntektResponse>({
        path: `/api/v2/behandling/${behandlingsid}/inntekt`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdater manuelt overstyr gebyr for en behandling.
     *
     * @tags gebyr-controller
     * @name OppdaterManueltOverstyrtGebyr
     * @request PUT:/api/v2/behandling/{behandlingsid}/gebyr
     * @secure
     */
    oppdaterManueltOverstyrtGebyr: (
      behandlingsid: number,
      data: OppdaterGebyrDto,
      params: RequestParams = {},
    ) =>
      this.request<GebyrRolleDto, any>({
        path: `/api/v2/behandling/${behandlingsid}/gebyr`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere boforhold for behandling. Returnerer boforhold som ble endret, opprettet, eller slettet.
     *
     * @tags behandling-controller-v-2
     * @name OppdatereBoforhold
     * @request PUT:/api/v2/behandling/{behandlingsid}/boforhold
     * @secure
     */
    oppdatereBoforhold: (
      behandlingsid: number,
      data: OppdatereBoforholdRequestV2,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereBoforholdResponse, OppdatereBoforholdResponse>({
        path: `/api/v2/behandling/${behandlingsid}/boforhold`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdatere opphørsdato for behandling.
     *
     * @tags virkningstidspunkt-controller
     * @name OppdatereBeregnTilDato
     * @request PUT:/api/v2/behandling/{behandlingsid}/beregntildato
     * @secure
     */
    oppdatereBeregnTilDato: (
      behandlingsid: number,
      data: OppdaterBeregnTilDatoRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDtoV2, any>({
        path: `/api/v2/behandling/${behandlingsid}/beregntildato`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Aktivere grunnlag for behandling. Returnerer grunnlag som ble aktivert.
     *
     * @tags behandling-controller-v-2
     * @name AktivereGrunnlag
     * @request PUT:/api/v2/behandling/{behandlingsid}/aktivere
     * @secure
     */
    aktivereGrunnlag: (
      behandlingsid: number,
      data: AktivereGrunnlagRequestV2,
      params: RequestParams = {},
    ) =>
      this.request<AktivereGrunnlagResponseV2, AktivereGrunnlagResponseV2>({
        path: `/api/v2/behandling/${behandlingsid}/aktivere`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdater roller i behandling
     *
     * @tags behandling-controller-v-2
     * @name OppdaterRoller
     * @request PUT:/api/v2/behandling/{behandlingId}/roller
     * @secure
     */
    oppdaterRoller: (
      behandlingId: number,
      data: OppdaterRollerRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterRollerResponse, any>({
        path: `/api/v2/behandling/${behandlingId}/roller`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppdater samvær for en behandling.
     *
     * @tags samv-ær-controller
     * @name BeregnSamvaersklasse
     * @request POST:/api/v2/samvar/beregn
     * @secure
     */
    beregnSamvaersklasse: (
      data: SamvaerskalkulatorDetaljer,
      params: RequestParams = {},
    ) =>
      this.request<DelberegningSamvaersklasse, any>({
        path: `/api/v2/samvar/beregn`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description Opprett ny behandling
 *
 * @tags behandling-controller-v-2
 * @name OppretteBehandling
 * @summary 
            Oppretter ny behandlding. 
            Hvis det finnes en behandling fra før med samme søknadsid i forespørsel 
            vil id for den behandlingen returneres istedenfor at det opprettes ny
 * @request POST:/api/v2/behandling
 * @secure
 */
    oppretteBehandling: (
      data: OpprettBehandlingRequest,
      params: RequestParams = {},
    ) =>
      this.request<OpprettBehandlingResponse, OpprettBehandlingResponse>({
        path: `/api/v2/behandling`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppretter underholdselement med faktiske utgifter for BMs andre barn. Legges manuelt inn av saksbehandler.
     *
     * @tags underhold-controller
     * @name OppretteUnderholdForBarn
     * @request POST:/api/v2/behandling/{behandlingsid}/underhold/opprette
     * @secure
     */
    oppretteUnderholdForBarn: (
      behandlingsid: number,
      data: BarnDto,
      params: RequestParams = {},
    ) =>
      this.request<OpprettUnderholdskostnadBarnResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold/opprette`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppretter privat avtale
     *
     * @tags privat-avtale-controller
     * @name OpprettePrivatAvtale
     * @request POST:/api/v2/behandling/{behandlingsid}/privatavtale/opprette
     * @secure
     */
    opprettePrivatAvtale: (
      behandlingsid: number,
      data: BarnDto,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterePrivatAvtaleResponsDto, any>({
        path: `/api/v2/behandling/${behandlingsid}/privatavtale/opprette`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Hent manuelle vedtak.
     *
     * @tags virkningstidspunkt-controller
     * @name HentManuelleVedtak
     * @request GET:/api/v2/behandling/{behandlingsid}/manuelleVedtak
     * @secure
     */
    hentManuelleVedtak: (behandlingsid: number, params: RequestParams = {}) =>
      this.request<ManuellVedtakResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/manuelleVedtak`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Velg manuelle vedtak for beregning.
     *
     * @tags virkningstidspunkt-controller
     * @name OppdaterValgtManuellVedtak
     * @request POST:/api/v2/behandling/{behandlingsid}/manuelleVedtak
     * @secure
     */
    oppdaterValgtManuellVedtak: (
      behandlingsid: number,
      data: OppdaterManuellVedtakRequest,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterManuellVedtakResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/manuelleVedtak`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Opprett behandling fra vedtak. Brukes når det skal opprettes klagebehanling fra vedtak.
     *
     * @tags behandling-controller-v-2
     * @name OpprettBehandlingForVedtak
     * @request POST:/api/v2/behandling/vedtak/{refVedtaksId}
     * @secure
     */
    opprettBehandlingForVedtak: (
      refVedtaksId: number,
      data: OpprettBehandlingFraVedtakRequest,
      params: RequestParams = {},
    ) =>
      this.request<OpprettBehandlingResponse, any>({
        path: `/api/v2/behandling/vedtak/${refVedtaksId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Sjekk om behandling kan behandles i ny løsning
     *
     * @tags behandling-controller-v-2
     * @name KanBehandlesINyLosning
     * @request POST:/api/v2/behandling/kanBehandles
     * @secure
     */
    kanBehandlesINyLosning: (
      data: KanBehandlesINyLosningRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/behandling/kanBehandles`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Sjekk om behandling kan behandles i ny løsning
     *
     * @tags behandling-controller-v-2
     * @name KanBehandlingBehandlesINyLosning
     * @request POST:/api/v2/behandling/kanBehandles/{behandlingsid}
     * @secure
     */
    kanBehandlingBehandlesINyLosning: (
      behandlingsid: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v2/behandling/kanBehandles/${behandlingsid}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Fatte vedtak for behandling
     *
     * @tags vedtak-controller
     * @name FatteVedtak
     * @request POST:/api/v2/behandling/fattevedtak/{behandlingsid}
     * @secure
     */
    fatteVedtak: (
      behandlingsid: number,
      data: FatteVedtakRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<number, FatteVedtakFeil>({
        path: `/api/v2/behandling/fattevedtak/${behandlingsid}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Opprett aldersjustering behandling for sak
     *
     * @tags admin-controller
     * @name OpprettAldersjustering
     * @request POST:/api/v2/admin/opprett/aldersjustering/{saksnummer}
     * @secure
     */
    opprettAldersjustering: (
      saksnummer: string,
      data: string,
      params: RequestParams = {},
    ) =>
      this.request<OpprettBehandlingResponse, any>({
        path: `/api/v2/admin/opprett/aldersjustering/${saksnummer}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn særbidrag
     *
     * @tags behandling-beregn-controller
     * @name HentVedtakBeregningResultatSaerbidrag
     * @request POST:/api/v1/vedtak/{vedtaksId}/beregn/sarbidrag
     * @secure
     */
    hentVedtakBeregningResultatSaerbidrag: (
      vedtaksId: number,
      params: RequestParams = {},
    ) =>
      this.request<ResultatSaerbidragsberegningDto, any>({
        path: `/api/v1/vedtak/${vedtaksId}/beregn/sarbidrag`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn forskudd
     *
     * @tags behandling-beregn-controller
     * @name HentVedtakBeregningResultat
     * @request POST:/api/v1/vedtak/{vedtaksId}/beregn/forskudd
     * @secure
     */
    hentVedtakBeregningResultat: (
      vedtaksId: number,
      params: RequestParams = {},
    ) =>
      this.request<ResultatBeregningBarnDto[], any>({
        path: `/api/v1/vedtak/${vedtaksId}/beregn/forskudd`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn forskudd
     *
     * @tags behandling-beregn-controller
     * @name HentVedtakBeregningResultat1
     * @request POST:/api/v1/vedtak/{vedtaksId}/beregn
     * @secure
     */
    hentVedtakBeregningResultat1: (
      vedtaksId: number,
      params: RequestParams = {},
    ) =>
      this.request<ResultatBeregningBarnDto[], any>({
        path: `/api/v1/vedtak/${vedtaksId}/beregn`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn bidrag
     *
     * @tags behandling-beregn-controller
     * @name HentVedtakBeregningResultatBidrag
     * @request POST:/api/v1/vedtak/{vedtaksId}/beregn/bidrag
     * @secure
     */
    hentVedtakBeregningResultatBidrag: (
      vedtaksId: number,
      params: RequestParams = {},
    ) =>
      this.request<ResultatBidragberegningDto, any>({
        path: `/api/v1/vedtak/${vedtaksId}/beregn/bidrag`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notat-opplysninger-controller
     * @name HentNotatOpplysninger
     * @request GET:/api/v1/notat/{behandlingId}
     * @secure
     */
    hentNotatOpplysninger: (behandlingId: number, params: RequestParams = {}) =>
      this.request<VedtakNotatDto, any>({
        path: `/api/v1/notat/${behandlingId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notat-opplysninger-controller
     * @name OpprettNotat
     * @request POST:/api/v1/notat/{behandlingId}
     * @secure
     */
    opprettNotat: (behandlingId: number, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/notat/${behandlingId}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Oppretter forsendelse for behandling eller vedtak. Skal bare benyttes hvis vedtakId eller behandlingId mangler for behandling (Søknad som behandles gjennom Bisys)
     *
     * @tags forsendelse-controller
     * @name OpprettForsendelse
     * @request POST:/api/v1/forsendelse/init
     * @secure
     */
    opprettForsendelse: (
      data: InitalizeForsendelseRequest,
      params: RequestParams = {},
    ) =>
      this.request<string[], any>({
        path: `/api/v1/forsendelse/init`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn bidrag
     *
     * @tags behandling-beregn-controller
     * @name OppdaterVedtakParagraf35C
     * @request POST:/api/v1/behandling/{behandlingsid}/paragrafp35c
     * @secure
     */
    oppdaterVedtakParagraf35C: (
      behandlingsid: number,
      data: OppdaterParagraf35CDetaljerDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/behandling/${behandlingsid}/paragrafp35c`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Beregn særbidrag
     *
     * @tags behandling-beregn-controller
     * @name BeregnSaerbidrag
     * @request POST:/api/v1/behandling/{behandlingsid}/beregn/sarbidrag
     * @secure
     */
    beregnSaerbidrag: (behandlingsid: number, params: RequestParams = {}) =>
      this.request<ResultatSaerbidragsberegningDto, BeregningValideringsfeil>({
        path: `/api/v1/behandling/${behandlingsid}/beregn/sarbidrag`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn BPs laveste inntekt for evne
     *
     * @tags behandling-beregn-controller
     * @name BeregnBPsLavesteInntektForEvne
     * @request POST:/api/v1/behandling/{behandlingsid}/beregn/sarbidrag/bpslavesteinntektforevne
     * @secure
     */
    beregnBPsLavesteInntektForEvne: (
      behandlingsid: number,
      params: RequestParams = {},
    ) =>
      this.request<number, BeregningValideringsfeil>({
        path: `/api/v1/behandling/${behandlingsid}/beregn/sarbidrag/bpslavesteinntektforevne`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn forskudd
     *
     * @tags behandling-beregn-controller
     * @name BeregnForskudd
     * @request POST:/api/v1/behandling/{behandlingsid}/beregn/forskudd
     * @secure
     */
    beregnForskudd: (behandlingsid: number, params: RequestParams = {}) =>
      this.request<ResultatBeregningBarnDto[], BeregningValideringsfeil>({
        path: `/api/v1/behandling/${behandlingsid}/beregn/forskudd`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn forskudd
     *
     * @tags behandling-beregn-controller
     * @name BeregnForskudd1
     * @request POST:/api/v1/behandling/{behandlingsid}/beregn
     * @secure
     */
    beregnForskudd1: (behandlingsid: number, params: RequestParams = {}) =>
      this.request<ResultatBeregningBarnDto[], BeregningValideringsfeil>({
        path: `/api/v1/behandling/${behandlingsid}/beregn`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Beregn barnebidrag
     *
     * @tags behandling-beregn-controller
     * @name BeregnBarnebidrag
     * @request POST:/api/v1/behandling/{behandlingsid}/beregn/barnebidrag
     * @secure
     */
    beregnBarnebidrag: (
      behandlingsid: number,
      query?: {
        endeligBeregning?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ResultatBidragberegningDto, BeregningValideringsfeil>({
        path: `/api/v1/behandling/${behandlingsid}/beregn/barnebidrag`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Generer lenke for ainntekt-søk med filter for behandling og personident oppgitt i forespørsel
     *
     * @tags arbeid-og-inntekt-controller
     * @name GenererAinntektLenke
     * @request POST:/api/v1/arbeidoginntekt/ainntekt
     * @secure
     */
    genererAinntektLenke: (
      data: ArbeidOgInntektLenkeRequest,
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/api/v1/arbeidoginntekt/ainntekt`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Generer lenke for aareg-søk for personident oppgitt i forespørsel
     *
     * @tags arbeid-og-inntekt-controller
     * @name GenererAaregLenke
     * @request POST:/api/v1/arbeidoginntekt/aareg
     * @secure
     */
    genererAaregLenke: (data: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/arbeidoginntekt/aareg`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Simuler vedtakstruktur for en behandling. Brukes for testing av grunnlagsstruktur uten å faktisk fatte vedtak
     *
     * @tags vedtak-simulering-controller
     * @name BehandlingTilVedtak
     * @request GET:/api/v2/simulervedtak/{behandlingId}
     * @secure
     */
    behandlingTilVedtak: (behandlingId: number, params: RequestParams = {}) =>
      this.request<VedtakDto, any>({
        path: `/api/v2/simulervedtak/${behandlingId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hente en behandling
     *
     * @tags behandling-controller-v-2
     * @name HenteBehandlingV2
     * @request GET:/api/v2/behandling/{behandlingsid}
     * @secure
     */
    henteBehandlingV2: (
      behandlingsid: number,
      query?: {
        inkluderHistoriskeInntekter?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDtoV2, BehandlingDtoV2>({
        path: `/api/v2/behandling/${behandlingsid}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Logisk slett en behandling
     *
     * @tags behandling-controller-v-2
     * @name SlettBehandling
     * @request DELETE:/api/v2/behandling/{behandlingsid}
     * @secure
     */
    slettBehandling: (behandlingsid: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v2/behandling/${behandlingsid}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Hent vedtak som behandling for lesemodus. Vedtak vil bli konvertert til behandling uten lagring
     *
     * @tags behandling-controller-v-2
     * @name VedtakLesemodus
     * @request GET:/api/v2/behandling/vedtak/{vedtakId}
     * @secure
     */
    vedtakLesemodus: (
      vedtakId: number,
      query?: {
        inkluderHistoriskeInntekter?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDtoV2, BehandlingDtoV2>({
        path: `/api/v2/behandling/vedtak/${vedtakId}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hente behandling detaljer for bruk i Bisys
     *
     * @tags behandling-controller-v-2
     * @name HenteBehandlingDetaljer
     * @request GET:/api/v2/behandling/detaljer/{behandlingsid}
     * @secure
     */
    henteBehandlingDetaljer: (
      behandlingsid: number,
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDetaljerDtoV2, BehandlingDetaljerDtoV2>({
        path: `/api/v2/behandling/detaljer/${behandlingsid}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Hente behandling detaljer for søknadsid bruk i Bisys
     *
     * @tags behandling-controller-v-2
     * @name HenteBehandlingDetaljerForSoknadsid
     * @request GET:/api/v2/behandling/detaljer/soknad/{søknadsid}
     * @secure
     */
    henteBehandlingDetaljerForSoknadsid: (
      soknadsid: number,
      params: RequestParams = {},
    ) =>
      this.request<BehandlingDetaljerDtoV2, BehandlingDetaljerDtoV2>({
        path: `/api/v2/behandling/detaljer/soknad/{søknadsid}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags visningsnavn-controller
     * @name HentVisningsnavn
     * @request GET:/api/v1/visningsnavn
     * @secure
     */
    hentVisningsnavn: (params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/api/v1/visningsnavn`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notat-opplysninger-controller
     * @name HentNotatOpplysningerForVedtak
     * @request GET:/api/v1/notat/vedtak/{vedtaksid}
     * @secure
     */
    hentNotatOpplysningerForVedtak: (
      vedtaksid: number,
      params: RequestParams = {},
    ) =>
      this.request<VedtakNotatDto, any>({
        path: `/api/v1/notat/vedtak/${vedtaksid}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Sletter fra underholdskostnad i behandling. Returnerer oppdaterte underholdsobjekt. Objektet  vil være null dersom barn slettes.
     *
     * @tags underhold-controller
     * @name SletteFraUnderhold
     * @request DELETE:/api/v2/behandling/{behandlingsid}/underhold
     * @secure
     */
    sletteFraUnderhold: (
      behandlingsid: number,
      data: SletteUnderholdselement,
      params: RequestParams = {},
    ) =>
      this.request<OppdatereUnderholdResponse, any>({
        path: `/api/v2/behandling/${behandlingsid}/underhold`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Slett samværsperiode
     *
     * @tags samv-ær-controller
     * @name SlettSamvaersperiode
     * @request DELETE:/api/v2/behandling/{behandlingsid}/samvar/periode
     * @secure
     */
    slettSamvaersperiode: (
      behandlingsid: number,
      data: SletteSamvaersperiodeElementDto,
      params: RequestParams = {},
    ) =>
      this.request<OppdaterSamvaerResponsDto, any>({
        path: `/api/v2/behandling/${behandlingsid}/samvar/periode`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
