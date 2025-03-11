import { Rolletype } from "@api/BidragDokumentProduksjonApi";
import { AndreVoksneIHusstanden } from "@common/components/boforhold/andrevoksneihusstanden/AndreVoksneIHusstanden";
import { BarnPerioder } from "@common/components/boforhold/BarnPerioder";
import BeregnetBoforhold from "@common/components/boforhold/BeregnetBoforhold";
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

import { createInitialValues } from "../helpers/BoforholdFormHelpers";
import { Begrunnelse } from "./Begrunnelse";
import { BoforholdBM } from "./BoforholdBM";

const Main = () => {
    const {
        aktiveGrunnlagsdata: { husstandsmedlemBM },
    } = useGetBehandlingV2();

    useEffect(scrollToHash, []);

    return (
        <>
            {husstandsmedlemBM.length > 0 && (
                <>
                    <Heading level="2" size="medium">
                        {text.title.boforholdBM}
                    </Heading>
                    <BoforholdBM />
                </>
            )}
            <div>
                <Heading level="2" size="medium">
                    {text.title.boforholdBp}
                </Heading>
                <Heading level="3" size="small">
                    {text.label.barn}
                </Heading>
            </div>
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
                <NewFormLayout main={<Main />} side={<Begrunnelse />} pageAlert={<NyOpplysningerAlert />} />
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
