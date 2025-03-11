import { Rolletype, Vedtakstype } from "@api/BidragBehandlingApiV1";
import { PersonIdent } from "@common/components/PersonIdent";
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
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import React, { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { STEPS } from "../constants/steps";
import { BarnebidragStepper } from "../enum/BarnebidragStepper";

export const BarnebidragSideMenu = () => {
    const { onStepChange } = useBehandlingProvider();
    const { isBidragV2Enabled } = useFeatureToogle();
    const {
        vedtakstype,
        virkningstidspunkt,
        boforhold: { valideringsfeil: boforholdValideringsfeil },
        inntekter: { valideringsfeil: inntektValideringsfeil },
        samvær,
        gebyr,
        ikkeAktiverteEndringerIGrunnlagsdata,
        roller,
        underholdskostnader,
    } = useGetBehandlingV2();
    const [searchParams] = useSearchParams();
    const getActiveButtonFromParams = () => {
        const step = searchParams.get(behandlingQueryKeys.steg);
        if (!step) return BarnebidragStepper.VIRKNINGSTIDSPUNKT;
        const tab = searchParams.get(behandlingQueryKeys.tab);
        return `${step}${tab ? `.${tab}` : ""}`;
    };
    const [activeButton, setActiveButton] = useState<string>(getActiveButtonFromParams());
    const interactive = !virkningstidspunkt.avslag && vedtakstype !== Vedtakstype.OPPHOR;
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

    useEffect(() => {
        const activeButton = getActiveButtonFromParams();
        setActiveButton(activeButton);
    }, [searchParams, location]);

    const husstandsmedlemValideringsFeil = !!boforholdValideringsfeil?.husstandsmedlem?.length;
    const boforholdValideringsFeil = husstandsmedlemValideringsFeil;
    const husstandsmedlemIkkeAktiverteEndringer = !!ikkeAktiverteEndringerIGrunnlagsdata?.husstandsmedlem?.length;
    const andreVoksneIHusstandenIkkeAktiverteEndringer = !!ikkeAktiverteEndringerIGrunnlagsdata?.andreVoksneIHusstanden;
    const boforholdIkkeAktiverteEndringer =
        husstandsmedlemIkkeAktiverteEndringer || andreVoksneIHusstandenIkkeAktiverteEndringer;
    const inntektHasValideringsFeil = inntektValideringsfeil && !!Object.keys(inntektValideringsfeil).length;
    const inntekterIkkeAktiverteEndringer =
        !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter &&
        Object.values(ikkeAktiverteEndringerIGrunnlagsdata.inntekter).some((inntekt) => !!inntekt.length);
    const gebyrValideringsFeil = gebyr?.valideringsfeil?.some((valideringsfeil) => {
        return valideringsfeil.manglerBegrunnelse;
    });
    const samværValideringsFeil = samvær.some(({ valideringsfeil }) => {
        return (
            valideringsfeil?.manglerSamvær ||
            valideringsfeil?.manglerBegrunnelse ||
            valideringsfeil?.ingenLøpendeSamvær ||
            valideringsfeil?.harPeriodiseringsfeil ||
            valideringsfeil?.hullIPerioder ||
            valideringsfeil?.overlappendePerioder
        );
    });
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
        <SideMenu>
            <MenuButton
                step={"1."}
                title={text.title.virkningstidspunkt}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.VIRKNINGSTIDSPUNKT])}
                active={activeButton === BarnebidragStepper.VIRKNINGSTIDSPUNKT}
            />
            {isBidragV2Enabled && (
                <MenuButton
                    step={"2."}
                    title={text.title.privatAvtale}
                    onStepChange={() => onStepChange(STEPS[BarnebidragStepper.PRIVAT_AVTALE])}
                    active={activeButton === BarnebidragStepper.PRIVAT_AVTALE}
                />
            )}
            <MenuButton
                step={isBidragV2Enabled ? "3." : "2"}
                title={text.title.underholdskostnad}
                interactive={interactive}
                valideringsfeil={underholdskostnadHasValideringsFeil}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD])}
                active={activeButton?.includes(BarnebidragStepper.UNDERHOLDSKOSTNAD)}
                subMenu={underholdskostnader
                    .filter((underhold) => underhold.gjelderBarn.medIBehandlingen)
                    .map((underhold) => (
                        <Fragment key={underhold.id}>
                            <MenuButton
                                title={
                                    <>
                                        BA <PersonIdent ident={underhold.gjelderBarn.ident} />
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
                                    underhold.valideringsfeil?.manglerBegrunnelse ||
                                    underhold.valideringsfeil?.manglerPerioderForTilsynsordning ||
                                    !!underhold.valideringsfeil?.faktiskTilsynsutgift ||
                                    !!underhold.valideringsfeil?.stønadTilBarnetilsyn ||
                                    !!underhold.valideringsfeil?.tilleggsstønad ||
                                    !!underhold.valideringsfeil?.tilleggsstønadsperioderUtenFaktiskTilsynsutgift.length
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
                                                        underhold.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.stønadTilBarnetilsyn
                                                            ?.fremtidigePerioder.length
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
                                                        underhold.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.faktiskTilsynsutgift
                                                            ?.fremtidigePerioder.length
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
                                                        underhold.valideringsfeil?.tilleggsstønad?.harIngenPerioder ||
                                                        underhold.valideringsfeil?.tilleggsstønad
                                                            ?.manglerPerioderForTilsynsutgifter ||
                                                        !!underhold?.valideringsfeil?.tilleggsstønad
                                                            ?.overlappendePerioder.length ||
                                                        !!underhold?.valideringsfeil?.tilleggsstønad?.fremtidigePerioder
                                                            .length
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
                            <MenuButton
                                title={text.label.andreBarn}
                                onStepChange={() =>
                                    onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD], {
                                        [behandlingQueryKeys.tab]: toUnderholdskostnadTabQueryParameter(),
                                    })
                                }
                                interactive={interactive}
                                valideringsfeil={underholdskostnadAndreBarnHasValideringsFeil}
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
                                                        [behandlingQueryKeys.tab]:
                                                            toUnderholdskostnadTabQueryParameter(),
                                                    },
                                                    underhold.gjelderBarn.id.toString()
                                                )
                                            }
                                            interactive={interactive}
                                            valideringsfeil={
                                                underhold.valideringsfeil?.faktiskTilsynsutgift?.harIngenPerioder ||
                                                underhold.valideringsfeil?.faktiskTilsynsutgift
                                                    ?.manglerPerioderForTilsynsutgifter ||
                                                !!underhold?.valideringsfeil?.faktiskTilsynsutgift?.overlappendePerioder
                                                    .length ||
                                                !!underhold?.valideringsfeil?.faktiskTilsynsutgift?.fremtidigePerioder
                                                    .length
                                            }
                                            size="small"
                                            active={
                                                activeButton ===
                                                `${BarnebidragStepper.UNDERHOLDSKOSTNAD}.${toUnderholdskostnadTabQueryParameter()}`
                                            }
                                        />
                                    ))}
                            />
                        </Fragment>
                    ))}
            />
            <MenuButton
                step={isBidragV2Enabled ? "4." : "3"}
                title={text.title.inntekt}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.INNTEKT])}
                interactive={interactive}
                active={activeButton?.includes(BarnebidragStepper.INNTEKT)}
                valideringsfeil={inntektHasValideringsFeil}
                unconfirmedUpdates={inntekterIkkeAktiverteEndringer}
                subMenu={inntektRoller.map((rolle) => (
                    <Fragment key={rolle.id}>
                        <MenuButton
                            title={
                                <div className="flex flex-row gap-1">
                                    {rolle.rolletype} <PersonIdent ident={rolle.ident} />
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
                                inntektValideringsfeil &&
                                Object.values(inntektValideringsfeil).some((valideringsfeil) => {
                                    if (Array.isArray(valideringsfeil)) {
                                        return valideringsfeil?.some((feil) => feil?.rolle?.id === rolle.id);
                                    }
                                    return valideringsfeil?.rolle?.id === rolle.id;
                                })
                            }
                            unconfirmedUpdates={
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
                                            valideringsfeil={inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )}
                                            unconfirmedUpdates={ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )}
                                            size="small"
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={
                                                !!inntektValideringsfeil?.barnetillegg?.some(
                                                    (feil) => feil?.rolle?.ident === rolle.ident
                                                )
                                            }
                                            unconfirmedUpdates={
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={!!inntektValideringsfeil?.utvidetBarnetrygd}
                                            unconfirmedUpdates={
                                                !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.utvidetBarnetrygd
                                                    ?.length
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={!!inntektValideringsfeil?.småbarnstillegg}
                                            unconfirmedUpdates={
                                                !!ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.småbarnstillegg
                                                    ?.length
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={!!inntektValideringsfeil?.kontantstøtte?.length}
                                            unconfirmedUpdates={
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
                                            valideringsfeil={inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )}
                                            unconfirmedUpdates={ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )}
                                            size="small"
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={
                                                !!inntektValideringsfeil?.barnetillegg?.some(
                                                    (feil) => feil?.rolle?.ident === rolle.ident
                                                )
                                            }
                                            unconfirmedUpdates={
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
                                            active={
                                                activeButton === `${BarnebidragStepper.INNTEKT}.${rolle.id.toString()}`
                                            }
                                            valideringsfeil={inntektValideringsfeil?.årsinntekter?.some(
                                                (feil) => feil?.rolle?.id === rolle.id
                                            )}
                                            unconfirmedUpdates={ikkeAktiverteEndringerIGrunnlagsdata?.inntekter?.årsinntekter.some(
                                                (inntekt) => inntekt.ident === rolle.ident
                                            )}
                                        />
                                    </>
                                )
                            }
                        />
                    </Fragment>
                ))}
            />
            <MenuButton
                step={isBidragV2Enabled ? "5." : "4"}
                title={text.title.gebyr}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.GEBYR])}
                interactive={interactive && !!gebyr?.gebyrRoller.length}
                active={activeButton === BarnebidragStepper.GEBYR}
                valideringsfeil={gebyrValideringsFeil}
            />
            <MenuButton
                step={isBidragV2Enabled ? "6." : "5"}
                title={text.title.boforhold}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.BOFORHOLD])}
                interactive={interactive}
                active={activeButton === BarnebidragStepper.BOFORHOLD}
                valideringsfeil={boforholdValideringsFeil}
                unconfirmedUpdates={boforholdIkkeAktiverteEndringer}
            />
            <MenuButton
                step={isBidragV2Enabled ? "7." : "6"}
                title={text.title.samvær}
                interactive={interactive}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.SAMVÆR])}
                active={activeButton === BarnebidragStepper.SAMVÆR}
                valideringsfeil={samværValideringsFeil}
            />
            <MenuButton
                step={isBidragV2Enabled ? "8." : "7"}
                title={text.title.vedtak}
                onStepChange={() => onStepChange(STEPS[BarnebidragStepper.VEDTAK])}
                active={activeButton === BarnebidragStepper.VEDTAK}
            />
        </SideMenu>
    );
};
