import { TypeBehandling } from "@api/BidragBehandlingApiV1";
import { BidragBehandlingHeader } from "@common/components/header/BidragBehandlingHeader";
import { ErrorModal } from "@common/components/modal/ErrorModal";
import text from "@common/constants/texts";
import { BehandlingProvider } from "@common/context/BehandlingContext";
import { useBehandlingV2 } from "@common/hooks/useApiData";
import { prefetchVisningsnavn } from "@common/hooks/useVisningsnavn";
import PageWrapper from "@common/PageWrapper";
import { BidragContainer } from "@navikt/bidrag-ui-common";
import { Loader } from "@navikt/ds-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlagProvider, IConfig, useFlagsStatus } from "@unleash/proxy-client-react";
import { scrollToHash } from "@utils/window-utils";
import React, { lazy, PropsWithChildren, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import BrukerveiledningForskudd from "./forskudd/docs/BrukerveiledningForskudd.mdx";
import { ForskuddPage } from "./forskudd/pages/forskudd/ForskuddPage";
import { SærligeufgifterPage } from "./særligeutgifter/pages/SærligeutgifterPage";

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
                        <div className="flex justify-center">
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
                                            <ForskuddBehandling />
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

const ForskuddBehandling = () => (
    <BehandlingProvider>
        <BidragBehandlingHeader />
        <ForskuddPage />
        <ErrorModal />
    </BehandlingProvider>
);

const SærligeutgifterBehandling = () => (
    <BehandlingProvider>
        <BidragBehandlingHeader />
        <SærligeufgifterPage />
        <ErrorModal />
    </BehandlingProvider>
);

const BehandlingPageWrapper = ({ children }: PropsWithChildren) => {
    prefetchVisningsnavn();
    const { flagsReady, flagsError } = useFlagsStatus();

    if (!flagsReady && flagsError == false) {
        return (
            <div className="flex justify-center">
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
            case TypeBehandling.SAeRLIGEUTGIFTER:
                return <SærligeutgifterBehandling />;
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
