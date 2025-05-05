import {
    OppdatereVirkningstidspunkt,
    Resultatkode,
    Rolletype,
    TypeArsakstype,
    Vedtakstype,
    VirkningstidspunktDto,
} from "@api/BidragBehandlingApiV1";
import { ActionButtons } from "@common/components/ActionButtons";
import { BehandlingAlert } from "@common/components/BehandlingAlert";
import { FormControlledCustomTextareaEditor } from "@common/components/formFields/FormControlledCustomTextEditor";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import { FormControlledSelectField } from "@common/components/formFields/FormControlledSelectField";
import { FlexRow } from "@common/components/layout/grid/FlexRow";
import { NewFormLayout } from "@common/components/layout/grid/NewFormLayout";
import { PersonIdent } from "@common/components/PersonIdent";
import { QueryErrorWrapper } from "@common/components/query-error-boundary/QueryErrorWrapper";
import urlSearchParams from "@common/constants/behandlingQueryKeys";
import behandlingQueryKeys from "@common/constants/behandlingQueryKeys";
import { ROLE_FORKORTELSER } from "@common/constants/roleTags";
import { SOKNAD_LABELS } from "@common/constants/soknadFraLabels";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import {
    aarsakToVirkningstidspunktMapper,
    getFomAndTomForMonthPicker,
} from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useDebounce } from "@common/hooks/useDebounce";
import { hentVisningsnavn, hentVisningsnavnVedtakstype } from "@common/hooks/useVisningsnavn";
import { ObjectUtils, toISODateString } from "@navikt/bidrag-ui-common";
import { BodyShort, Label, Tabs } from "@navikt/ds-react";
import { addMonths, dateOrNull, DateToDDMMYYYYString } from "@utils/date-utils";
import { getSearchParam } from "@utils/window-utils";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { CustomTextareaEditor } from "../../../../common/components/CustomEditor";
import { STEPS } from "../../../constants/steps";
import { ForskuddStepper } from "../../../enum/ForskuddStepper";
import { useOnSaveVirkningstidspunkt } from "../../../hooks/useOnSaveVirkningstidspunkt";
import { VirkningstidspunktFormValues } from "../../../types/virkningstidspunktFormValues";

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

const opphørAvslagsListe = [...avslagsListe, Resultatkode.PARTENBEROMOPPHOR];

const avslagsListeDeprekert = [Resultatkode.IKKESOKTOMINNKREVINGAVBIDRAG];

const createInitialValues = (response: VirkningstidspunktDto): VirkningstidspunktFormValues => ({
    virkningstidspunkt: response.virkningstidspunkt,
    årsakAvslag: response.årsak ?? response.avslag ?? "",
    begrunnelse: response.begrunnelse?.innhold,
});

const createPayload = (values: VirkningstidspunktFormValues): OppdatereVirkningstidspunkt => {
    const årsak = årsakListe.find((value) => value === values.årsakAvslag);
    const avslag = opphørAvslagsListe.find((value) => value === values.årsakAvslag);
    return {
        virkningstidspunkt: values.virkningstidspunkt,
        årsak,
        avslag,
        oppdatereBegrunnelse: {
            nyBegrunnelse: values.begrunnelse,
        },
    };
};

const Main = ({ rolleId, initialValues, showChangedVirkningsDatoAlert }) => {
    const behandling = useGetBehandlingV2();
    const { lesemodus } = useBehandlingProvider();
    const { setValue, clearErrors, getValues } = useFormContext();
    const kunEtBarnIBehandlingen = behandling.roller.filter((rolle) => rolle.rolletype === Rolletype.BA).length === 1;
    const selectedVirkningstidspunkt = behandling.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId);

    const skalViseÅrsakstyper = behandling.vedtakstype !== Vedtakstype.OPPHOR;
    const onAarsakSelect = (value: string) => {
        const date = aarsakToVirkningstidspunktMapper(value, behandling, selectedVirkningstidspunkt);
        setValue("virkningstidspunkt", date ? toISODateString(date) : null);
        clearErrors("virkningstidspunkt");
    };
    const erÅrsakAvslagIkkeValgt = getValues("årsakAvslag") === "";

    const [fom] = getFomAndTomForMonthPicker(new Date(behandling.søktFomDato));

    const tom = useMemo(
        () => dateOrNull(selectedVirkningstidspunkt.opprinneligVirkningstidspunkt) ?? addMonths(new Date(), 50 * 12),
        [fom]
    );

    const erTypeOpphør = behandling.vedtakstype === Vedtakstype.OPPHOR;
    const avslagsOpphørsliste = erTypeOpphør ? opphørAvslagsListe : avslagsListe;
    return (
        <>
            <FlexRow className="gap-x-12">
                <div className="flex gap-x-2">
                    <Label size="small">{text.label.søknadstype}:</Label>
                    <BodyShort size="small">{hentVisningsnavn(behandling.vedtakstype)}</BodyShort>
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
                    name="årsakAvslag"
                    label={text.label.årsak}
                    onSelect={onAarsakSelect}
                    className="w-max"
                >
                    {lesemodus && (
                        <option value={getValues("årsakAvslag")}>
                            {hentVisningsnavnVedtakstype(getValues("årsakAvslag"), behandling.vedtakstype)}
                        </option>
                    )}
                    {!lesemodus && erÅrsakAvslagIkkeValgt && (
                        <option value="">{text.select.årsakAvslagPlaceholder}</option>
                    )}
                    {!lesemodus && skalViseÅrsakstyper && (
                        <optgroup label={text.label.årsak}>
                            {årsakListe
                                .filter((value) => {
                                    if (kunEtBarnIBehandlingen) return true;
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
                        <optgroup label={erTypeOpphør ? text.label.opphør : text.label.avslag}>
                            {avslagsOpphørsliste.map((value) => (
                                <option key={value} value={value}>
                                    {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                </option>
                            ))}
                            {avslagsListeDeprekert.includes(getValues("årsakAvslag")) && (
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
                    name="virkningstidspunkt"
                    label={text.label.virkningstidspunkt}
                    placeholder="DD.MM.ÅÅÅÅ"
                    defaultValue={initialValues.virkningstidspunkt}
                    fromDate={fom}
                    toDate={tom}
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

const Side = () => {
    const { onStepChange } = useBehandlingProvider();
    const {
        virkningstidspunkt: { begrunnelseFraOpprinneligVedtak },
    } = useGetBehandlingV2();
    const useFormMethods = useFormContext();
    const årsakAvslag = useFormMethods.getValues("årsakAvslag");
    const onNext = () =>
        onStepChange(
            opphørAvslagsListe.includes(årsakAvslag) ? STEPS[ForskuddStepper.VEDTAK] : STEPS[ForskuddStepper.BOFORHOLD]
        );

    return (
        <>
            <FormControlledCustomTextareaEditor name="begrunnelse" label={text.title.begrunnelse} resize />
            {begrunnelseFraOpprinneligVedtak?.innhold && (
                <CustomTextareaEditor
                    name="begrunnelseFraOpprinneligVedtak"
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

const VirkningstidspunktForm = ({ rolleId }) => {
    const { virkningstidspunktV2 } = useGetBehandlingV2();
    const virkningstidspunkt = virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId);
    const { setPageErrorsOrUnsavedState, setSaveErrorState } = useBehandlingProvider();
    const oppdaterBehandling = useOnSaveVirkningstidspunkt();
    const initialValues = createInitialValues(virkningstidspunkt);
    const [initialVirkningsdato, setInitialVirkningsdato] = useState(virkningstidspunkt.virkningstidspunkt);
    const [showChangedVirkningsDatoAlert, setShowChangedVirkningsDatoAlert] = useState(false);
    const [previousValues, setPreviousValues] = useState<VirkningstidspunktFormValues>(initialValues);

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

    useEffect(() => {
        const subscription = useFormMethods.watch((value, { name, type }) => {
            if (
                (name === "virkningstidspunkt" && !value.virkningstidspunkt) ||
                (name !== "begrunnelse" && type === undefined)
            ) {
                return;
            } else {
                debouncedOnSave();
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (
            initialVirkningsdato &&
            virkningstidspunkt.virkningstidspunkt &&
            initialVirkningsdato !== virkningstidspunkt.virkningstidspunkt &&
            virkningstidspunkt.avslag == null
        ) {
            setShowChangedVirkningsDatoAlert(true);
        }

        if (
            initialVirkningsdato &&
            showChangedVirkningsDatoAlert &&
            initialVirkningsdato === virkningstidspunkt.virkningstidspunkt
        ) {
            setShowChangedVirkningsDatoAlert(false);
        }

        if (!initialVirkningsdato && virkningstidspunkt.virkningstidspunkt) {
            setInitialVirkningsdato(virkningstidspunkt.virkningstidspunkt);
        }
    }, [virkningstidspunkt.virkningstidspunkt]);

    const onSave = () => {
        const values = useFormMethods.getValues();
        oppdaterBehandling.mutation.mutate(createPayload(values), {
            onSuccess: (response) => {
                oppdaterBehandling.queryClientUpdater((currentData) => {
                    return {
                        ...currentData,
                        virkningstidspunkt: response.virkningstidspunkt,
                        boforhold: response.boforhold,
                        aktiveGrunnlagsdata: response.aktiveGrunnlagsdata,
                        inntekter: response.inntekter,
                        ikkeAktiverteEndringerIGrunnlagsdata: response.ikkeAktiverteEndringerIGrunnlagsdata,
                    };
                });
                setPreviousValues(
                    createInitialValues(response.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId))
                );
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onSave(),
                    rollbackFn: () => {
                        useFormMethods.reset(previousValues, {
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

    return (
        <>
            <FormProvider {...useFormMethods}>
                <form onSubmit={useFormMethods.handleSubmit(onSave)}>
                    <NewFormLayout
                        title={text.label.virkningstidspunkt}
                        main={
                            <Main
                                rolleId={rolleId}
                                initialValues={initialValues}
                                showChangedVirkningsDatoAlert={showChangedVirkningsDatoAlert}
                            />
                        }
                        side={<Side />}
                    />
                </form>
            </FormProvider>
        </>
    );
};

export default () => {
    const { virkningstidspunktV2: virkingsTestArray } = useGetBehandlingV2();
    const { onNavigateToTab } = useBehandlingProvider();
    const [searchParams] = useSearchParams();

    // TODO: delete
    const virkningstidspunktV2Roller = virkingsTestArray
        .concat({
            ...virkingsTestArray[0],
            rolle: { ...virkingsTestArray[0].rolle, id: 1234, ident: "1234567" },
            virkningstidspunkt: "01.12.2024",
        })
        .concat({
            ...virkingsTestArray[0],
            rolle: { ...virkingsTestArray[0].rolle, id: 4321, ident: "7654321" },
            virkningstidspunkt: "01.12.2023",
        });

    const defaultTab = useMemo(() => {
        const roleId = virkningstidspunktV2Roller
            .find(({ rolle }) => rolle.id?.toString() === getSearchParam(urlSearchParams.tab))
            ?.rolle?.id?.toString();
        return roleId ?? virkningstidspunktV2Roller[0].rolle.id.toString();
    }, []);

    const selectedTab = searchParams.get(behandlingQueryKeys.tab) ?? defaultTab;

    return (
        <QueryErrorWrapper>
            <Tabs
                defaultValue={defaultTab}
                value={selectedTab}
                onChange={onNavigateToTab}
                className="lg:max-w-[960px] md:max-w-[720px] sm:max-w-[598px]"
            >
                <Tabs.List>
                    {virkningstidspunktV2Roller.map(({ rolle }) => (
                        <Tabs.Tab
                            key={rolle.ident}
                            value={rolle.id.toString()}
                            label={
                                <div className="flex flex-row gap-1">
                                    {ROLE_FORKORTELSER[rolle.rolletype]}
                                    {rolle.rolletype !== Rolletype.BM && <PersonIdent ident={rolle.ident} />}
                                </div>
                            }
                        />
                    ))}
                </Tabs.List>
                {virkningstidspunktV2Roller.map(({ rolle }) => {
                    return (
                        <Tabs.Panel value={rolle.id.toString()} key={rolle.id.toString()} className="grid gap-y-4">
                            <VirkningstidspunktForm rolleId={rolle.id} />
                        </Tabs.Panel>
                    );
                })}
            </Tabs>
        </QueryErrorWrapper>
    );
};
