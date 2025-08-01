import { Kilde } from "@api/BidragBehandlingApiV1";
import { Rolletype } from "@api/BidragDokumentProduksjonApi";
import { AddBarnForm } from "@common/components/boforhold/AddBarnForm";
import { Perioder } from "@common/components/boforhold/Perioder";
import { RemoveButton } from "@common/components/boforhold/RemoveButton";
import { RolleTag } from "@common/components/RolleTag";
import elementIds from "@common/constants/elementIds";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { useOnSaveBoforhold } from "@common/hooks/useOnSaveBoforhold";
import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { Box, Button, Heading } from "@navikt/ds-react";
import React, { Fragment, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { BoforholdFormValues } from "../../types/boforholdFormValues";

export const BarnPerioder = () => {
    const { setPageErrorsOrUnsavedState, lesemodus, setSaveErrorState } = useBehandlingProvider();
    const saveBoforhold = useOnSaveBoforhold();
    const [openAddBarnForm, setOpenAddBarnForm] = useState(false);
    const { control, getValues } = useFormContext<BoforholdFormValues>();
    const barnFieldArray = useFieldArray({
        control,
        name: "husstandsbarn",
    });
    const watchFieldArray = useWatch({ control, name: "husstandsbarn" });
    const controlledFields = barnFieldArray.fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });

    const onOpenAddBarnForm = () => {
        setOpenAddBarnForm(true);
        setPageErrorsOrUnsavedState((state) => ({
            ...state,
            boforhold: {
                ...state.boforhold,
                openFields: { ...state.boforhold.openFields, newBarn: true },
            },
        }));
    };

    const onRemoveBarn = (index: number) => {
        const barn = getValues(`husstandsbarn.${index}`);

        saveBoforhold.mutation.mutate(
            { oppdatereHusstandsmedlem: { slettHusstandsmedlem: barn.id } },
            {
                onSuccess: (response) => {
                    barnFieldArray.remove(index);
                    saveBoforhold.queryClientUpdater((currentData) => {
                        return {
                            ...currentData,
                            boforhold: {
                                ...currentData.boforhold,
                                egetBarnErEnesteVoksenIHusstanden: response.egetBarnErEnesteVoksenIHusstanden,
                                husstandsbarn: currentData.boforhold.husstandsbarn.filter((b) => b.id !== barn.id),
                                beregnetBoforhold: response.beregnetBoforhold,
                            },
                        };
                    });

                    setPageErrorsOrUnsavedState((state) => {
                        const openFields = { ...state.boforhold.openFields };
                        delete openFields[`husstandsbarn.${index}`];

                        return {
                            ...state,
                            boforhold: {
                                ...state.boforhold,
                                openFields,
                            },
                        };
                    });
                },
                onError: () => {
                    setSaveErrorState({
                        error: true,
                        retryFn: () => onRemoveBarn(index),
                        rollbackFn: () => {},
                    });
                },
            }
        );
    };

    return (
        <Box background="surface-subtle" className="grid gap-2 py-2 px-4">
            <Heading level="2" size="small">
                {text.title.barn}
            </Heading>
            <div className="grid gap-4">
                {controlledFields.map((item, index) => (
                    <Fragment key={item.id}>
                        <Box
                            background="surface-subtle"
                            className="overflow-hidden grid gap-2"
                            id={`${elementIds.seksjon_boforhold}_${item.id}`}
                        >
                            <div className="grid grid-cols-[max-content,max-content,auto] p-2 bg-white border border-[var(--a-border-default)]">
                                <div>{item.medIBehandling && <RolleTag rolleType={Rolletype.BA} />}</div>
                                <div className="flex items-center gap-4">
                                    <PersonNavnIdent
                                        navn={item.navn}
                                        ident={item.medIBehandling ? item.ident : null}
                                        fødselsdato={item.fødselsdato}
                                    />
                                </div>
                                {!item.medIBehandling && !lesemodus && item.kilde === Kilde.MANUELL && (
                                    <RemoveButton index={index} onRemoveBarn={onRemoveBarn} />
                                )}
                            </div>
                            <Perioder barnIndex={index} />
                        </Box>
                    </Fragment>
                ))}
                {openAddBarnForm && (
                    <AddBarnForm setOpenAddBarnForm={setOpenAddBarnForm} barnFieldArray={barnFieldArray} />
                )}
                {!openAddBarnForm && !lesemodus && (
                    <Button
                        variant="secondary"
                        type="button"
                        size="small"
                        className="w-fit"
                        onClick={onOpenAddBarnForm}
                    >
                        + Legg til barn
                    </Button>
                )}
            </div>
        </Box>
    );
};
