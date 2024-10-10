import { NavigationLoaderWrapper } from "@common/components/NavigationLoaderWrapper";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import PageWrapper from "@common/PageWrapper";
import { Alert, Heading } from "@navikt/ds-react";
import React from "react";

import FormWrapper from "../components/forms/FormWrapper";
import { BarnebidragSideMenu } from "./BarnebidragSideMenu";
export const BarnebidragPage = () => {
    const { erVedtakFattet } = useGetBehandlingV2();

    return (
        <PageWrapper name="tracking-wide">
            <div className="m-auto max-w-[1272px] min-[1440px]:max-w-[1920px] grid grid-cols-[max-content,auto]">
                <BarnebidragSideMenu />
                <div className="w-full p-6 overflow-x-scroll min-[1440px]:overflow-x-visible">
                    {erVedtakFattet && (
                        <Alert variant="info" size="small" className="mb-4 w-max m-auto">
                            <Heading level="3" size="small">
                                Vedtak er fattet
                            </Heading>
                            Vedtak er fattet for behandlingen og kan derfor ikke endres
                        </Alert>
                    )}
                    <NavigationLoaderWrapper>
                        <FormWrapper />
                    </NavigationLoaderWrapper>
                </div>
            </div>
        </PageWrapper>
    );
};
