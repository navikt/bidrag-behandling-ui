import { Vedtakstype } from "@api/BidragBehandlingApiV1";
import text from "@common/constants/texts";
import { BehandlingProvider } from "@common/context/BehandlingContext";
import { useBehandlingV2 } from "@common/hooks/useApiData";
import React, { PropsWithChildren, useState } from "react";
import { useParams } from "react-router-dom";

import { STEPS as ForskuddSteps } from "../constants/steps";
import { ForskuddStepper } from "../enum/ForskuddStepper";

export type InntektTables =
    | `småbarnstillegg.${string}`
    | `utvidetBarnetrygd.${string}`
    | `årsinntekter.${string}`
    | `barnetillegg.${string}.${string}`
    | `kontantstøtte.${string}.${string}`;

type HusstandsbarnTables = "andreVoksneIHusstanden" | "sivilstand" | "newBarn" | `husstandsbarn.${string}`;

export type PageErrorsOrUnsavedState = {
    virkningstidspunkt: { error: boolean };
    boforhold: {
        error: boolean;
        openFields?: { [_key in HusstandsbarnTables]: boolean };
    };
    inntekt: {
        error: boolean;
        openFields?: {
            [_key in InntektTables]: boolean;
        };
    };
};

function ForskuddBehandlingProviderWrapper({ children }: PropsWithChildren) {
    const { behandlingId, vedtakId } = useParams<{
        behandlingId?: string;
        vedtakId?: string;
    }>();
    const behandling = useBehandlingV2(behandlingId, vedtakId);
    const [pageErrorsOrUnsavedState, setPageErrorsOrUnsavedState] = useState<PageErrorsOrUnsavedState>({
        virkningstidspunkt: { error: false },
        boforhold: { error: false },
        inntekt: { error: false },
    });
    const formSteps = { defaultStep: ForskuddStepper.VIRKNINGSTIDSPUNKT, steps: ForskuddSteps };

    function getPageErrorTexts(): { title: string; description: string } {
        if (pageErrorsOrUnsavedState.virkningstidspunkt.error) {
            return {
                title: "Det er ikke lagt inn dato på virkningstidspunkt",
                description: "Hvis det ikke settes inn en dato vil virkningsdatoen settes til forrige lagrede dato",
            };
        } else {
            return {
                title: text.varsel.statusIkkeLagret,
                description: text.varsel.statusIkkeLagretDescription,
            };
        }
    }

    const sideMenu = [
        {
            step: ForskuddStepper.VIRKNINGSTIDSPUNKT,
            visible: true,
            interactive: true,
        },
        {
            step: ForskuddStepper.BOFORHOLD,
            visible: true,
            interactive: !behandling.virkningstidspunktV2[0]?.avslag && behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: ForskuddStepper.INNTEKT,
            visible: true,
            interactive: !behandling.virkningstidspunktV2[0]?.avslag && behandling.vedtakstype !== Vedtakstype.OPPHOR,
        },
        {
            step: ForskuddStepper.VEDTAK,
            visible: true,
            interactive: true,
        },
    ];

    const value = React.useMemo(
        () => ({
            formSteps,
            getPageErrorTexts,
            pageErrorsOrUnsavedState,
            setPageErrorsOrUnsavedState,
            sideMenu,
        }),
        [
            JSON.stringify(pageErrorsOrUnsavedState),
            JSON.stringify(sideMenu),
            behandling.virkningstidspunktV2[0].avslag,
            behandling.vedtakstype,
        ]
    );

    return <BehandlingProvider props={value}>{children}</BehandlingProvider>;
}

export { ForskuddBehandlingProviderWrapper };
