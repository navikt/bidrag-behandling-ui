import { Rolletype } from "@api/BidragDokumentProduksjonApi";
import { AndreVoksneIHusstanden } from "@common/components/boforhold/andrevoksneihusstanden/AndreVoksneIHusstanden";
import { BarnPerioder } from "@common/components/boforhold/BarnPerioder";
import { NyOpplysningerAlert } from "@common/components/boforhold/BoforholdOpplysninger";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import text from "@common/constants/texts";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useVirkningsdato } from "@common/hooks/useVirkningsdato";
import { Heading } from "@navikt/ds-react";
import { scrollToHash } from "@utils/window-utils";
import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import BeregnetBoforhold from "../../../../common/components/boforhold/BeregnetBoforhold";
import { createInitialValues } from "../helpers/BoforholdFormHelpers";
import { Begrunnelse } from "./Begrunnelse";

const Main = () => {
    useEffect(scrollToHash, []);

    return (
        <>
            <Heading level="2" size="small">
                {text.title.BP}
            </Heading>
            <BarnPerioder />

            <AndreVoksneIHusstanden />

            <BeregnetBoforhold />
        </>
    );
};

const BoforholdsForm = () => {
    const { boforhold, roller } = useGetBehandlingV2();
    const virkningsOrSoktFraDato = useVirkningsdato();
    const barnMedISaken = useMemo(() => roller.filter((rolle) => rolle.rolletype === Rolletype.BA), [roller]);
    const initialValues = useMemo(
        () => createInitialValues(boforhold),
        [boforhold, virkningsOrSoktFraDato, barnMedISaken]
    );

    const useFormMethods = useForm({
        defaultValues: initialValues,
        criteriaMode: "all",
    });

    return (
        <FormProvider {...useFormMethods}>
            <form onSubmit={(e) => e.preventDefault()}>
                <NewFormLayout
                    title={text.title.boforhold}
                    main={<Main />}
                    side={<Begrunnelse />}
                    pageAlert={<NyOpplysningerAlert />}
                />
            </form>
        </FormProvider>
    );
};

export default () => {
    return (
        <QueryErrorWrapper>
            <BoforholdsForm />
        </QueryErrorWrapper>
    );
};
