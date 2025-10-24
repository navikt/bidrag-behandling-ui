import { BarnDto, Rolletype, Stonadstype, Vedtakstype } from "@api/BidragBehandlingApiV1";
import { ActionButtons } from "@common/components/ActionButtons";
import { CustomTextareaEditor } from "@common/components/CustomEditor";
import { FormControlledCustomTextareaEditor } from "@common/components/formFields/FormControlledCustomTextEditor";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import { ConfirmationModal } from "@common/components/modal/ConfirmationModal";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import { RolleTag } from "@common/components/RolleTag";
import { default as urlSearchParams } from "@common/constants/behandlingQueryKeys";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { getFirstDayOfMonthAfterEighteenYears } from "@common/helpers/boforholdFormHelpers";
import { useGetBehandlingV2, useRefetchFFInfo } from "@common/hooks/useApiData";
import { TrashIcon } from "@navikt/aksel-icons";
import { ObjectUtils, PersonNavnIdent, RolleTypeFullName } from "@navikt/bidrag-ui-common";
import { Alert, Box, Button, Heading, Tabs } from "@navikt/ds-react";
import { addMonths, firstDayOfMonth, isAfterDate, isBeforeDate } from "@utils/date-utils";
import React, { Fragment, useEffect, useMemo, useRef } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import useFeatureToogle from "../../../../common/hooks/useFeatureToggle";
import { BarnebidragStepper } from "../../../enum/BarnebidragStepper";
import { useOnCreatePrivatAvtale } from "../../../hooks/useOnCreatePrivatAvtale";
import { PrivatAvtaleFormValue, PrivatAvtaleFormValues } from "../../../types/privatAvtaleFormValues";
import { createInitialValues, createPrivatAvtaleInitialValues } from "../helpers/PrivatAvtaleHelpers";
import { PrivatAvtaleAndreBarn } from "./PrivatAvtaleAndreBarn";
import { PrivatAvtalePerioder } from "./PrivatAvtalePerioder";

export const getFomForPrivatAvtale = (stønadstype: Stonadstype, fødselsdato: string) => {
    const fomMin = new Date("2012-01-01");
    if (stønadstype === Stonadstype.BIDRAG18AAR) {
        const firstMonthAfterEighteenBirthday = getFirstDayOfMonthAfterEighteenYears(new Date(fødselsdato));
        return isBeforeDate(firstMonthAfterEighteenBirthday, fomMin) ? fomMin : firstMonthAfterEighteenBirthday;
    }
    const birthMonth = firstDayOfMonth(new Date(fødselsdato));
    return isBeforeDate(birthMonth, fomMin) ? fomMin : birthMonth;
};

export const getTomForPrivatAvtale = (fødselsdato: string) => {
    const tomMax = new Date();
    const birthMonth = addMonths(firstDayOfMonth(new Date(fødselsdato)), 1);
    return isAfterDate(birthMonth, tomMax) ? birthMonth : tomMax;
};

export const RemoveButton = ({ onDelete }: { onDelete: () => void }) => {
    const ref = useRef<HTMLDialogElement>(null);
    const onConfirm = () => {
        ref.current?.close();
        onDelete();
    };

    return (
        <>
            <div className="flex items-center justify-end">
                <Button
                    type="button"
                    onClick={() => ref.current?.showModal()}
                    icon={<TrashIcon aria-hidden />}
                    variant="tertiary"
                    size="small"
                />
            </div>
            <ConfirmationModal
                ref={ref}
                closeable
                description={text.varsel.ønskerDuÅSlettePrivatAvtale}
                heading={<Heading size="small">{text.varsel.ønskerDuÅSlette}</Heading>}
                footer={
                    <>
                        <Button type="button" onClick={onConfirm} size="small">
                            {text.label.jaSlett}
                        </Button>
                        <Button type="button" variant="secondary" size="small" onClick={() => ref.current?.close()}>
                            {text.label.avbryt}
                        </Button>
                    </>
                }
            />
        </>
    );
};

const Main = ({ initialValues }: { initialValues: PrivatAvtaleFormValues }) => {
    const { control } = useFormContext<PrivatAvtaleFormValues>();
    const { onNavigateToTab } = useBehandlingProvider();
    const [searchParams] = useSearchParams();

    const { bidragFlereBarn } = useFeatureToogle();
    const roller = useFieldArray({
        control,
        name: "roller",
    });
    const watchFieldArray = useWatch({ control, name: "roller" });
    const andreBarn = useWatch({ control, name: "andreBarn" });
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

    if (controlledFields.length > 1 || andreBarn.length > 0) {
        return (
            <>
                {andreBarn.length > 0 && (
                    <Alert variant="info" size="small">
                        Bidragspliktig har barn uten bidragsak/løpende bidrag. De er listet under "Andre barn". Hvis BP
                        har privat avtale for andre barn kan du fylle ut bidragsbeløpene for å se om det slår ut til
                        forholdsmessig fordeling.
                    </Alert>
                )}
                <Tabs
                    defaultValue={defaultTab}
                    value={selectedTab}
                    onChange={onNavigateToTab}
                    className={`lg:max-w-[960px] md:max-w-[720px] sm:max-w-[598px] w-full`}
                >
                    <Tabs.List>
                        {controlledFields.map(({ gjelderBarn, harLøpendeBidrag }) => (
                            <Tabs.Tab
                                key={gjelderBarn.ident}
                                value={gjelderBarn.ident}
                                className={!harLøpendeBidrag ? "bg-gray-50 border border-gray-50 w-full" : ""}
                                label={
                                    !harLøpendeBidrag ? (
                                        <PersonNavnIdent ident={gjelderBarn.ident} variant="compact" />
                                    ) : (
                                        <PersonNavnIdent
                                            skjulNavn
                                            rolle={RolleTypeFullName.BARN}
                                            ident={gjelderBarn.ident}
                                            variant="compact"
                                        />
                                    )
                                }
                            />
                        ))}
                        {bidragFlereBarn && <Tabs.Tab key="andrebarn" value="andrebarn" label="Andre barn" />}
                    </Tabs.List>
                    {controlledFields.map((item, index) => {
                        return (
                            <Tabs.Panel
                                key={item.gjelderBarn.ident}
                                value={item.gjelderBarn.ident}
                                className="grid gap-y-4"
                            >
                                <PrivatAvtaleBarn
                                    multiple
                                    key={item.id}
                                    item={item}
                                    barnIndex={index}
                                    initialValues={initialValues}
                                />
                            </Tabs.Panel>
                        );
                    })}
                    {bidragFlereBarn && (
                        <Tabs.Panel key={"andrebarn"} value={"andrebarn"} className="grid gap-y-4">
                            <PrivatAvtaleAndreBarn initialValues={initialValues} />
                        </Tabs.Panel>
                    )}
                </Tabs>
            </>
        );
    }

    return (
        <>
            <PrivatAvtaleBarn
                multiple={false}
                key={controlledFields[0].id}
                item={controlledFields[0]}
                barnIndex={0}
                initialValues={initialValues}
            />
        </>
    );
};

const PrivatAvtaleBarn = ({
    multiple,
    item,
    barnIndex,
    initialValues,
}: {
    multiple: boolean;
    item: PrivatAvtaleFormValue;
    barnIndex: number;
    initialValues: PrivatAvtaleFormValues;
}) => {
    const { lesemodus, setSaveErrorState } = useBehandlingProvider();
    const createPrivatAvtale = useOnCreatePrivatAvtale();
    const { setValue } = useFormContext<PrivatAvtaleFormValues>();
    const refetchFFInfo = useRefetchFFInfo();

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
                createPrivatAvtale.queryClientUpdater((currentData) => ({
                    ...currentData,
                    privatAvtale: currentData.privatAvtale.concat(response.oppdatertPrivatAvtale),
                }));
                refetchFFInfo();
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onCreatePrivatAvtale(),
                });
            },
        });
    };

    return (
        <>
            <Box background="surface-subtle" className="overflow-hidden grid gap-2 py-2 px-4">
                {!multiple && (
                    <div
                        className={`grid grid-cols-[max-content,max-content,auto] p-2 bg-white border border-[var(--a-border-default)]`}
                    >
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
                )}
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
                    <PrivatAvtalePerioder
                        prefix="roller"
                        item={item}
                        barnIndex={barnIndex}
                        initialValues={initialValues}
                    />
                )}
            </Box>
        </>
    );
};

const Side = () => {
    const [searchParams] = useSearchParams();
    const { erBisysVedtak, privatAvtale, vedtakstype } = useGetBehandlingV2();
    const { onStepChange, getNextStep } = useBehandlingProvider();
    const { getValues } = useFormContext<PrivatAvtaleFormValues>();
    const tabBarnIdent = searchParams.get(urlSearchParams.tab);
    const roller = getValues("roller");
    const baRolleIndex = roller.findIndex((rolle) => rolle?.gjelderBarn?.ident === tabBarnIdent);
    const rolleIndex = baRolleIndex !== -1 ? baRolleIndex : 0;
    const rolle = roller[rolleIndex];
    const selectedBarnIdent = rolle?.gjelderBarn?.ident;
    const selectedPrivatAvtale = privatAvtale.find((avtale) => avtale.gjelderBarn.ident === selectedBarnIdent);
    const begrunnelseFraOpprinneligVedtak = selectedPrivatAvtale?.begrunnelseFraOpprinneligVedtak;
    const erAldersjusteringsVedtakstype = vedtakstype === Vedtakstype.ALDERSJUSTERING;
    const begrunnelseName =
        tabBarnIdent === "roller" ? `roller.${rolleIndex}.privatAvtale.begrunnelse` : "andreBarnBegrunnelse";

    return (
        <Fragment key={selectedBarnIdent}>
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && (
                <FormControlledCustomTextareaEditor name={`${begrunnelseName}`} label={text.title.begrunnelse} resize />
            )}
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && begrunnelseFraOpprinneligVedtak && (
                <CustomTextareaEditor
                    name={`begrunnelseFraOpprinneligVedtak`}
                    label={text.label.begrunnelseFraOpprinneligVedtak}
                    value={begrunnelseFraOpprinneligVedtak}
                    resize
                    readOnly
                />
            )}
            <ActionButtons onNext={() => onStepChange(getNextStep(BarnebidragStepper.PRIVAT_AVTALE))} />
        </Fragment>
    );
};

const PrivatAvtaleForm = () => {
    const { privatAvtale, roller: behandlingRoller, bpsBarnUtenLøpendeBidrag } = useGetBehandlingV2();
    const { setPageErrorsOrUnsavedState } = useBehandlingProvider();
    const baRoller = behandlingRoller.filter((rolle) => rolle.rolletype === Rolletype.BA);
    const initialValues = useMemo(
        () => createInitialValues(privatAvtale, baRoller, bpsBarnUtenLøpendeBidrag),
        [JSON.stringify(privatAvtale), JSON.stringify(baRoller), JSON.stringify(bpsBarnUtenLøpendeBidrag)]
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
    }, [JSON.stringify(useFormMethods.formState.errors)]);

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
