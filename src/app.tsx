import { TypeBehandling } from "@api/BidragBehandlingApiV1";
import { BidragBehandlingHeader } from "@common/components/header/BidragBehandlingHeader";
import { ErrorModal } from "@common/components/modal/ErrorModal";
import text from "@common/constants/texts";
import { useBehandlingV2 } from "@common/hooks/useApiData";
import useFeatureToogle from "@common/hooks/useFeatureToggle";
import { prefetchVisningsnavn } from "@common/hooks/useVisningsnavn";
import PageWrapper from "@common/PageWrapper";
import { BidragContainer } from "@navikt/bidrag-ui-common";
import { Loader } from "@navikt/ds-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlagProvider, IConfig, useFlagsStatus } from "@unleash/proxy-client-react";
import { scrollToHash } from "@utils/window-utils";
import React, { lazy, PropsWithChildren, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import { BarnebidragProviderWrapper } from "./barnebidrag/context/BarnebidragProviderWrapper";
import { BarnebidragPage } from "./barnebidrag/pages/BarnebidragPage";
import { ForskuddBehandlingProviderWrapper } from "./forskudd/context/ForskuddBehandlingProviderWrapper";
import BrukerveiledningForskudd from "./forskudd/docs/BrukerveiledningForskudd.mdx";
import { ForskuddPage } from "./forskudd/pages/forskudd/ForskuddPage";
import { NewForskuddPage } from "./forskudd/pages/forskudd/NewForskuddPage";
import { SærligeugifterProviderWrapper } from "./særbidrag/context/SærligeugifterProviderWrapper";
import BrukerveiledningSærbidrag from "./særbidrag/docs/BrukerveiledningSærbidrag.mdx";
import { NewSærbidragPage } from "./særbidrag/pages/NewSaerbidragPage";
import { SærbidragPage } from "./særbidrag/pages/SærbidragPage";

const NotatPage = lazy(() => import("./forskudd/pages/notat/NotatPage"));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            retryDelay: 2000,
        },
    },
});
const config: IConfig = {
    url: process.env.UNLEASH_API_URL as string,
    clientKey: process.env.UNLEASH_FRONTEND_TOKEN,
    refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
    appName: "bidrag-behandling-ui",
};
export default function App() {
    // const { reset } = useQueryErrorResetBoundary();
    return (
        <FlagProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <Suspense
                    fallback={
                        <div className="flex justify-center overflow-hidden">
                            <Loader size="3xlarge" title={text.loading} variant="interaction" />
                        </div>
                    }
                >
                    <BrowserRouter>
                        <Routes>
                            <Route path="/sak/:saksnummer/behandling/:behandlingId">
                                <Route index element={<BidragBehandlingWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/behandling/:behandlingId">
                                <Route index element={<BidragBehandlingWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/sak/:saksnummer/vedtak/:vedtakId">
                                <Route
                                    index
                                    element={
                                        <BehandlingPageWrapper>
                                            <VedtakLesemodus />
                                        </BehandlingPageWrapper>
                                    }
                                />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/vedtak/:behandlingId">
                                <Route
                                    index
                                    element={
                                        <BehandlingPageWrapper>
                                            <ForskuddBehandling />
                                        </BehandlingPageWrapper>
                                    }
                                />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route
                                path="/forskudd/brukerveiledning"
                                element={<ForskuddBrukerveiledningPageWrapper />}
                            />
                            <Route
                                path="/sarbidrag/brukerveiledning"
                                element={<SærbidragBrukerveiledningPageWrapper />}
                            />
                            <Route path="/forskudd/:behandlingId">
                                <Route
                                    index
                                    element={
                                        <BehandlingPageWrapper>
                                            <ForskuddBehandling />
                                        </BehandlingPageWrapper>
                                    }
                                />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </Suspense>
            </QueryClientProvider>
        </FlagProvider>
    );
}
function ForskuddBrukerveiledningPageWrapper() {
    useEffect(scrollToHash, []);
    return (
        <PageWrapper name="Forskudd brukerveiledning">
            <BidragContainer className="container p-6 max-w-[60rem]">
                <BrukerveiledningForskudd />
            </BidragContainer>
        </PageWrapper>
    );
}
function SærbidragBrukerveiledningPageWrapper() {
    useEffect(scrollToHash, []);
    return (
        <PageWrapper name="Særbidrag brukerveiledning">
            <BidragContainer className="container p-6 max-w-[60rem]">
                <BrukerveiledningSærbidrag />
            </BidragContainer>
        </PageWrapper>
    );
}
const VedtakLesemodus = () => {
    return <BehandlingPage />;
};

const BehandlingPage = () => {
    const { behandlingId, vedtakId } = useParams<{
        behandlingId?: string;
        vedtakId?: string;
    }>();
    const { type } = useBehandlingV2(behandlingId, vedtakId);

    switch (type) {
        case TypeBehandling.FORSKUDD:
            return <ForskuddBehandling />;
        case TypeBehandling.SAeRBIDRAG:
            return <SærligeutgifterBehandling />;
        case TypeBehandling.BIDRAG:
            return <BarnebidragBehandling />;
        default:
            return null;
    }
};
const ForskuddBehandling = () => {
    const { isbehandlingVesntremenyEnabled } = useFeatureToogle();
    return (
        <ForskuddBehandlingProviderWrapper>
            <BidragBehandlingHeader />
            {isbehandlingVesntremenyEnabled && <NewForskuddPage />}
            {!isbehandlingVesntremenyEnabled && <ForskuddPage />}
            <ErrorModal />
        </ForskuddBehandlingProviderWrapper>
    );
};
const SærligeutgifterBehandling = () => {
    const { isbehandlingVesntremenyEnabled } = useFeatureToogle();
    return (
        <SærligeugifterProviderWrapper>
            <BidragBehandlingHeader />
            {isbehandlingVesntremenyEnabled && <NewSærbidragPage />}
            {!isbehandlingVesntremenyEnabled && <SærbidragPage />}
            <ErrorModal />
        </SærligeugifterProviderWrapper>
    );
};

const BarnebidragBehandling = () => {
    return (
        <BarnebidragProviderWrapper>
            <BidragBehandlingHeader />
            <BarnebidragPage />
            <ErrorModal />
        </BarnebidragProviderWrapper>
    );
};

const BehandlingPageWrapper = ({ children }: PropsWithChildren) => {
    prefetchVisningsnavn();
    const { flagsReady, flagsError } = useFlagsStatus();

    if (!flagsReady && flagsError === false) {
        return (
            <div className="flex justify-center overflow-hidden">
                <Loader size="3xlarge" title={text.loading} variant="interaction" />
            </div>
        );
    }

    return children;
};
const BidragBehandlingWrapper = () => {
    const { behandlingId } = useParams<{ behandlingId?: string }>();
    const { type } = useBehandlingV2(behandlingId);

    const getBehandling = (type: TypeBehandling) => {
        switch (type) {
            case TypeBehandling.FORSKUDD:
                return <ForskuddBehandling />;
            case TypeBehandling.SAeRBIDRAG:
                return <SærligeutgifterBehandling />;
            case TypeBehandling.BIDRAG:
                return <BarnebidragBehandling />;
            default:
                return null;
        }
    };

    return <BehandlingPageWrapper>{getBehandling(type)}</BehandlingPageWrapper>;
};

const NotatPageWrapper = () => {
    const { behandlingId, vedtakId } = useParams<{ behandlingId?: string; vedtakId?: string }>();
    return <NotatPage behandlingId={behandlingId} vedtakId={vedtakId} />;
};
