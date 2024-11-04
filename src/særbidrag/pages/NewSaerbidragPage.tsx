import { NavigationLoaderWrapper } from "@common/components/NavigationLoaderWrapper";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import PageWrapper from "@common/PageWrapper";
import { faro, LogLevel } from "@grafana/faro-react";
import { Alert, Heading } from "@navikt/ds-react";
import React from "react";

import texts from "../../common/constants/texts";
import FormWrapper from "../components/forms/FormWrapper";
import EksterneLenkerKnapper from "./EksterneLenkerKnapper";
import { SaerbidragSideMenu } from "./SaerbidragSideMenu";
export const NewSærbidragPage = () => {
    const { erVedtakFattet, kanBehandlesINyLøsning, id } = useGetBehandlingV2();
    faro.api.pushLog([`Åpner behandling for særbidrag`], {
        level: LogLevel.INFO,
        context: {
            behandlingId: id?.toString() ?? "Ukjent",
        },
    });
    return (
        <PageWrapper name="tracking-wide">
            <div className="m-auto max-w-[1272px] min-[1440px]:max-w-[1920px] grid grid-cols-[max-content,auto]">
                <SaerbidragSideMenu />
                <div className="w-full p-6 overflow-x-scroll min-[1440px]:overflow-x-visible">
                    {erVedtakFattet && (
                        <Alert variant="info" size="small" className="mb-4 w-max m-auto">
                            <Heading level="3" size="small">
                                Vedtak er fattet
                            </Heading>
                            Vedtak er fattet for behandlingen og kan derfor ikke endres
                        </Alert>
                    )}
                    {!kanBehandlesINyLøsning && (
                        <Alert variant="info" size="small" className="mb-4 w-max m-auto">
                            <Heading level="3" size="small">
                                {texts.title.kanIkkeBehandlesGjennomNyLøsning}
                            </Heading>
                            {texts.kanIkkeBehandlesGjennomNyLøsningSærbidrag}
                        </Alert>
                    )}
                    <NavigationLoaderWrapper>
                        <FormWrapper />
                    </NavigationLoaderWrapper>
                </div>
                <EksterneLenkerKnapper />
            </div>
        </PageWrapper>
    );
};
