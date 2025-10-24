import {
    OppdatereVirkningstidspunkt,
    Resultatkode,
    TypeArsakstype,
    Vedtakstype,
    VirkningstidspunktBarnDtoV2,
} from "@api/BidragBehandlingApiV1";
import { ActionButtons } from "@common/components/ActionButtons";
import { BehandlingAlert } from "@common/components/BehandlingAlert";
import { FormControlledCustomTextareaEditor } from "@common/components/formFields/FormControlledCustomTextEditor";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import { FormControlledSelectField } from "@common/components/formFields/FormControlledSelectField";
import { FlexRow } from "@common/components/layout/grid/FlexRow";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import urlSearchParams from "@common/constants/behandlingQueryKeys";
import { SOKNAD_LABELS } from "@common/constants/soknadFraLabels";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { aarsakToVirkningstidspunktMapper } from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useDebounce } from "@common/hooks/useDebounce";
import { useFomTomDato } from "@common/hooks/useFomTomDato";
import { hentVisningsnavn, hentVisningsnavnVedtakstype } from "@common/hooks/useVisningsnavn";
import {
    VirkningstidspunktFormValues,
    VirkningstidspunktFormValuesPerBarn,
} from "@common/types/virkningstidspunktFormValues";
import { ObjectUtils, PersonNavnIdent, toISODateString } from "@navikt/bidrag-ui-common";
import { BodyShort, Label, Tabs } from "@navikt/ds-react";
import { addMonths, dateOrNull, DateToDDMMYYYYString } from "@utils/date-utils";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { useGetActiveAndDefaultVirkningstidspunktTab } from "../../../../barnebidrag/hooks/useGetActiveAndDefaultVirkningstidspunktTab";
import { useOnSaveVirkningstidspunkt } from "../../../../barnebidrag/hooks/useOnSaveVirkningstidspunkt";
import { CustomTextareaEditor } from "../../../../common/components/CustomEditor";
import KlagetPåVedtakButton from "../../../../common/components/KlagetPåVedtakButton";
import { ForskuddStepper } from "../../../enum/ForskuddStepper";

const årsakListe = [
    TypeArsakstype.TREMANEDERTILBAKE,
    TypeArsakstype.TREARSREGELEN,
    TypeArsakstype.FRABARNETSFODSEL,
    TypeArsakstype.FRABARNETSFLYTTEMANED,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
    TypeArsakstype.FRA_OPPHOLDSTILLATELSE,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.FRA_SAMLIVSBRUDD,
    TypeArsakstype.PRIVAT_AVTALE,
    TypeArsakstype.REVURDERINGMANEDENETTER,
    TypeArsakstype.SOKNADSTIDSPUNKTENDRING,
    TypeArsakstype.TIDLIGERE_FEILAKTIG_AVSLAG,
    TypeArsakstype.FRAMANEDENETTERIPAVENTEAVBIDRAGSSAK,
];

const avslagsListe = [
    Resultatkode.PAGRUNNAVBARNEPENSJON,
    Resultatkode.BARNETS_EKTESKAP,
    Resultatkode.BARNETS_INNTEKT,
    Resultatkode.PAGRUNNAVYTELSEFRAFOLKETRYGDEN,
    Resultatkode.FULLT_UNDERHOLDT_AV_OFFENTLIG,
    Resultatkode.IKKE_OMSORG,
    Resultatkode.IKKE_OPPHOLD_I_RIKET,
    Resultatkode.MANGLENDE_DOKUMENTASJON,
    Resultatkode.PAGRUNNAVSAMMENFLYTTING,
    Resultatkode.OPPHOLD_I_UTLANDET,
    Resultatkode.AVSLAG_PRIVAT_AVTALE_BIDRAG,
    Resultatkode.IKKE_INNKREVING_AV_BIDRAG,
    Resultatkode.UTENLANDSK_YTELSE,
];

const opphørAvslagsListe = [...avslagsListe, Resultatkode.PARTENBEROMOPPHOR, Resultatkode.BARNETERDODT];

const avslagsListeDeprekert = [Resultatkode.IKKESOKTOMINNKREVINGAVBIDRAG];

const createInitialValues = (response: VirkningstidspunktBarnDtoV2[]): VirkningstidspunktFormValues => {
    return {
        roller: response.map((virkningstidspunkt) => {
            return {
                rolle: virkningstidspunkt.rolle,
                virkningstidspunkt: virkningstidspunkt.virkningstidspunkt,
                årsakAvslag: virkningstidspunkt.årsak ?? virkningstidspunkt.avslag ?? "",
                begrunnelse: virkningstidspunkt.begrunnelse?.innhold,
            };
        }),
    };
};

const createPayload = (values: VirkningstidspunktFormValuesPerBarn, rolleId?: number): OppdatereVirkningstidspunkt => {
    const årsak = årsakListe.find((value) => value === values.årsakAvslag);
    const avslag = opphørAvslagsListe.find((value) => value === values.årsakAvslag);
    return {
        rolleId,
        virkningstidspunkt: values.virkningstidspunkt,
        årsak,
        avslag,
        oppdatereBegrunnelse: {
            nyBegrunnelse: values.begrunnelse,
        },
    };
};

const VirkningstidspunktRolle = ({
    item,
    rolleIndex,
    initialValues,
}: {
    item: VirkningstidspunktFormValuesPerBarn;
    rolleIndex: number;
    initialValues: VirkningstidspunktFormValuesPerBarn;
}) => {
    const { lesemodus, setSaveErrorState } = useBehandlingProvider();
    const behandling = useGetBehandlingV2();
    const { setValue, clearErrors, getValues, watch, reset } = useFormContext();
    const oppdaterBehandling = useOnSaveVirkningstidspunkt();
    const kunEtRolleIBehandlingen = behandling.virkningstidspunktV2.length === 1;
    const selectedVirkningstidspunkt = behandling.virkningstidspunktV2.find(
        ({ rolle }) => rolle.ident === item.rolle.ident
    );
    const [previousValues, setPreviousValues] = useState<VirkningstidspunktFormValuesPerBarn>(initialValues);
    const [initialVirkningsdato, setInitialVirkningsdato] = useState(selectedVirkningstidspunkt.virkningstidspunkt);
    const [showChangedVirkningsDatoAlert, setShowChangedVirkningsDatoAlert] = useState(false);

    const [fom] = useFomTomDato(false);
    const tom = useMemo(
        () => dateOrNull(selectedVirkningstidspunkt.opprinneligVirkningstidspunkt) ?? addMonths(new Date(), 50 * 12),
        [fom]
    );

    useEffect(() => {
        if (
            initialVirkningsdato &&
            selectedVirkningstidspunkt.virkningstidspunkt &&
            initialVirkningsdato !== selectedVirkningstidspunkt.virkningstidspunkt &&
            selectedVirkningstidspunkt.avslag == null
        ) {
            setShowChangedVirkningsDatoAlert(true);
        }

        if (
            initialVirkningsdato &&
            showChangedVirkningsDatoAlert &&
            initialVirkningsdato === selectedVirkningstidspunkt.virkningstidspunkt
        ) {
            setShowChangedVirkningsDatoAlert(false);
        }

        if (!initialVirkningsdato && selectedVirkningstidspunkt.virkningstidspunkt) {
            setInitialVirkningsdato(selectedVirkningstidspunkt.virkningstidspunkt);
        }
    }, [selectedVirkningstidspunkt.virkningstidspunkt]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (
                (name === `roller.${rolleIndex}.virkningstidspunkt` && !value.roller[rolleIndex].virkningstidspunkt) ||
                (name !== `roller.${rolleIndex}.begrunnelse` && type === undefined)
            ) {
                return;
            }
            debouncedOnSave();
        });
        return () => subscription.unsubscribe();
    }, []);

    const onSave = () => {
        const values = getValues(`roller.${rolleIndex}`);
        oppdaterBehandling.mutation.mutate(createPayload(values, selectedVirkningstidspunkt.rolle.id), {
            onSuccess: (response) => {
                oppdaterBehandling.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        virkningstidspunkt: response.virkningstidspunkt,
                        virkningstidspunktV2: response.virkningstidspunktV2,
                        virkningstidspunktV3: response.virkningstidspunktV3,
                        boforhold: response.boforhold,
                        aktiveGrunnlagsdata: response.aktiveGrunnlagsdata,
                        inntekter: response.inntekter,
                        samvær: response.samvær,
                        underholdskostnader: response.underholdskostnader,
                        gebyr: response.gebyr,
                        ikkeAktiverteEndringerIGrunnlagsdata: response.ikkeAktiverteEndringerIGrunnlagsdata,
                    };
                });
                const updatedValues = createInitialValues(response.virkningstidspunktV3.barn);
                const selectedBarn = Object.values(updatedValues.roller).find(
                    ({ rolle }) => rolle.ident === selectedVirkningstidspunkt.rolle.ident
                );
                setPreviousValues(selectedBarn);
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onSave(),
                    rollbackFn: () => {
                        reset(previousValues, {
                            keepIsSubmitSuccessful: true,
                            keepDirty: true,
                            keepIsSubmitted: true,
                        });
                    },
                });
            },
        });
    };

    const debouncedOnSave = useDebounce(onSave);

    const onAarsakSelect = (value: string) => {
        const date = aarsakToVirkningstidspunktMapper(value, behandling, selectedVirkningstidspunkt);
        setValue(`roller.${rolleIndex}.virkningstidspunkt`, date ? toISODateString(date) : null);
        clearErrors(`roller.${rolleIndex}.virkningstidspunkt`);
    };

    const erTypeOpphør = behandling.vedtakstype === Vedtakstype.OPPHOR;
    const avslagsOpphørsliste = erTypeOpphør ? opphørAvslagsListe : avslagsListe;
    const erÅrsakAvslagIkkeValgt = getValues(`roller.${rolleIndex}.årsakAvslag`) === "";

    return (
        <>
            <FlexRow className="gap-x-12">
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søknadstype}:</Label>
                    <BodyShort size="small">{hentVisningsnavn(behandling.vedtakstype)}</BodyShort>
                    <KlagetPåVedtakButton />
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søknadfra}:</Label>
                    <BodyShort size="small">{SOKNAD_LABELS[behandling.søktAv]}</BodyShort>
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.mottattdato}:</Label>
                    <BodyShort size="small">{DateToDDMMYYYYString(new Date(behandling.mottattdato))}</BodyShort>
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søktfradato}:</Label>
                    <BodyShort size="small">{DateToDDMMYYYYString(new Date(behandling.søktFomDato))}</BodyShort>
                </div>
            </FlexRow>
            <FlexRow className="gap-x-8">
                <FormControlledSelectField
                    name={`roller.${rolleIndex}.årsakAvslag`}
                    label={text.label.årsak}
                    onSelect={onAarsakSelect}
                    className="w-max"
                >
                    {lesemodus && (
                        <option value={getValues(`roller.${rolleIndex}.årsakAvslag`)}>
                            {hentVisningsnavnVedtakstype(
                                getValues(`roller.${rolleIndex}.årsakAvslag`),
                                behandling.vedtakstype
                            )}
                        </option>
                    )}
                    {!lesemodus && erÅrsakAvslagIkkeValgt && (
                        <option value="">{text.select.årsakAvslagPlaceholder}</option>
                    )}
                    {!lesemodus && !erTypeOpphør && (
                        <optgroup label={text.label.årsak}>
                            {årsakListe
                                .filter((value) => {
                                    if (kunEtRolleIBehandlingen) return true;
                                    return value !== TypeArsakstype.FRABARNETSFODSEL;
                                })
                                .map((value) => (
                                    <option key={value} value={value}>
                                        {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                    </option>
                                ))}
                        </optgroup>
                    )}
                    {!lesemodus && (
                        <optgroup
                            label={
                                erTypeOpphør || selectedVirkningstidspunkt.harLøpendeForskudd
                                    ? text.label.opphør
                                    : text.label.avslag
                            }
                        >
                            {avslagsOpphørsliste.map((value) => (
                                <option key={value} value={value}>
                                    {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                </option>
                            ))}
                            {avslagsListeDeprekert.includes(getValues(`roller.${rolleIndex}.årsakAvslag`)) && (
                                <>
                                    {avslagsListeDeprekert.map((value) => (
                                        <option key={value} value={value} disabled>
                                            {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                        </option>
                                    ))}
                                </>
                            )}
                        </optgroup>
                    )}
                </FormControlledSelectField>
                <FormControlledMonthPicker
                    name={`roller.${rolleIndex}.virkningstidspunkt`}
                    label={text.label.virkningstidspunkt}
                    placeholder="DD.MM.ÅÅÅÅ"
                    defaultValue={initialValues.virkningstidspunkt}
                    fromDate={fom}
                    toDate={tom}
                    readonly={lesemodus}
                    required
                />
            </FlexRow>
            {showChangedVirkningsDatoAlert && (
                <BehandlingAlert variant="warning" className={"w-[488px]"}>
                    <div dangerouslySetInnerHTML={{ __html: text.alert.endretVirkningstidspunkt }}></div>
                </BehandlingAlert>
            )}
        </>
    );
};

const Main = ({ initialValues }: { initialValues: VirkningstidspunktFormValues }) => {
    const { control } = useFormContext<VirkningstidspunktFormValues>();
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
        const rolleIdent = controlledFields.find(({ rolle }) => rolle.ident === searchParams.get(urlSearchParams.tab))
            ?.rolle?.ident;
        return rolleIdent ?? controlledFields[0].rolle.ident;
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
                    {controlledFields.map(({ rolle }) => (
                        <Tabs.Tab
                            key={rolle.ident}
                            value={rolle.ident}
                            label={<PersonNavnIdent ident={rolle.ident} rolle={rolle.rolletype} />}
                        />
                    ))}
                </Tabs.List>
                {controlledFields.map((item, index) => {
                    return (
                        <Tabs.Panel key={item.rolle.ident} value={item.rolle.ident} className="grid gap-y-4 py-4">
                            <VirkningstidspunktRolle
                                item={item}
                                rolleIndex={index}
                                initialValues={initialValues.roller[index]}
                            />
                        </Tabs.Panel>
                    );
                })}
            </Tabs>
        );
    }

    return (
        <div className="grid gap-y-4 py-4">
            <VirkningstidspunktRolle
                key={controlledFields[0].id}
                item={controlledFields[0]}
                rolleIndex={0}
                initialValues={initialValues.roller[0]}
            />
        </div>
    );
};

const Side = () => {
    const { onStepChange, getNextStep } = useBehandlingProvider();
    const { erBisysVedtak, virkningstidspunktV2, vedtakstype } = useGetBehandlingV2();
    const { getValues } = useFormContext<VirkningstidspunktFormValues>();
    const [activeTab] = useGetActiveAndDefaultVirkningstidspunktTab();
    const fieldIndex = getValues("roller").findIndex(({ rolle }) => rolle.ident === activeTab);
    const values = getValues(`roller.${fieldIndex}`);
    const begrunnelseFraOpprinneligVedtak = virkningstidspunktV2.find(
        ({ rolle }) => rolle.ident === values.rolle.ident
    ).begrunnelseFraOpprinneligVedtak;

    const onNext = () => onStepChange(getNextStep(ForskuddStepper.VIRKNINGSTIDSPUNKT));

    const erAldersjusteringsVedtakstype = vedtakstype === Vedtakstype.ALDERSJUSTERING;

    return (
        <>
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && (
                <FormControlledCustomTextareaEditor
                    name={`roller.${fieldIndex}.begrunnelse`}
                    label={text.title.begrunnelse}
                    resize
                />
            )}
            {!erBisysVedtak && !erAldersjusteringsVedtakstype && begrunnelseFraOpprinneligVedtak?.innhold && (
                <CustomTextareaEditor
                    name={`roller.${fieldIndex}.begrunnelseFraOpprinneligVedtak`}
                    label={text.label.begrunnelseFraOpprinneligVedtak}
                    value={begrunnelseFraOpprinneligVedtak.innhold}
                    resize
                    readOnly
                />
            )}
            <ActionButtons onNext={onNext} />
        </>
    );
};

const VirkningstidspunktForm = () => {
    const { virkningstidspunktV2 } = useGetBehandlingV2();
    const { setPageErrorsOrUnsavedState } = useBehandlingProvider();
    const initialValues = createInitialValues(virkningstidspunktV2);

    const useFormMethods = useForm({
        defaultValues: initialValues,
    });

    useEffect(() => {
        setPageErrorsOrUnsavedState((prevState) => ({
            ...prevState,
            virkningstidspunkt: {
                error: !ObjectUtils.isEmpty(useFormMethods.formState.errors),
            },
        }));
    }, [JSON.stringify(useFormMethods.formState.errors)]);

    return (
        <>
            <FormProvider {...useFormMethods}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <NewFormLayout
                        title={text.label.virkningstidspunkt}
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
            <VirkningstidspunktForm />
        </QueryErrorWrapper>
    );
};
