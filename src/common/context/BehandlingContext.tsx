import { TypeBehandling } from "@api/BidragBehandlingApiV1";
import ErrorConfirmationModal from "@common/components/ErrorConfirmationModal";
import { ConfirmationModal } from "@common/components/modal/ConfirmationModal";
import text from "@common/constants/texts";
import { useBehandlingV2 } from "@common/hooks/useApiData";
import { XMarkOctagonFillIcon } from "@navikt/aksel-icons";
import { Button, Heading } from "@navikt/ds-react";
import { dateOrNull, firstDayOfMonth, isAfterEqualsDate } from "@utils/date-utils";
import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { STEPS as ForskuddSteps } from "../../forskudd/constants/steps";
import { ForskuddStepper } from "../../forskudd/enum/ForskuddStepper";
import { STEPS as SærligeutgifterSteps } from "../../særligeutgifter/constants/steps";
import { SærligeutgifterStepper } from "../../særligeutgifter/enum/SærligeutgifterStepper";

export type InntektTables =
    | "småbarnstillegg"
    | "utvidetBarnetrygd"
    | `årsinntekter.${string}`
    | `barnetillegg.${string}`
    | `kontantstøtte.${string}`;

type HusstandsbarnTables = "sivilstand" | "newBarn" | `husstandsbarn.${string}`;

export type PageErrorsOrUnsavedState = {
    virkningstidspunkt: { error: boolean };
    boforhold: {
        error: boolean;
        openFields?: { [key in HusstandsbarnTables]: boolean };
    };
    inntekt: {
        error: boolean;
        openFields?: {
            [key in InntektTables]: boolean;
        };
    };
};

interface SaveErrorState {
    error: boolean;
    retryFn?: () => void;
    rollbackFn?: () => void;
}
interface IBehandlingContext {
    activeStep: string;
    behandlingId: string;
    vedtakId: string;
    lesemodus: boolean;
    erVedtakFattet: boolean;
    erVirkningstidspunktNåværendeMånedEllerFramITid: boolean;
    saksnummer?: string;
    errorMessage: { title: string; text: string };
    errorModalOpen: boolean;
    setErrorMessage: (message: { title: string; text: string }) => void;
    setErrorModalOpen: (open: boolean) => void;
    pageErrorsOrUnsavedState: PageErrorsOrUnsavedState;
    setPageErrorsOrUnsavedState: Dispatch<SetStateAction<PageErrorsOrUnsavedState>>;
    setSaveErrorState: Dispatch<SetStateAction<SaveErrorState>>;
    onStepChange: (x: number) => void;
}

export const BehandlingContext = createContext<IBehandlingContext | null>(null);

const getStepsConfByBehandling = (behandlingType: TypeBehandling) => {
    switch (behandlingType) {
        case TypeBehandling.FORSKUDD:
            return { defaultStep: ForskuddStepper.VIRKNINGSTIDSPUNKT, steps: ForskuddSteps };
        case TypeBehandling.SAeRLIGEUTGIFTER:
            return { defaultStep: SærligeutgifterStepper.UTGIFTER, steps: SærligeutgifterSteps };
    }
};

function BehandlingProvider({ children }: PropsWithChildren) {
    const { behandlingId, saksnummer, vedtakId } = useParams<{
        behandlingId?: string;
        saksnummer?: string;
        vedtakId?: string;
    }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [saveErrorState, setSaveErrorState] = useState<SaveErrorState | undefined>();
    const [pageErrorsOrUnsavedState, setPageErrorsOrUnsavedState] = useState<PageErrorsOrUnsavedState>({
        virkningstidspunkt: { error: false },
        boforhold: { error: false },
        inntekt: { error: false },
    });
    const [errorMessage, setErrorMessage] = useState<{ title: string; text: string }>(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const behandling = useBehandlingV2(behandlingId, vedtakId);
    const { defaultStep, steps } = getStepsConfByBehandling(behandling.type);
    const activeStep = searchParams.get("steg") ?? defaultStep;
    const setActiveStep = useCallback((x: number) => {
        searchParams.delete("steg");
        setSearchParams([...searchParams.entries(), ["steg", Object.keys(steps).find((k) => steps[k] === x)]]);
    }, []);

    const queryLesemodus = searchParams.get("lesemodus") == "true";
    const [nextStep, setNextStep] = useState<number>(undefined);
    const ref = useRef<HTMLDialogElement>(null);
    const erVirkningstidspunktNåværendeMånedEllerFramITid = isAfterEqualsDate(
        dateOrNull(behandling.virkningstidspunkt.virkningstidspunkt),
        firstDayOfMonth(new Date())
    );
    const onConfirm = () => {
        ref.current?.close();
        setActiveStep(nextStep);
        setPageErrorsOrUnsavedState({ ...pageErrorsOrUnsavedState, [activeStep]: { error: false } });
    };

    const onStepChange = (x: number) => {
        const currentPageErrors = pageErrorsOrUnsavedState[activeStep];

        if (
            currentPageErrors &&
            (currentPageErrors.error ||
                (currentPageErrors.openFields && Object.values(currentPageErrors.openFields).some((open) => open)))
        ) {
            setNextStep(x);
            ref.current?.showModal();
        } else {
            setActiveStep(x);
        }
    };

    const value = React.useMemo(
        () => ({
            activeStep,
            behandlingId,
            vedtakId,
            erVirkningstidspunktNåværendeMånedEllerFramITid,
            lesemodus: vedtakId != null || behandling.erVedtakFattet || queryLesemodus,
            erVedtakFattet: behandling.erVedtakFattet,
            saksnummer,
            errorMessage,
            setErrorMessage,
            errorModalOpen,
            setErrorModalOpen,
            pageErrorsOrUnsavedState,
            setPageErrorsOrUnsavedState,
            setSaveErrorState,
            onConfirm,
            onStepChange,
        }),
        [activeStep, behandlingId, vedtakId, saksnummer, errorMessage, errorModalOpen, pageErrorsOrUnsavedState]
    );

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
    return (
        <BehandlingContext.Provider value={value}>
            <ConfirmationModal
                ref={ref}
                closeable
                description={getPageErrorTexts().description}
                heading={
                    <Heading size="small" className="flex gap-x-1.5 items-center">
                        <XMarkOctagonFillIcon title="a11y-title" fontSize="1.5rem" color="var(--a-icon-danger)" />
                        {getPageErrorTexts().title}
                    </Heading>
                }
                footer={
                    <>
                        <Button type="button" onClick={() => ref.current?.close()} size="small">
                            {text.label.tilbakeTilUtfylling}
                        </Button>
                        <Button type="button" variant="secondary" size="small" onClick={onConfirm}>
                            {text.label.gåVidereUtenÅLagre}
                        </Button>
                    </>
                }
            />
            <ErrorConfirmationModal
                onConfirm={saveErrorState?.retryFn}
                onCancel={saveErrorState?.rollbackFn}
                onClose={() => setSaveErrorState({ error: false })}
                open={saveErrorState?.error}
            />
            {children}
        </BehandlingContext.Provider>
    );
}
function useBehandlingProvider() {
    const context = useContext(BehandlingContext);
    if (!context) {
        throw new Error("useBehandlingProvider must be used within a BehandlingProvider");
    }
    return context;
}

export { BehandlingProvider, useBehandlingProvider };
