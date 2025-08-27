import { Vedtakstype } from "@api/BidragBehandlingApiV1";
import text from "@common/constants/texts";
import { BehandlingProvider } from "@common/context/BehandlingContext";
import { useBehandlingV2 } from "@common/hooks/useApiData";
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import React, { PropsWithChildren, useState } from "react";
import { useParams } from "react-router-dom";

import { STEPS as BarnebidragSteps, STEPS } from "../constants/steps";
import { BarnebidragStepper } from "../enum/BarnebidragStepper";

export type InntektTables =
    | `småbarnstillegg.${string}`
    | `utvidetBarnetrygd.${string}`
    | `årsinntekter.${string}`
    | `barnetillegg.${string}`
    | `kontantstøtte.${string}`;

export type UnderholdskostnadTables =
    | `underholdskostnaderMedIBehandling.${number}.stønadTilBarnetilsyn`
    | `underholdskostnaderMedIBehandling.${number}.faktiskTilsynsutgift`
    | `underholdskostnaderMedIBehandling.${number}.tilleggsstønad`
    | `underholdskostnaderAndreBarn.${number}.faktiskTilsynsutgift`;

type HusstandsbarnTables = "andreVoksneIHusstanden" | "sivilstand" | "newBarn" | `husstandsbarn.${string}`;

export type BarnebidragPageErrorsOrUnsavedState = {
    boforhold: {
        error: boolean;
        openFields?: {
            [_key in HusstandsbarnTables]: boolean;
        };
    };
    samvær: {
        error: boolean;
        openFields?: boolean;
    };
    inntekt: {
        error: boolean;
        openFields?: {
            [_key in InntektTables]: boolean;
        };
    };
    underholdskostnad: {
        error: boolean;
        openFields?: {
            [_key: UnderholdskostnadTables]: boolean;
        };
    };
    privatAvtale: {
        error: boolean;
        openFields?: boolean;
    };
};

function BarnebidragProviderWrapper({ children }: PropsWithChildren) {
    const { isBidragV2Enabled } = useFeatureToogle();
    const { behandlingId, vedtakId } = useParams<{
        behandlingId?: string;
        vedtakId?: string;
    }>();
    const behandling = useBehandlingV2(behandlingId, vedtakId);
    const [pageErrorsOrUnsavedState, setPageErrorsOrUnsavedState] = useState<BarnebidragPageErrorsOrUnsavedState>({
        underholdskostnad: { error: false },
        boforhold: { error: false },
        samvær: { error: false },
        inntekt: { error: false },
        privatAvtale: { error: false },
    });
    const formSteps = { defaultStep: BarnebidragStepper.VIRKNINGSTIDSPUNKT, steps: BarnebidragSteps };

    const orkestrertVedtak =
        behandling.lesemodus != null ? behandling.lesemodus.erOrkestrertVedtak : behandling.erKlageEllerOmgjøring;
    const sideMenu = [
        {
            step: BarnebidragStepper.VIRKNINGSTIDSPUNKT,
            visible:
                !(
                    behandling.vedtakstype === Vedtakstype.ALDERSJUSTERING &&
                    behandling.lesemodus &&
                    behandling.lesemodus?.opprettetAvBatch &&
                    (behandling.erVedtakUtenBeregning || !behandling.erBisysVedtak)
                ) && behandling.vedtakstype !== Vedtakstype.INDEKSREGULERING,
            interactive: true,
        },
        {
            step: BarnebidragStepper.PRIVAT_AVTALE,
            visible:
                isBidragV2Enabled &&
                behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                !(behandling.erVedtakUtenBeregning && behandling.lesemodus),
            interactive:
                !behandling.erBisysVedtak &&
                !behandling.virkningstidspunkt.avslag &&
                behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: BarnebidragStepper.UNDERHOLDSKOSTNAD,
            visible:
                !(
                    behandling.erVedtakUtenBeregning &&
                    behandling.lesemodus &&
                    behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING
                ) &&
                !(
                    behandling.vedtakstype === Vedtakstype.ALDERSJUSTERING &&
                    behandling.erVedtakUtenBeregning &&
                    behandling.lesemodus &&
                    (behandling.lesemodus?.opprettetAvBatch || behandling.lesemodus?.erAvvist)
                ),
            interactive:
                !behandling.virkningstidspunkt.avslag &&
                behandling.vedtakstype !== Vedtakstype.OPPHOR &&
                !behandling.erVedtakUtenBeregning,
        },
        {
            step: BarnebidragStepper.INNTEKT,
            visible:
                behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                !(behandling.erVedtakUtenBeregning && behandling.lesemodus),
            interactive: !behandling.virkningstidspunkt?.avslag && behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: BarnebidragStepper.GEBYR,
            visible:
                behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                !(behandling.erVedtakUtenBeregning && behandling.lesemodus),
            interactive: !!behandling.gebyr?.gebyrRoller.length,
        },
        {
            step: BarnebidragStepper.BOFORHOLD,
            visible:
                behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                !(behandling.erVedtakUtenBeregning && behandling.lesemodus),
            interactive: !behandling.virkningstidspunkt?.avslag && behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: BarnebidragStepper.SAMVÆR,
            visible:
                behandling.vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                !(behandling.erVedtakUtenBeregning && behandling.lesemodus),
            interactive: !behandling.virkningstidspunkt?.avslag && behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: BarnebidragStepper.VEDTAK,
            visible: !orkestrertVedtak,
            interactive: true,
        },
        {
            step: BarnebidragStepper.KLAGEVEDTAK,
            visible: orkestrertVedtak,
            interactive: true,
        },
        {
            step: BarnebidragStepper.VEDTAK_ENDELIG,
            visible: orkestrertVedtak,
            interactive: true,
        },
    ];

    function getPageErrorTexts(): { title: string; description: string } {
        return {
            title: text.varsel.statusIkkeLagret,
            description: text.varsel.statusIkkeLagretDescription,
        };
    }

    const value = React.useMemo(
        () => ({
            formSteps,
            getPageErrorTexts,
            pageErrorsOrUnsavedState,
            setPageErrorsOrUnsavedState,
            sideMenu,
            stepsIndex: STEPS,
        }),
        [
            JSON.stringify(pageErrorsOrUnsavedState),
            behandling.gebyr?.gebyrRoller,
            behandling.vedtakstype,
            behandling.virkningstidspunkt?.avslag,
            behandling.erVedtakUtenBeregning,
            behandling.lesemodus,
            behandling.lesemodus?.opprettetAvBatch,
            behandling.lesemodus?.erAvvist,
            behandling.erBisysVedtak,
        ]
    );

    return <BehandlingProvider props={value}>{children}</BehandlingProvider>;
}

export { BarnebidragProviderWrapper };
