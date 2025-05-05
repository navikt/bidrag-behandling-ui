import {
    EksisterendeOpphorsvedtakDto,
    OppdatereVirkningstidspunkt,
    Resultatkode,
    Rolletype,
    Stonadstype,
    TypeArsakstype,
    Vedtakstype,
    VirkningstidspunktDtoV2,
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
import { getFirstDayOfMonthAfterEighteenYears, isOver18YearsOld } from "@common/helpers/boforholdFormHelpers";
import {
    aarsakToVirkningstidspunktMapper,
    getFomAndTomForMonthPicker,
} from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useDebounce } from "@common/hooks/useDebounce";
import { hentVisningsnavn, hentVisningsnavnVedtakstype } from "@common/hooks/useVisningsnavn";
import { ObjectUtils, toISODateString } from "@navikt/bidrag-ui-common";
import { BodyShort, Label, Tabs } from "@navikt/ds-react";
import { addMonths, dateOrNull, DateToDDMMYYYYString, deductMonths } from "@utils/date-utils";
import { removePlaceholder } from "@utils/string-utils";
import { getSearchParam } from "@utils/window-utils";
import React, { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { CustomTextareaEditor } from "../../../../common/components/CustomEditor";
import { STEPS } from "../../../constants/steps";
import { BarnebidragStepper } from "../../../enum/BarnebidragStepper";
import { useOnSaveVirkningstidspunkt } from "../../../hooks/useOnSaveVirkningstidspunkt";
import { useOnUpdateOpphørsdato } from "../../../hooks/useOnUpdateOpphørsdato";
import { OpphørsVarighet, VirkningstidspunktFormValues } from "../../../types/virkningstidspunktFormValues";

const årsakListe = [
    TypeArsakstype.FRABARNETSFODSEL,
    TypeArsakstype.FRABARNETSFLYTTEMANED,
    TypeArsakstype.FRA_SAMLIVSBRUDD,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.TREARSREGELEN,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
    TypeArsakstype.FRAMANEDENETTERPRIVATAVTALE,
    TypeArsakstype.BIDRAGSPLIKTIGHARIKKEBIDRATTTILFORSORGELSE,
];
const årsakListe18årsBidrag = [
    TypeArsakstype.FRAMANEDENETTERFYLTE18AR,
    TypeArsakstype.FRABARNETSFLYTTEMANED,
    TypeArsakstype.FRA_SAMLIVSBRUDD,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.TREARSREGELEN,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
    TypeArsakstype.FRAMANEDENETTERPRIVATAVTALE,
    TypeArsakstype.BIDRAGSPLIKTIGHARIKKEBIDRATTTILFORSORGELSE,
];
const harLøpendeBidragÅrsakListe = [
    TypeArsakstype.MANEDETTERBETALTFORFALTBIDRAG,
    TypeArsakstype.FRA_ENDRINGSTIDSPUNKT,
    TypeArsakstype.FRASOKNADSTIDSPUNKT,
    TypeArsakstype.FRA_KRAVFREMSETTELSE,
];
const avslagsListe = [Resultatkode.IKKE_OMSORG_FOR_BARNET, Resultatkode.BIDRAGSPLIKTIGERDOD];
const avslagsListe18År = [Resultatkode.IKKE_DOKUMENTERT_SKOLEGANG, Resultatkode.BIDRAGSPLIKTIGERDOD];
const avslagsListe18ÅrOpphør = [
    Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT,
    Resultatkode.AVSLUTTET_SKOLEGANG,
    Resultatkode.BIDRAGSPLIKTIGERDOD,
];
const avslagsListeOpphør = [
    Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT,
    Resultatkode.IKKE_OMSORG_FOR_BARNET,
    Resultatkode.BIDRAGSPLIKTIGERDOD,
];

const avslaglisteAlle = Array.from(
    new Set([...avslagsListe, ...avslagsListe18År, ...avslagsListe18ÅrOpphør, ...avslagsListeOpphør])
);
const årsakslisteAlle = Array.from(new Set([...årsakListe, ...årsakListe18årsBidrag, ...harLøpendeBidragÅrsakListe]));
const avslagsListeDeprekert = [Resultatkode.IKKESOKTOMINNKREVINGAVBIDRAG];

const getDefaultOpphørsvarighet = (opphørsdato: string, stønadstype: Stonadstype, eksisterendeOpphør?: string) => {
    const opphørsdatoSameAsEkisterende = opphørsdato === eksisterendeOpphør;
    const varighet = opphørsdatoSameAsEkisterende ? OpphørsVarighet.FORTSETTE_OPPHØR : OpphørsVarighet.VELG_OPPHØRSDATO;

    if (stønadstype === Stonadstype.BIDRAG18AAR) {
        return varighet;
    }
    if (!opphørsdato) {
        return OpphørsVarighet.LØPENDE;
    }
    return varighet;
};

const createInitialValues = (
    response: VirkningstidspunktDtoV2,
    stønadstype: Stonadstype
): VirkningstidspunktFormValues => {
    const opphørsvarighet = getDefaultOpphørsvarighet(response.opphørsdato, stønadstype);

    return {
        opphørsvarighet,
        virkningstidspunkt: response.virkningstidspunkt,
        årsakAvslag: response.årsak ?? response.avslag ?? "",
        begrunnelse: response.begrunnelse?.innhold,
        opphørsdato: response.opphørsdato ?? null,
    };
};

const createPayload = (values: VirkningstidspunktFormValues): OppdatereVirkningstidspunkt => {
    const årsak = [...årsakListe, ...årsakListe18årsBidrag, ...harLøpendeBidragÅrsakListe].find(
        (value) => value === values.årsakAvslag
    );
    const avslag = [...avslagsListe, ...avslagsListe18År, ...avslagsListe18ÅrOpphør, ...avslagsListeOpphør].find(
        (value) => value === values.årsakAvslag
    );
    return {
        virkningstidspunkt: values.virkningstidspunkt,
        årsak,
        avslag,
        oppdatereBegrunnelse: {
            nyBegrunnelse: values.begrunnelse,
        },
    };
};

const getOpphørOptions = (
    eksisterendeOpphør: EksisterendeOpphorsvedtakDto,
    stønadstype: Stonadstype,
    fødselsdato: string
) => {
    if (
        stønadstype === Stonadstype.BIDRAG18AAR ||
        (stønadstype === Stonadstype.BIDRAG && isOver18YearsOld(fødselsdato))
    ) {
        if (eksisterendeOpphør) {
            return [OpphørsVarighet.VELG_OPPHØRSDATO, OpphørsVarighet.FORTSETTE_OPPHØR];
        } else {
            return [OpphørsVarighet.VELG_OPPHØRSDATO];
        }
    }

    if (eksisterendeOpphør) {
        return [OpphørsVarighet.LØPENDE, OpphørsVarighet.VELG_OPPHØRSDATO, OpphørsVarighet.FORTSETTE_OPPHØR];
    } else {
        return [OpphørsVarighet.LØPENDE, OpphørsVarighet.VELG_OPPHØRSDATO];
    }
};

const Main = ({ rolleId, initialValues, previousValues, setPreviousValues, showChangedVirkningsDatoAlert }) => {
    const { lesemodus } = useBehandlingProvider();
    const behandling = useGetBehandlingV2();
    const { setValue, clearErrors, getValues } = useFormContext();
    const kunEtBarnIBehandlingen = behandling.roller.filter((rolle) => rolle.rolletype === Rolletype.BA).length === 1;
    const selectedVirkningstidspunkt = behandling.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId);

    const onAarsakSelect = (value: string) => {
        const date = aarsakToVirkningstidspunktMapper(value, behandling, selectedVirkningstidspunkt);
        setValue("virkningstidspunkt", date ? toISODateString(date) : null);
        clearErrors("virkningstidspunkt");
    };
    const erÅrsakAvslagIkkeValgt = getValues("årsakAvslag") === "";

    const [fom] = getFomAndTomForMonthPicker(new Date(behandling.søktFomDato));

    const tom = useMemo(() => {
        const opprinneligVirkningstidspunkt = dateOrNull(selectedVirkningstidspunkt.opprinneligVirkningstidspunkt);
        const opphørsdato = dateOrNull(selectedVirkningstidspunkt.opphørsdato);
        if (opprinneligVirkningstidspunkt) return opprinneligVirkningstidspunkt;
        if (opphørsdato) return deductMonths(opphørsdato, 1);
        return addMonths(new Date(), 50 * 12);
    }, [selectedVirkningstidspunkt.opprinneligVirkningstidspunkt, selectedVirkningstidspunkt.opphørsdato]);

    const erTypeOpphør = behandling.vedtakstype === Vedtakstype.OPPHOR;
    const erTypeOpphørOrLøpendeBidrag = erTypeOpphør || selectedVirkningstidspunkt.harLøpendeBidrag;
    const er18ÅrsBidrag = behandling.stønadstype === Stonadstype.BIDRAG18AAR;
    const virkningsårsaker = lesemodus
        ? årsakslisteAlle
        : er18ÅrsBidrag
          ? årsakListe18årsBidrag
          : selectedVirkningstidspunkt.harLøpendeBidrag
            ? harLøpendeBidragÅrsakListe
            : årsakListe;

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
                    {!lesemodus && !erTypeOpphør && (
                        <optgroup label={text.label.årsak}>
                            {virkningsårsaker
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

                    {!lesemodus && er18ÅrsBidrag ? (
                        <optgroup label={erTypeOpphørOrLøpendeBidrag ? text.label.opphør : text.label.avslag}>
                            {(erTypeOpphørOrLøpendeBidrag ? avslagsListe18ÅrOpphør : avslagsListe18År).map((value) => (
                                <option key={value} value={value}>
                                    {hentVisningsnavnVedtakstype(value, behandling.vedtakstype)}
                                </option>
                            ))}
                        </optgroup>
                    ) : (
                        <optgroup label={erTypeOpphørOrLøpendeBidrag ? text.label.opphør : text.label.avslag}>
                            {(lesemodus
                                ? avslaglisteAlle
                                : erTypeOpphørOrLøpendeBidrag
                                  ? avslagsListeOpphør.filter((value) =>
                                        erTypeOpphør
                                            ? value !== Resultatkode.IKKESTERKNOKGRUNNOGBIDRAGETHAROPPHORT
                                            : true
                                    )
                                  : avslagsListe
                            ).map((value) => (
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
            <Opphør
                initialValues={initialValues}
                previousValues={previousValues}
                setPreviousValues={setPreviousValues}
                rolleId={rolleId}
            />
        </>
    );
};

const Opphør = ({ initialValues, previousValues, setPreviousValues, rolleId }) => {
    const behandling = useGetBehandlingV2();
    const selectedVirkningstidspunkt = behandling.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId);
    const { setSaveErrorState } = useBehandlingProvider();
    const oppdaterOpphørsdato = useOnUpdateOpphørsdato();
    const { getValues, reset, setValue } = useFormContext();
    const [opphørsvarighet, setOpphørsvarighet] = useState(getValues("opphørsvarighet"));
    const opphørsvarighetIsLøpende = opphørsvarighet === OpphørsVarighet.LØPENDE;
    const tom = useMemo(() => {
        if (behandling.stønadstype === Stonadstype.BIDRAG)
            return getFirstDayOfMonthAfterEighteenYears(new Date(selectedVirkningstidspunkt.rolle.fødselsdato));
        return addMonths(new Date(), 50 * 12);
    }, []);

    const updateOpphørsdato = () => {
        const values = getValues();
        oppdaterOpphørsdato.mutation.mutate(
            { idRolle: selectedVirkningstidspunkt.rolle.id, opphørsdato: values.opphørsdato },
            {
                onSuccess: (response) => {
                    oppdaterOpphørsdato.queryClientUpdater((currentData) => {
                        return {
                            ...currentData,
                            ...response,
                        };
                    });
                    setPreviousValues(
                        createInitialValues(
                            response.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId),
                            response.stønadstype
                        )
                    );
                },
                onError: () => {
                    setSaveErrorState({
                        error: true,
                        retryFn: () => updateOpphørsdato(),
                        rollbackFn: () => {
                            reset(previousValues, {
                                keepIsSubmitSuccessful: true,
                                keepDirty: true,
                                keepIsSubmitted: true,
                            });
                        },
                    });
                },
            }
        );
    };

    const onMonthChange = (date) => {
        const currentDate = getValues("opphørsdato");
        if (date && date !== currentDate) {
            setValue("opphørsdato", date);
            updateOpphørsdato();
        }
    };

    const onSelectVarighet = (value) => {
        setOpphørsvarighet(value);
        if (value === OpphørsVarighet.LØPENDE) {
            setValue("opphørsdato", null);
            updateOpphørsdato();
        }
    };

    if (behandling.virkningstidspunkt.avslag != null) return null;
    return (
        <>
            {selectedVirkningstidspunkt.eksisterendeOpphør && (
                <BehandlingAlert variant="info" className="!w-[520px]">
                    <BodyShort>
                        {removePlaceholder(
                            text.alert.bidragOpphørt,
                            DateToDDMMYYYYString(dateOrNull(selectedVirkningstidspunkt.eksisterendeOpphør.opphørsdato)),
                            DateToDDMMYYYYString(dateOrNull(selectedVirkningstidspunkt.eksisterendeOpphør.vedtaksdato))
                        )}
                    </BodyShort>
                </BehandlingAlert>
            )}
            <FlexRow className="gap-x-8">
                <FormControlledSelectField
                    name="opphørsvarighet"
                    label={text.label.varighet}
                    className="w-max"
                    onSelect={(value) => onSelectVarighet(value)}
                >
                    {getOpphørOptions(
                        selectedVirkningstidspunkt.eksisterendeOpphør,
                        behandling.stønadstype,
                        selectedVirkningstidspunkt.rolle.fødselsdato
                    ).map((value) => (
                        <option key={value} value={value}>
                            {value}
                        </option>
                    ))}
                </FormControlledSelectField>
                {!opphørsvarighetIsLøpende && (
                    <FormControlledMonthPicker
                        name="opphørsdato"
                        onChange={(date) => onMonthChange(date)}
                        label={text.label.opphørsdato}
                        defaultValue={initialValues.virkningstidspunkt}
                        placeholder="DD.MM.ÅÅÅÅ"
                        fromDate={addMonths(initialValues.virkningstidspunkt, 1)}
                        toDate={tom}
                        required
                    />
                )}
            </FlexRow>
        </>
    );
};

const Side = () => {
    const { onStepChange } = useBehandlingProvider();
    const {
        gebyr,
        virkningstidspunkt: { begrunnelseFraOpprinneligVedtak },
    } = useGetBehandlingV2();
    const useFormMethods = useFormContext();
    const årsakAvslag = useFormMethods.getValues("årsakAvslag");
    const onNext = () =>
        onStepChange(
            avslaglisteAlle.includes(årsakAvslag)
                ? gebyr !== undefined
                    ? STEPS[BarnebidragStepper.GEBYR]
                    : STEPS[BarnebidragStepper.VEDTAK]
                : STEPS[BarnebidragStepper.UNDERHOLDSKOSTNAD]
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

const VirkningstidspunktForm = ({ rolleId }: { rolleId: number }) => {
    const { virkningstidspunktV2, stønadstype } = useGetBehandlingV2();
    const { setPageErrorsOrUnsavedState, setSaveErrorState } = useBehandlingProvider();
    const virkningstidspunkt = virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId);
    const oppdaterBehandling = useOnSaveVirkningstidspunkt();
    const initialValues = createInitialValues(virkningstidspunkt, stønadstype);
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
                (name !== "begrunnelse" && type === undefined) ||
                name === "opphørsvarighet" ||
                name === "opphørsdato"
            ) {
                return;
            }
            debouncedOnSave();
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
                        samvær: response.samvær,
                        underholdskostnader: response.underholdskostnader,
                        gebyr: response.gebyr,
                        ikkeAktiverteEndringerIGrunnlagsdata: response.ikkeAktiverteEndringerIGrunnlagsdata,
                    };
                });
                //TODO: Dette må tilpasses per barn i V3 av bidrag
                const initialValues = createInitialValues(
                    response.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId),
                    response.stønadstype
                );
                useFormMethods.setValue("opphørsdato", initialValues.opphørsdato);
                useFormMethods.setValue("opphørsvarighet", initialValues.opphørsvarighet);
                setPreviousValues(
                    createInitialValues(
                        response.virkningstidspunktV2.find(({ rolle }) => rolle.id === rolleId),
                        response.stønadstype
                    )
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
                                previousValues={previousValues}
                                setPreviousValues={setPreviousValues}
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

    console.log(virkningstidspunktV2Roller);

    const defaultTab = useMemo(() => {
        const roleId = virkningstidspunktV2Roller
            .find(({ rolle }) => rolle.id?.toString() === getSearchParam(urlSearchParams.tab))
            ?.rolle?.id?.toString();
        return roleId ?? virkningstidspunktV2Roller[0].rolle.id.toString();
    }, []);

    const selectedTab = searchParams.get(behandlingQueryKeys.tab) ?? defaultTab;

    return (
        <QueryErrorWrapper>
            {virkningstidspunktV2Roller.length > 0 && (
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
            )}
        </QueryErrorWrapper>
    );
};
