import { BarnDto, OppdaterePrivatAvtaleRequest, Rolletype } from "@api/BidragBehandlingApiV1";
import { ActionButtons } from "@common/components/ActionButtons";
import { CustomTextareaEditor } from "@common/components/CustomEditor";
import { FormControlledCustomTextareaEditor } from "@common/components/formFields/FormControlledCustomTextEditor";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import { FormControlledSwitch } from "@common/components/formFields/FormControlledSwitch";
import { FlexRow } from "@common/components/layout/grid/FlexRow";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import PersonNavnIdent from "@common/components/PersonNavnIdent";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { RolleTag } from "@common/components/RolleTag";
import { default as urlSearchParams } from "@common/constants/behandlingQueryKeys";
import { ROLE_FORKORTELSER } from "@common/constants/roleTags";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useDebounce } from "@common/hooks/useDebounce";
import { ObjectUtils } from "@navikt/bidrag-ui-common";
import { Box, Button, Tabs } from "@navikt/ds-react";
import { addMonths, deductMonths } from "@utils/date-utils";
import React, { useEffect, useMemo } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { STEPS } from "../../../constants/steps";
import { BarnebidragStepper } from "../../../enum/BarnebidragStepper";
import { useOnCreatePrivatAvtale } from "../../../hooks/useOnCreatePrivatAvtale";
import { useOnDeletePrivatAvtale } from "../../../hooks/useOnDeletePrivatAvtale";
import { useOnUpdatePrivatAvtale } from "../../../hooks/useOnUpdatePrivatAvtale";
import { PrivatAvtaleFormValue, PrivatAvtaleFormValues } from "../../../types/privatAvtaleFormValues";
import { createInitialValues, createPrivatAvtaleInitialValues } from "../helpers/PrivatAvtaleHelpers";
import { BeregnetTabel } from "./BeregnetTabel";
import { Perioder } from "./Perioder";

const Main = ({ initialValues }: { initialValues: PrivatAvtaleFormValues }) => {
    const { control } = useFormContext<PrivatAvtaleFormValues>();
    const { onNavigateToTab } = useBehandlingProvider();
    const [searchParams] = useSearchParams();
    const roller = useFieldArray({
        control,
        name: "roller",
    });
    const watchFieldArray = useWatch({ control, name: "roller" });
    const controlledFields = roller.fields.map((field, index) => ({
        ...field,
        ...watchFieldArray?.[index],
    }));

    const defaultTab = useMemo(() => {
        const barnIdent = controlledFields.find(
            ({ gjelderBarn }) => gjelderBarn.ident === searchParams.get(urlSearchParams.tab)
        )?.gjelderBarn?.ident;
        return barnIdent ?? controlledFields[0].gjelderBarn.ident;
    }, []);
    const selectedTab = searchParams.get(urlSearchParams.tab) ?? defaultTab;

    if (controlledFields.length > 1) {
        return (
            <Tabs
                defaultValue={defaultTab}
                value={selectedTab}
                onChange={onNavigateToTab}
                className="lg:max-w-[960px] md:max-w-[720px] sm:max-w-[598px] w-full"
            >
                <Tabs.List>
                    {controlledFields.map(({ gjelderBarn }) => (
                        <Tabs.Tab
                            key={gjelderBarn.ident}
                            value={gjelderBarn.ident}
                            label={`${ROLE_FORKORTELSER.BA} ${gjelderBarn.ident}`}
                        />
                    ))}
                </Tabs.List>
                {controlledFields.map((item, index) => {
                    return (
                        <Tabs.Panel
                            key={item.gjelderBarn.ident}
                            value={item.gjelderBarn.ident}
                            className="grid gap-y-4"
                        >
                            <PrivatAvtaleBarn
                                key={item.id}
                                item={item}
                                barnIndex={index}
                                initialValues={initialValues}
                            />
                        </Tabs.Panel>
                    );
                })}
            </Tabs>
        );
    }

    return (
        <>
            <PrivatAvtaleBarn
                key={controlledFields[0].id}
                item={controlledFields[0]}
                barnIndex={0}
                initialValues={initialValues}
            />
        </>
    );
};

const PrivatAvtaleBarn = ({
    item,
    barnIndex,
    initialValues,
}: {
    item: PrivatAvtaleFormValue;
    barnIndex: number;
    initialValues: PrivatAvtaleFormValues;
}) => {
    const { lesemodus, setSaveErrorState } = useBehandlingProvider();
    const createPrivatAvtale = useOnCreatePrivatAvtale();
    const deletePrivatAvtale = useOnDeletePrivatAvtale();
    const { setValue } = useFormContext<PrivatAvtaleFormValues>();

    const onCreatePrivatAvtale = () => {
        const payload: BarnDto = {
            personident: item.gjelderBarn.ident,
            navn: item.gjelderBarn.navn,
            fødselsdato: item.gjelderBarn.fødselsdato,
        };

        createPrivatAvtale.mutation.mutate(payload, {
            onSuccess: (response) => {
                setValue(
                    `roller.${barnIndex}.privatAvtale`,
                    createPrivatAvtaleInitialValues(response.oppdatertPrivatAvtale)
                );
                createPrivatAvtale.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        privatAvtale: currentData.privatAvtale.map((avtale) => {
                            if (avtale.gjelderBarn.ident === response.oppdatertPrivatAvtale.gjelderBarn.ident)
                                return response.oppdatertPrivatAvtale;
                            return avtale;
                        }),
                    };
                });
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onCreatePrivatAvtale(),
                });
            },
        });
    };

    const onDeletePrivatAvtale = () => {
        deletePrivatAvtale.mutation.mutate(item.privatAvtale.avtaleId, {
            onSuccess: () => {
                setValue(`roller.${barnIndex}.privatAvtale`, null);
                deletePrivatAvtale.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        privatAvtale: currentData.privatAvtale.filter(
                            (avtale) => avtale.gjelderBarn.ident !== item.gjelderBarn.ident
                        ),
                    };
                });
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onDeletePrivatAvtale(),
                });
            },
        });
    };

    return (
        <>
            <Box background="surface-subtle" className="overflow-hidden grid gap-2 py-2 px-4">
                <div className="grid grid-cols-[max-content,max-content,auto] p-2 bg-white border border-[var(--a-border-default)]">
                    <div>
                        <RolleTag rolleType={Rolletype.BA} />
                    </div>
                    <div className="flex items-center gap-4">
                        <PersonNavnIdent
                            navn={item.gjelderBarn.navn}
                            ident={item.gjelderBarn.ident}
                            fødselsdato={item.gjelderBarn.fødselsdato}
                        />
                    </div>
                </div>
                {!item.privatAvtale && (
                    <Button
                        type="button"
                        onClick={onCreatePrivatAvtale}
                        variant="secondary"
                        size="small"
                        className="w-fit"
                        disabled={lesemodus}
                    >
                        {text.label.opprettePrivatAvtale}
                    </Button>
                )}
                {item.privatAvtale && (
                    <>
                        <Button
                            type="button"
                            onClick={onDeletePrivatAvtale}
                            variant="secondary"
                            size="small"
                            className="w-fit"
                            disabled={lesemodus}
                        >
                            {text.label.slettPrivatAvtale}
                        </Button>
                        <PrivatAvtalePerioder item={item} barnIndex={barnIndex} initialValues={initialValues} />
                    </>
                )}
            </Box>
        </>
    );
};

const PrivatAvtalePerioder = ({
    item,
    barnIndex,
    initialValues,
}: {
    item: PrivatAvtaleFormValue;
    barnIndex: number;
    initialValues: PrivatAvtaleFormValues;
}) => {
    const { privatAvtale } = useGetBehandlingV2();
    const { setSaveErrorState } = useBehandlingProvider();
    const updatePrivatAvtaleQuery = useOnUpdatePrivatAvtale(item.privatAvtale.avtaleId);
    const beregnetPrivatAvtale = privatAvtale.find(
        (avtale) => avtale.id === item.privatAvtale.avtaleId
    )?.beregnetPrivatAvtale;
    const { watch } = useFormContext<PrivatAvtaleFormValues>();
    const fom = useMemo(() => deductMonths(new Date(), 50 * 12), []);
    const tom = useMemo(() => addMonths(new Date(), 50 * 12), []);

    const updatePrivatAvtale = (payload: OppdaterePrivatAvtaleRequest) => {
        updatePrivatAvtaleQuery.mutation.mutate(payload, {
            onSuccess: (response) => {
                updatePrivatAvtaleQuery.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        privatAvtale: currentData.privatAvtale.map((avtale) => {
                            if (avtale.id === item.privatAvtale.avtaleId) return response.oppdatertPrivatAvtale;
                            return avtale;
                        }),
                    };
                });
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => updatePrivatAvtale(payload),
                });
            },
        });
    };

    const debouncedOnSave = useDebounce(updatePrivatAvtale);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === `roller.${barnIndex}.privatAvtale.begrunnelse`) {
                const payload = { begrunnelse: value.roller[barnIndex].privatAvtale.begrunnelse };
                debouncedOnSave(payload);
            }

            if (
                name === `roller.${barnIndex}.privatAvtale.avtaleDato` &&
                value.roller[barnIndex].privatAvtale.avtaleDato
            ) {
                const payload = { avtaleDato: value.roller[barnIndex].privatAvtale.avtaleDato };
                updatePrivatAvtale(payload);
            }
        });
        return () => subscription.unsubscribe();
    }, [updatePrivatAvtale]);

    const onToggle = (checked: boolean) => {
        updatePrivatAvtale({ skalIndeksreguleres: checked });
    };

    return (
        <>
            <FlexRow>
                <FormControlledMonthPicker
                    name={`roller.${barnIndex}.privatAvtale.avtaleDato`}
                    label={text.label.avtaleDato}
                    placeholder="DD.MM.ÅÅÅÅ"
                    defaultValue={initialValues.roller[barnIndex].privatAvtale?.avtaleDato ?? null}
                    fromDate={fom}
                    toDate={tom}
                    required
                />
            </FlexRow>
            <Perioder barnIndex={barnIndex} item={item.privatAvtale} />
            <FlexRow>
                <FormControlledSwitch
                    name={`roller.${barnIndex}.privatAvtale.skalIndeksreguleres`}
                    legend={text.label.skalIndeksreguleres}
                    onChange={onToggle}
                    readOnly={!item.privatAvtale.perioder.length}
                />
            </FlexRow>
            {item.privatAvtale.skalIndeksreguleres && beregnetPrivatAvtale?.perioder && (
                <BeregnetTabel perioder={beregnetPrivatAvtale.perioder} />
            )}
        </>
    );
};

const Side = () => {
    const [searchParams] = useSearchParams();
    const { privatAvtale } = useGetBehandlingV2();
    const { onStepChange } = useBehandlingProvider();
    const { getValues } = useFormContext<PrivatAvtaleFormValues>();
    const tabBarnIdent = searchParams.get(urlSearchParams.tab);
    const roller = getValues("roller");
    const baRolleIndex = roller.findIndex((rolle) => rolle.gjelderBarn.ident === tabBarnIdent);
    const rolleIndex = baRolleIndex !== -1 ? baRolleIndex : 0;
    const selectedBarnIdent = roller[rolleIndex].gjelderBarn.ident;
    const selectedPrivatAvtale = privatAvtale.find((avtale) => avtale.gjelderBarn.ident === selectedBarnIdent);
    const begrunnelseFraOpprinneligVedtak = selectedPrivatAvtale?.begrunnelseFraOpprinneligVedtak;

    const onNext = () => onStepChange(STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD]);

    return (
        <>
            <FormControlledCustomTextareaEditor
                name={`roller.${rolleIndex}.privatAvtale.begrunnelse`}
                label={text.title.begrunnelse}
                resize
            />
            {begrunnelseFraOpprinneligVedtak && (
                <CustomTextareaEditor
                    name="begrunnelseFraOpprinneligVedtak"
                    label={text.label.begrunnelseFraOpprinneligVedtak}
                    value={begrunnelseFraOpprinneligVedtak}
                    resize
                    readOnly
                />
            )}
            <ActionButtons onNext={onNext} />
        </>
    );
};

const PrivatAvtaleForm = () => {
    const { privatAvtale, roller: behandlingRoller } = useGetBehandlingV2();
    const { setPageErrorsOrUnsavedState } = useBehandlingProvider();
    const baRoller = behandlingRoller.filter((rolle) => rolle.rolletype === Rolletype.BA);
    const initialValues = useMemo(
        () => createInitialValues(privatAvtale, baRoller),
        [JSON.stringify(privatAvtale), JSON.stringify(baRoller)]
    );

    const useFormMethods = useForm({
        defaultValues: initialValues,
    });

    useEffect(() => {
        setPageErrorsOrUnsavedState((prevState) => ({
            ...prevState,
            privatAvtale: {
                error: !ObjectUtils.isEmpty(useFormMethods.formState.errors),
            },
        }));
    }, [useFormMethods.formState.errors]);

    return (
        <>
            <FormProvider {...useFormMethods}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <NewFormLayout
                        title={text.label.privatAvtale}
                        main={<Main initialValues={initialValues} />}
                        side={<Side />}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default () => {
    return (
        <QueryErrorWrapper>
            <PrivatAvtaleForm />
        </QueryErrorWrapper>
    );
};
