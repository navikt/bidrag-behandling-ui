import { BarnDto } from "@api/BidragBehandlingApiV1";
import { AddBarnForm } from "@common/components/AddBarnForm";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { PlusIcon } from "@navikt/aksel-icons";
import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, Button, Heading, HStack, Label, Loader, VStack } from "@navikt/ds-react";
import React, { useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { ConfirmationModal } from "../../../../common/components/modal/ConfirmationModal";
import SakLenke from "../../../../common/components/SakLenke";
import { useRefetchFFInfoFn } from "../../../../common/hooks/useApiData";
import { useOnCreatePrivatAvtale } from "../../../hooks/useOnCreatePrivatAvtale";
import { useOnDeletePrivatAvtale } from "../../../hooks/useOnDeletePrivatAvtale";
import { PrivatAvtaleFormValue, PrivatAvtaleFormValues } from "../../../types/privatAvtaleFormValues";
import { createPrivatAvtaleInitialValues } from "../helpers/PrivatAvtaleHelpers";
import { DeleteButton } from "../underholdskostnad/Barnetilsyn";
import PrivatAvtaleAndreBarnLeggTilSak from "./PrivatAvtaleAndreBarnLeggTilSak";
import { PrivatAvtalePerioder } from "./PrivatAvtalePerioder";

export const PrivatAvtaleAndreBarn = ({ initialValues }: { initialValues: PrivatAvtaleFormValues }) => {
    const { setSaveErrorState, lesemodus } = useBehandlingProvider();
    const { control, setValue } = useFormContext<PrivatAvtaleFormValues>();
    const [openForm, setOpenForm] = useState<boolean>(false);
    const fieldArray = useFieldArray({
        control,
        name: "andreBarn",
    });
    const watchFieldArray = useWatch({ control, name: "andreBarn" });
    const andreBarnFieldArray = fieldArray.fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });
    const deletePrivatAvtale = useOnDeletePrivatAvtale();

    const createPrivatAvtale = useOnCreatePrivatAvtale();
    const refetchFFInfo = useRefetchFFInfoFn();

    const onCreatePrivatAvtale = (item: PrivatAvtaleFormValue, index?: number) => {
        const payload: BarnDto = {
            personident: item.gjelderBarn.ident,
            navn: item.gjelderBarn.navn,
            fødselsdato: item.gjelderBarn.fødselsdato,
        };

        createPrivatAvtale.mutation.mutate(payload, {
            onSuccess: (response) => {
                if (index !== undefined) {
                    setValue(
                        `andreBarn.${index}.privatAvtale`,
                        createPrivatAvtaleInitialValues(response.oppdatertPrivatAvtale)
                    );
                } else {
                    fieldArray.append({
                        ...item,
                        lagtTilManuelt: true,
                        privatAvtale: createPrivatAvtaleInitialValues(response.oppdatertPrivatAvtale),
                    });
                }

                createPrivatAvtale.queryClientUpdater((currentData) => ({
                    ...currentData,
                    privatAvtaleV2: {
                        ...currentData.privatAvtaleV2,
                        andreBarn: {
                            ...currentData.privatAvtaleV2.andreBarn,
                            barn: currentData.privatAvtaleV2.andreBarn.barn.concat(response.oppdatertPrivatAvtale),
                        },
                    },
                }));
                refetchFFInfo();
                setOpenForm(false);
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onCreatePrivatAvtale(item, index),
                });
            },
        });
    };

    const onDeletePrivatAvtale = (item: PrivatAvtaleFormValue, index: number) => {
        deletePrivatAvtale.mutation.mutate(item.privatAvtale.avtaleId, {
            onSuccess: () => {
                fieldArray.remove(index);
                deletePrivatAvtale.queryClientUpdater((currentData) => ({
                    ...currentData,
                    privatAvtaleV2: {
                        ...currentData.privatAvtaleV2,
                        andreBarn: {
                            ...currentData.privatAvtaleV2.andreBarn,
                            barn: currentData.privatAvtaleV2.andreBarn.barn.filter(
                                (avtale) => avtale.gjelderBarn.ident !== item.gjelderBarn.ident
                            ),
                        },
                    },
                }));
                refetchFFInfo();
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onDeletePrivatAvtale(item, index),
                });
            },
        });
    };
    return (
        <div>
            <div className="mt-2 mb-2">
                {!openForm && !lesemodus && (
                    <Button
                        type="button"
                        onClick={() => setOpenForm(true)}
                        variant="tertiary"
                        iconPosition="left"
                        className="w-max"
                        icon={<PlusIcon />}
                        size="small"
                    >
                        {text.label.leggTilBarn}
                    </Button>
                )}
                {openForm && (
                    <AddBarnForm
                        setOpenAddBarnForm={setOpenForm}
                        showFritekst={false}
                        onSave={(barn) =>
                            onCreatePrivatAvtale({
                                gjelderBarn: {
                                    ident: barn.personident,
                                    fødselsdato: barn.fødselsdato,
                                    navn: barn.navn,
                                },
                                harLøpendeBidrag: false,
                                privatAvtale: null,
                            })
                        }
                    />
                )}
            </div>
            {andreBarnFieldArray.length < 1 && <BodyShort>{text.description.ingenBarn}</BodyShort>}
            <React.Suspense
                fallback={
                    <VStack gap="2" align="center">
                        <Loader size="medium" />
                    </VStack>
                }
            >
                <VStack gap="2">
                    {andreBarnFieldArray.map((privatAvtale, index) => {
                        return (
                            <PrivatAvtaleAnnenBarnDetaljer
                                key={privatAvtale.gjelderBarn?.ident}
                                item={privatAvtale}
                                barnIndex={index}
                                initialValues={initialValues}
                                onCreatePrivatAvtale={onCreatePrivatAvtale}
                                onDeletePrivatAvtale={onDeletePrivatAvtale}
                            />
                        );
                    })}
                </VStack>
            </React.Suspense>
        </div>
    );
};

function PrivatAvtaleAnnenBarnDetaljer({
    item,
    barnIndex,
    initialValues,
    onCreatePrivatAvtale,
    onDeletePrivatAvtale,
}: {
    onDeletePrivatAvtale: (item: PrivatAvtaleFormValue, index?: number) => void;
    onCreatePrivatAvtale: (item: PrivatAvtaleFormValue, index?: number) => void;
    item: PrivatAvtaleFormValue;
    barnIndex: number;
    initialValues: PrivatAvtaleFormValues;
}) {
    function renderBarnUtenLøpendeBidragDetaljer() {
        if (item.harLøpendeBidrag) return;
        if (!item.saksnummer) {
            return (
                <Box background="surface-subtle" padding="space-16">
                    <PrivatAvtaleAndreBarnLeggTilSak item={item} />
                </Box>
            );
        }
        return (
            <Box background="surface-subtle" padding="space-16">
                <HStack gap="2">
                    <HStack className="flex gap-x-2">
                        <Label size="small">Tilhører sak: </Label>
                        <BodyShort size="small">
                            <SakLenke saksnummer={item.saksnummer} />
                        </BodyShort>
                    </HStack>
                    <HStack className="flex gap-x-2">
                        <Label size="small">Enhet: </Label>
                        <BodyShort size="small">{item.enhet}</BodyShort>
                    </HStack>
                </HStack>
            </Box>
        );
    }
    return (
        <Box
            background="surface-default"
            padding="space-12"
            borderRadius="xlarge"
            borderColor="border-subtle"
            borderWidth="1"
        >
            <VStack gap="2">
                <RolleInfoBox item={item} onDelete={() => onDeletePrivatAvtale(item, barnIndex)} />
                {renderBarnUtenLøpendeBidragDetaljer()}
                {!item.privatAvtale?.avtaleId && (
                    <Button
                        type="button"
                        onClick={() => onCreatePrivatAvtale(item, barnIndex)}
                        variant="tertiary"
                        size="small"
                        className="w-fit"
                        disabled={false}
                    >
                        {text.label.opprettePrivatAvtale}
                    </Button>
                )}
                {item.privatAvtale?.avtaleId && (
                    <PrivatAvtalePerioder
                        prefix="andreBarn"
                        initialValues={initialValues}
                        item={item}
                        barnIndex={barnIndex}
                    />
                )}
            </VStack>
        </Box>
    );
}
export const RolleInfoBox = ({ onDelete, item }: { onDelete?: () => void; item: PrivatAvtaleFormValue }) => {
    const ref = useRef<HTMLDialogElement>(null);

    const onConfirm = () => {
        ref.current?.close();
        onDelete();
    };

    return (
        <>
            <div className="grid grid-cols-[max-content,auto] items-center p-2 bg-white border border-solid border-[var(--a-border-default)]">
                <div className="flex">
                    <PersonNavnIdent
                        ident={item.gjelderBarn.ident}
                        navn={item.gjelderBarn.navn}
                        fødselsdato={item.gjelderBarn.fødselsdato}
                    />
                </div>
                {item.lagtTilManuelt && (
                    <>
                        <div className="flex items-center justify-end">
                            <DeleteButton onDelete={() => ref.current?.showModal()} />
                        </div>
                        <ConfirmationModal
                            ref={ref}
                            closeable
                            description={"Ønsker du å slette barnet?"}
                            heading={<Heading size="small">{text.varsel.ønskerDuÅSlette}</Heading>}
                            footer={
                                <>
                                    <Button type="button" onClick={onConfirm} size="small">
                                        {text.label.jaSlett}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="small"
                                        onClick={() => ref.current?.close()}
                                    >
                                        {text.label.avbryt}
                                    </Button>
                                </>
                            }
                        />
                    </>
                )}
            </div>
        </>
    );
};
