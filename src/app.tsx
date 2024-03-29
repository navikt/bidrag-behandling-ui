import { LoggerService } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Button, Heading, Loader } from "@navikt/ds-react";
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "@tanstack/react-query";
import { FlagProvider, IConfig, useFlagsStatus } from "@unleash/proxy-client-react";
import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";

import { ForskuddHeader } from "./components/header/ForskuddHeader";
import { ErrorModal } from "./components/modal/ErrorModal";
import text from "./constants/texts";
import { ForskuddProvider } from "./context/ForskuddContext";
import { prefetchVisningsnavn } from "./hooks/useVisningsnavn";
import { ForskuddPage } from "./pages/forskudd/ForskuddPage";
const NotatPage = lazy(() => import("./pages/notat/NotatPage"));

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
    const { reset } = useQueryErrorResetBoundary();
    return (
        <FlagProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ErrorBoundary
                    onReset={reset}
                    onError={(error, compStack) => {
                        LoggerService.error(
                            `Det skjedde en feil i bidrag-behandling skjermbildet ${error.message} - ${compStack.componentStack}`,
                            error
                        );
                    }}
                    fallbackRender={({ error, resetErrorBoundary }) => (
                        <Alert variant="error" className="w-8/12 m-auto mt-8">
                            <div>
                                <Heading spacing size="small" level="3">
                                    {text.error.feilmelding}
                                </Heading>
                                <BodyShort size="small">Feilmelding: {error.message}</BodyShort>
                                <Button size="small" className="w-max mt-4" onClick={() => resetErrorBoundary()}>
                                    {text.refresh}
                                </Button>
                            </div>
                        </Alert>
                    )}
                >
                    <BrowserRouter>
                        <Routes>
                            <Route path="/sak/:saksnummer/behandling/:behandlingId">
                                <Route index element={<ForskudWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/behandling/:behandlingId">
                                <Route index element={<ForskudWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/sak/:saksnummer/vedtak/:vedtakId">
                                <Route index element={<VedtakLesemodusWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/vedtak/:behandlingId">
                                <Route index element={<VedtakLesemodusWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                            <Route path="/forskudd/:behandlingId">
                                <Route index element={<ForskudWrapper />} />
                                <Route path="notat" element={<NotatPageWrapper />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ErrorBoundary>
            </QueryClientProvider>
        </FlagProvider>
    );
}
function VedtakLesemodusWrapper() {
    const { vedtakId } = useParams<{ vedtakId?: string }>();
    const { flagsReady, flagsError } = useFlagsStatus();

    prefetchVisningsnavn();
    if (!flagsReady && flagsError == false) {
        return (
            <div className="flex justify-center">
                <Loader size="3xlarge" title={text.loading} variant="interaction" />
            </div>
        );
    }
    return (
        <>
            <ForskuddProvider vedtakId={Number(vedtakId)}>
                <ForskuddHeader />
                <ForskuddPage />
                <ErrorModal />
            </ForskuddProvider>
        </>
    );
}
function ForskudWrapper() {
    const { behandlingId } = useParams<{ behandlingId?: string }>();
    const { flagsReady, flagsError } = useFlagsStatus();

    prefetchVisningsnavn();
    if (!flagsReady && flagsError == false) {
        return (
            <div className="flex justify-center">
                <Loader size="3xlarge" title={text.loading} variant="interaction" />
            </div>
        );
    }
    return (
        <>
            <ForskuddProvider behandlingId={Number(behandlingId)}>
                <ForskuddHeader />
                <ForskuddPage />
                <ErrorModal />
            </ForskuddProvider>
        </>
    );
}

const NotatPageWrapper = () => {
    const { behandlingId } = useParams<{ behandlingId?: string }>();
    return (
        <Suspense
            fallback={
                <div className="flex justify-center">
                    <Loader size="3xlarge" title={text.loading} variant="interaction" />
                </div>
            }
        >
            <NotatPage behandlingId={Number(behandlingId)} />
        </Suspense>
    );
};
