import { PersonNavn } from "@common/components/PersonNavn";
import { MenuButton, SideMenu } from "@common/components/SideMenu/SideMenu";
import behandlingQueryKeys, {
    toUnderholdskostnadTabQueryParameter,
    toUnderholdskostnadTabQueryParameterForUnderhold,
} from "@common/constants/behandlingQueryKeys";
import elementIds from "@common/constants/elementIds";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import React, { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Rolletype, Vedtakstype } from "../../api/BidragBehandlingApiV1";
import { STEPS } from "../constants/steps";
import { BarnebidragStepper } from "../enum/BarnebidragStepper";

const VirkingstidspunktMenuButton = ({ activeButton, step }: { activeButton: string; step: string }) => {
    const { onStepChange } = useBehandlingProvider();
    return (
        <MenuButton
            step={step}
            title={text.title.virkningstidspunkt}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.VIRKNINGSTIDSPUNKT])}
            active={activeButton === BarnebidragStepper.VIRKNINGSTIDSPUNKT}
        />
    );
};

const VedtakEndeligMenuButton = ({ activeButton, step }: { activeButton: string; step: string }) => {
    const { onStepChange } = useBehandlingProvider();
    return (
        <MenuButton
            step={step}
            title={text.title.vedtak}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.VEDTAK_ENDELIG])}
            active={activeButton === BarnebidragStepper.VEDTAK_ENDELIG}
        />
    );
};
const KlageVedtakMenuButton = ({ activeButton, step }: { activeButton: string; step: string }) => {
    const { onStepChange } = useBehandlingProvider();
    const { vedtakstype } = useGetBehandlingV2();
    return (
        <MenuButton
            step={step}
            title={vedtakstype === Vedtakstype.KLAGE ? text.title.klagevedtak : text.title.omgjøringsvedtak}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.KLAGEVEDTAK])}
            active={activeButton === BarnebidragStepper.KLAGEVEDTAK}
        />
    );
};
const VedtakMenuButton = ({ activeButton, step }: { activeButton: string; step: string }) => {
    const { onStepChange } = useBehandlingProvider();
    return (
        <MenuButton
            step={step}
            title={text.title.vedtak}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.VEDTAK])}
            active={activeButton === BarnebidragStepper.VEDTAK}
        />
    );
};

const PrivatAvtaleMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange } = useBehandlingProvider();
    const { vedtakstype } = useGetBehandlingV2();
    return (
        <MenuButton
            step={step}
            interactive={interactive}
            title={vedtakstype === Vedtakstype.INNKREVING ? text.title.innkreving : text.title.privatAvtale}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.PRIVAT_AVTALE])}
            active={activeButton === BarnebidragStepper.PRIVAT_AVTALE}
        />
    );
};

const UnderholdskostnadMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange, lesemodus } = useBehandlingProvider();
    const { underholdskostnader } = useGetBehandlingV2();

    const underholdskostnadHasValideringsFeil = underholdskostnader
        .filter((underhold) => underhold.gjelderBarn.medIBehandlingen)
        .some(({ valideringsfeil }) => {
            return (
                valideringsfeil?.manglerBegrunnelse ||
                valideringsfeil?.manglerPerioderForTilsynsordning ||
                !!valideringsfeil?.faktiskTilsynsutgift ||
                !!valideringsfeil?.stønadTilBarnetilsyn ||
                !!valideringsfeil?.tilleggsstønad ||
                !!valideringsfeil?.tilleggsstønadsperioderUtenFaktiskTilsynsutgift.length
            );
        });

    const underholdskostnadAndreBarnHasValideringsFeil = underholdskostnader
        .filter((underhold) => !underhold.gjelderBarn.medIBehandlingen)
        .some(({ valideringsfeil }) => {
            return valideringsfeil?.manglerBegrunnelse || !!valideringsfeil?.faktiskTilsynsutgift;
        });

    return (
        <MenuButton
            step={step}
            title={text.title.underholdskostnad}
            interactive={interactive}
            valideringsfeil={!lesemodus && underholdskostnadHasValideringsFeil}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD])}
            active={activeButton?.includes(BarnebidragStepper.UNDERHOLDSKOSTNAD)}
            subMenu={underholdskostnader
                .filter((underhold) => underhold.gjelderBarn.medIBehandlingen)
                .map((underhold) => (
                    <Fragment key={underhold.id}>
                        <MenuButton
                            title={
                                <>
                                    BA <PersonNavnIdent ident={underhold.gjelderBarn.ident} />
                                </>
                            }
                            onStepChange={() =>
                                onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD], {
                                    [behandlingQueryKeys.tab]:
                                        toUnderholdskostnadTabQueryParameterForUnderhold(underhold),
                                })
                            }
                            interactive={interactive}
                            size="small"
                            valideringsfeil={
                                !lesemodus &&
                                (underhold.valideringsfeil?.manglerBegrunnelse ||
                                    underhold.valideringsfeil?.manglerPerioderForTilsynsordning ||
                                    !!underhold.valideringsfeil?.faktiskTilsynsutgift ||
                                    !!underhold.valideringsfeil?.stønadTilBarnetilsyn ||
                                    !!underhold.valideringsfeil?.tilleggsstønad ||
                                    !!underhold.valideringsfeil?.tilleggsstønadsperioderUtenFaktiskTilsynsutgift.length)
                            }
                            active={
                                activeButton ===
                                `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameterForUnderhold(underhold)}`
                            }
                            subMenu={
                                <>
                                    {underhold.harTilsynsordning && (
                                        <>
                                            <MenuButton
                                                title={text.title.stønadTilBarnetilsyn}
                                                onStepChange={() =>
                                                    onStepChange(
                                                        STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD],
                                                        {
                                                            [behandlingQueryKeys.tab]:
                                                                toUnderholdskostnadTabQueryParameterForUnderhold(
                                                                    underhold
                                                                ),
                                                        },
                                                        elementIds.seksjon_underholdskostnad_barnetilsyn
                                                    )
                                                }
                                                interactive={interactive}
                                                valideringsfeil={
                                                    !lesemodus &&
                                                    (underhold.valideringsfeil?.stønadTilBarnetilsyn
                                                        ?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.fremtidigePerioder.length)
                                                }
                                                size="small"
                                                active={
                                                    activeButton ===
                                                    `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameterForUnderhold(underhold)}`
                                                }
                                            />
                                            <MenuButton
                                                title={text.title.faktiskeTilsynsutgifter}
                                                onStepChange={() =>
                                                    onStepChange(
                                                        STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD],
                                                        {
                                                            [behandlingQueryKeys.tab]:
                                                                toUnderholdskostnadTabQueryParameterForUnderhold(
                                                                    underhold
                                                                ),
                                                        },
                                                        elementIds.seksjon_underholdskostnad_tilysnsutgifter
                                                    )
                                                }
                                                interactive={interactive}
                                                valideringsfeil={
                                                    !lesemodus &&
                                                    (underhold.valideringsfeil?.faktiskTilsynsutgift
                                                        ?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.fremtidigePerioder.length)
                                                }
                                                size="small"
                                                active={
                                                    activeButton ===
                                                    `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameterForUnderhold(underhold)}`
                                                }
                                            />
                                            <MenuButton
                                                title={text.title.tilleggsstønad}
                                                onStepChange={() =>
                                                    onStepChange(
                                                        STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD],
                                                        {
                                                            [behandlingQueryKeys.tab]:
                                                                toUnderholdskostnadTabQueryParameterForUnderhold(
                                                                    underhold
                                                                ),
                                                        },
                                                        elementIds.seksjon_underholdskostnad_tilleggstønad
                                                    )
                                                }
                                                interactive={interactive}
                                                valideringsfeil={
                                                    !lesemodus &&
                                                    (underhold.valideringsfeil?.tilleggsstønad?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.tilleggsstønad
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.tilleggsstønad
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.tilleggsstønad?.fremtidigePerioder
                                                            .length)
                                                }
                                                size="small"
                                                active={
                                                    activeButton ===
                                                    `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameterForUnderhold(underhold)}`
                                                }
                                            />
                                        </>
                                    )}
                                    <MenuButton
                                        title={text.title.underholdskostnad}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD],
                                                {
                                                    [behandlingQueryKeys.tab]:
                                                        toUnderholdskostnadTabQueryParameterForUnderhold(underhold),
                                                },
                                                elementIds.seksjon_underholdskostnad_beregnet
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={
                                            activeButton ===
                                            `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameterForUnderhold(underhold)}`
                                        }
                                    />
                                </>
                            }
                        />
                    </Fragment>
                ))
                .concat(
                    <MenuButton
                        title={text.label.andreBarn}
                        onStepChange={() =>
                            onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD], {
                                [behandlingQueryKeys.tab]: toUnderholdskostnadTabQueryParameter(),
                            })
                        }
                        interactive={interactive}
                        valideringsfeil={!lesemodus && underholdskostnadAndreBarnHasValideringsFeil}
                        size="small"
                        active={
                            activeButton ===
                            `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameter()}`
                        }
                        subMenu={underholdskostnader
                            .filter((underhold) => !underhold.gjelderBarn.medIBehandlingen)
                            .map((underhold) => (
                                <MenuButton
                                    key={underhold.gjelderBarn.id}
                                    title={<PersonNavn navn={underhold.gjelderBarn.navn} />}
                                    onStepChange={() =>
                                        onStepChange(
                                            STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD],
                                            {
                                                [behandlingQueryKeys.tab]: toUnderholdskostnadTabQueryParameter(),
                                            },
                                            underhold.gjelderBarn.id.toString()
                                        )
                                    }
                                    interactive={interactive}
                                    valideringsfeil={
                                        !lesemodus &&
                                        (underhold.valideringsfeil?.faktiskTilsynsutgift?.harIngenPerioder ||
                                            underhold.valideringsfeil?.faktiskTilsynsutgift
                                                ?.manglerPerioderForTilsynsutgifter ||
                                            !!underhold?.valideringsfeil?.faktiskTilsynsutgift?.overlappendePerioder
                                                .length ||
                                            !!underhold?.valideringsfeil?.faktiskTilsynsutgift?.fremtidigePerioder
                                                .length)
                                    }
                                    size="small"
                                    active={
                                        activeButton ===
                                        `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameter()}`
                                    }
                                />
                            ))}
                    />
                )}
        />
    );
};

const InntektMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange, lesemodus } = useBehandlingProvider();
    const {
        inntekter: { valideringsfeil: inntektValideringsfeil },
        ikkeAktiverteEndringerIGrunnlagsdata,
        roller,
    } = useGetBehandlingV2();
    const inntektRoller = roller.sort((a, b) => {
        if (a.rolletype === Rolletype.BM) return -1;
        if (b.rolletype === Rolletype.BM) return 1;
        if (a.rolletype === Rolletype.BP) return -1;
        if (b.rolletype === Rolletype.BP) return 1;
        if (a.rolletype === Rolletype.BA || b.rolletype === Rolletype.BA) {
            return a.ident.localeCompare(b.ident);
        }
        return 0;
    });
    const inntektHasValideringsFeil = inntektValideringsfeil && !!Object.keys(inntektValideringsfeil).length;
    const inntekterIkkeAktiverteEndringer =
        !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter &&
        Object.values(ikkeAktiverteEndringerIGrunnlagsdata.inntekter).some((inntekt) => !!inntekt.length);

    return (
        <MenuButton
            step={step}
            title={text.title.inntekt}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.INNTEKT])}
            interactive={interactive}
            active={activeButton?.includes(BarnebidragStepper.INNTEKT)}
            valideringsfeil={!lesemodus && inntektHasValideringsFeil}
            unconfirmedUpdates={!lesemodus && inntekterIkkeAktiverteEndringer}
            subMenu={inntektRoller.map((rolle) => (
                <Fragment key={rolle.id}>
                    <MenuButton
                        title={
                            <div className="flex flex-row gap-1">
                                {rolle.rolletype} <PersonNavnIdent ident={rolle.ident} />
                            </div>
                        }
                        onStepChange={() =>
                            onStepChange(STEPS[BarnebidragStepper.INNTEKT], {
                                [behandlingQueryKeys.tab]: rolle.id.toString(),
                            })
                        }
                        interactive={interactive}
                        size="small"
                        valideringsfeil={
                            !lesemodus &&
                            inntektValideringsfeil &&
                            Object.values(inntektValideringsfeil).some((valideringsfeil) => {
                                if (Array.isArray(valideringsfeil)) {
                                    return valideringsfeil?.some((feil) => feil?.rolle?.id === rolle.id);
                                }
                                return valideringsfeil?.rolle?.id === rolle.id;
                            })
                        }
                        unconfirmedUpdates={
                            !lesemodus &&
                            inntekterIkkeAktiverteEndringer &&
                            Object.values(ikkeAktiverteEndringerIGrunnlagsdata.inntekter).some((inntekter) =>
                                inntekter.some((inntekt) => inntekt.ident === rolle.ident)
                            )
                        }
                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                        subMenu={
                            rolle.rolletype === Rolletype.BM ? (
                                <>
                                    <MenuButton
                                        title={text.title.skattepliktigeogPensjonsgivendeInntekt}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_skattepliktig
                                            )
                                        }
                                        interactive={interactive}
                                        valideringsfeil={
                                            !lesemodus &&
                                            inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )
                                        }
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )
                                        }
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                    />
                                    <MenuButton
                                        title={text.title.barnetillegg}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_barnetillegg
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={
                                            !lesemodus &&
                                            !!inntektValideringsfeil?.barnetillegg?.some(
                                                (feil) => feil?.rolle?.ident === rolle.ident
                                            )
                                        }
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.barnetillegg?.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )
                                        }
                                    />
                                    <MenuButton
                                        title={text.title.utvidetBarnetrygd}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_utvidetbarnetrygd
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={!lesemodus && !!inntektValideringsfeil?.utvidetBarnetrygd}
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.utvidetBarnetrygd?.length
                                        }
                                    />
                                    <MenuButton
                                        title={text.title.småbarnstillegg}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_småbarnstillegg
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={!lesemodus && !!inntektValideringsfeil?.småbarnstillegg}
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.småbarnstillegg?.length
                                        }
                                    />
                                    <MenuButton
                                        title={text.title.kontantstøtte}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_kontantstøtte
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={!lesemodus && !!inntektValideringsfeil?.kontantstøtte?.length}
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.kontantstøtte?.length
                                        }
                                    />
                                </>
                            ) : rolle.rolletype === Rolletype.BP ? (
                                <>
                                    <MenuButton
                                        title={text.title.skattepliktigeogPensjonsgivendeInntekt}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_skattepliktig
                                            )
                                        }
                                        interactive={interactive}
                                        valideringsfeil={
                                            !lesemodus &&
                                            inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )
                                        }
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )
                                        }
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                    />
                                    <MenuButton
                                        title={text.title.barnetillegg}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_barnetillegg
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={
                                            !lesemodus &&
                                            !!inntektValideringsfeil?.barnetillegg?.some(
                                                (feil) => feil?.rolle?.ident === rolle.ident
                                            )
                                        }
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.barnetillegg?.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )
                                        }
                                    />
                                </>
                            ) : (
                                <>
                                    <MenuButton
                                        title={text.title.skattepliktigeogPensjonsgivendeInntekt}
                                        onStepChange={() =>
                                            onStepChange(
                                                STEPS[BarnebidragStepper.INNTEKT],
                                                {
                                                    [behandlingQueryKeys.tab]: rolle.id.toString(),
                                                },
                                                elementIds.seksjon_inntekt_skattepliktig
                                            )
                                        }
                                        interactive={interactive}
                                        size="small"
                                        active={activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`}
                                        valideringsfeil={
                                            !lesemodus &&
                                            inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )
                                        }
                                        unconfirmedUpdates={
                                            !lesemodus &&
                                            ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )
                                        }
                                    />
                                </>
                            )
                        }
                    />
                </Fragment>
            ))}
        />
    );
};

const BoforholdMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange, lesemodus } = useBehandlingProvider();
    const {
        boforhold: { valideringsfeil: boforholdValideringsfeil },
        ikkeAktiverteEndringerIGrunnlagsdata,
    } = useGetBehandlingV2();
    const husstandsmedlemIkkeAktiverteEndringer = !!ikkeAktiverteEndringerIGrunnlagsdata?.husstandsmedlem?.length;
    const andreVoksneIHusstandenIkkeAktiverteEndringer = !!ikkeAktiverteEndringerIGrunnlagsdata?.andreVoksneIHusstanden;
    const boforholdIkkeAktiverteEndringer =
        husstandsmedlemIkkeAktiverteEndringer || andreVoksneIHusstandenIkkeAktiverteEndringer;
    const boforholdValideringsFeil = !!boforholdValideringsfeil?.husstandsmedlem?.length;

    return (
        <MenuButton
            step={step}
            title={text.title.boforhold}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.BOFORHOLD])}
            interactive={interactive}
            active={activeButton === BarnebidragStepper.BOFORHOLD}
            valideringsfeil={!lesemodus && boforholdValideringsFeil}
            unconfirmedUpdates={!lesemodus && boforholdIkkeAktiverteEndringer}
        />
    );
};

const GebyrMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange, lesemodus } = useBehandlingProvider();
    const { gebyr } = useGetBehandlingV2();
    const gebyrValideringsFeil = gebyr?.valideringsfeil?.some((valideringsfeil) => {
        return valideringsfeil.manglerBegrunnelse;
    });

    return (
        <MenuButton
            step={step}
            title={text.title.gebyr}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.GEBYR])}
            interactive={interactive}
            active={activeButton === BarnebidragStepper.GEBYR}
            valideringsfeil={!lesemodus && gebyrValideringsFeil}
        />
    );
};

const SamværMenuButton = ({
    activeButton,
    step,
    interactive,
}: {
    activeButton: string;
    step: string;
    interactive: boolean;
}) => {
    const { onStepChange, lesemodus } = useBehandlingProvider();
    const { samvær } = useGetBehandlingV2();
    const samværValideringsFeil = samvær?.some(({ valideringsfeil }) => {
        return (
            valideringsfeil?.manglerSamvær ||
            valideringsfeil?.manglerBegrunnelse ||
            valideringsfeil?.ingenLøpendeSamvær ||
            valideringsfeil?.harPeriodiseringsfeil ||
            valideringsfeil?.hullIPerioder ||
            valideringsfeil?.overlappendePerioder
        );
    });
    return (
        <MenuButton
            step={step}
            title={text.title.samvær}
            interactive={interactive}
            onStepChange={() => onStepChange(STEPS[BarnebidragStepper.SAMVÆR])}
            active={activeButton === BarnebidragStepper.SAMVÆR}
            valideringsfeil={!lesemodus && samværValideringsFeil}
        />
    );
};

const menuButtonMap = {
    [BarnebidragStepper.VIRKNINGSTIDSPUNKT]: VirkingstidspunktMenuButton,
    [BarnebidragStepper.PRIVAT_AVTALE]: PrivatAvtaleMenuButton,
    [BarnebidragStepper.INNTEKT]: InntektMenuButton,
    [BarnebidragStepper.BOFORHOLD]: BoforholdMenuButton,
    [BarnebidragStepper.GEBYR]: GebyrMenuButton,
    [BarnebidragStepper.UNDERHOLDSKOSTNAD]: UnderholdskostnadMenuButton,
    [BarnebidragStepper.SAMVÆR]: SamværMenuButton,
    [BarnebidragStepper.VEDTAK]: VedtakMenuButton,
    [BarnebidragStepper.VEDTAK_ENDELIG]: VedtakEndeligMenuButton,
    [BarnebidragStepper.KLAGEVEDTAK]: KlageVedtakMenuButton,
} satisfies Record<string, React.ComponentType<never>>;

export const BarnebidragSideMenu = () => {
    const { sideMenu } = useBehandlingProvider();
    const [searchParams] = useSearchParams();
    const getActiveButtonFromParams = () => {
        const step = searchParams.get(behandlingQueryKeys.steg);
        if (!step) return BarnebidragStepper.VIRKNINGSTIDSPUNKT;
        const tab = searchParams.get(behandlingQueryKeys.tab);
        return `${step}${tab ? `.${tab}` : ""}`;
    };
    const [activeButton, setActiveButton] = useState<string>(getActiveButtonFromParams());

    useEffect(() => {
        const activeButton = getActiveButtonFromParams();
        setActiveButton(activeButton);
    }, [searchParams, location]);

    return (
        <SideMenu>
            {sideMenu
                .filter((menu) => menu.visible)
                .map((menuButton, index) => {
                    const Component = menuButtonMap[menuButton.step];
                    return (
                        <Component
                            key={index + menuButton.step}
                            activeButton={activeButton}
                            step={index + 1}
                            interactive={menuButton.interactive}
                        />
                    );
                })}
        </SideMenu>
    );
};
