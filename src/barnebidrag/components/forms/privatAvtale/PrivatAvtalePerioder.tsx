import text from "@common/constants/texts";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { OppdaterePrivatAvtaleRequest, PrivatAvtaleType, Vedtakstype } from "../../../../api/BidragBehandlingApiV1";
import { FormControlledMonthPicker } from "../../../../common/components/formFields/FormControlledMonthPicker";
import { FormControlledSelectField } from "../../../../common/components/formFields/FormControlledSelectField";
import { FormControlledSwitch } from "../../../../common/components/formFields/FormControlledSwitch";
import { FlexRow } from "../../../../common/components/layout/grid/FlexRow";
import { useBehandlingProvider } from "../../../../common/context/BehandlingContext";
import { useGetBehandlingV2, useRefetchFFInfo } from "../../../../common/hooks/useApiData";
import { useDebounce } from "../../../../common/hooks/useDebounce";
import { hentVisningsnavn } from "../../../../common/hooks/useVisningsnavn";
import { useOnDeletePrivatAvtale } from "../../../hooks/useOnDeletePrivatAvtale";
import { useOnUpdatePrivatAvtale } from "../../../hooks/useOnUpdatePrivatAvtale";
import { PrivatAvtaleFormValue, PrivatAvtaleFormValues } from "../../../types/privatAvtaleFormValues";
import { VedtaksListeBeregning } from "../../Vedtakliste";
import { BeregnetTabel } from "./BeregnetTabel";
import { Perioder } from "./Perioder";
import { getFomForPrivatAvtale, getTomForPrivatAvtale, RemoveButton } from "./PrivatAvtale";

export const PrivatAvtalePerioder = ({
    prefix = "roller",
    item,
    barnIndex,
    initialValues,
}: {
    prefix: "roller" | "andreBarn";
    item: PrivatAvtaleFormValue;
    barnIndex: number;
    initialValues: PrivatAvtaleFormValues;
}) => {
    const { privatAvtale, stønadstype, vedtakstype, virkningstidspunktV2 } = useGetBehandlingV2();
    const { setSaveErrorState, lesemodus } = useBehandlingProvider();
    const deletePrivatAvtale = useOnDeletePrivatAvtale();
    const updatePrivatAvtaleQuery = useOnUpdatePrivatAvtale(item.privatAvtale.avtaleId);
    const manuelleVedtak = virkningstidspunktV2.find(
        (virkingstingspunkt) => virkingstingspunkt.rolle.ident === item.gjelderBarn.ident
    )?.manuelleVedtak;
    const selectedPrivatAvtale = privatAvtale.find((avtale) => avtale.id === item.privatAvtale.avtaleId);
    const beregnetPrivatAvtale = selectedPrivatAvtale?.beregnetPrivatAvtale;
    const valideringsfeil = selectedPrivatAvtale?.valideringsfeil;
    const isInnkrevingOgVedtakFraNav =
        vedtakstype === Vedtakstype.INNKREVING && item.privatAvtale.avtaleType === PrivatAvtaleType.VEDTAK_FRA_NAV;
    const { watch, setValue, setError, getFieldState } = useFormContext<PrivatAvtaleFormValues>();
    const fom = useMemo(() => {
        return getFomForPrivatAvtale(stønadstype, selectedPrivatAvtale.gjelderBarn.fødselsdato);
    }, [stønadstype, selectedPrivatAvtale.gjelderBarn.fødselsdato]);
    const tom = useMemo(
        () => getTomForPrivatAvtale(selectedPrivatAvtale.gjelderBarn.fødselsdato),
        [selectedPrivatAvtale.gjelderBarn.fødselsdato]
    );
    const refetchFFInfo = useRefetchFFInfo();

    useEffect(() => {
        const { error: avtaleDatoError } = getFieldState(`${prefix}.${barnIndex}.privatAvtale.avtaleDato`);
        const { error: manglerBegrunnelseError } = getFieldState(`${prefix}.${barnIndex}.privatAvtale.begrunnelse`);
        if (valideringsfeil?.manglerAvtaledato && !avtaleDatoError) {
            setError(`${prefix}.${barnIndex}.privatAvtale.avtaleDato`, {
                type: "notValid",
                message: text.error.feltErPåkrevd,
            });
        }
        if (valideringsfeil?.manglerBegrunnelse && !manglerBegrunnelseError) {
            setError(`${prefix}.${barnIndex}.privatAvtale.begrunnelse`, {
                type: "notValid",
                message: text.error.feltErPåkrevd,
            });
        }
    }, [valideringsfeil?.manglerAvtaledato, valideringsfeil?.manglerBegrunnelse]);

    const onDeletePrivatAvtale = () => {
        deletePrivatAvtale.mutation.mutate(item.privatAvtale.avtaleId, {
            onSuccess: () => {
                setValue(`${prefix}.${barnIndex}.privatAvtale`, null);
                deletePrivatAvtale.queryClientUpdater((currentData) => ({
                    ...currentData,
                    privatAvtale: currentData.privatAvtale.filter(
                        (avtale) => avtale.gjelderBarn.ident !== item.gjelderBarn.ident
                    ),
                }));
                refetchFFInfo();
            },
            onError: () => {
                setSaveErrorState({
                    error: true,
                    retryFn: () => onDeletePrivatAvtale(),
                });
            },
        });
    };

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
            if (name === `${prefix}.${barnIndex}.privatAvtale.begrunnelse`) {
                const payload = { begrunnelse: value[prefix][barnIndex].privatAvtale.begrunnelse };
                debouncedOnSave(payload);
            }
            if (name === `andreBarnBegrunnelse`) {
                const payload = { andreBarnBegrunnelse: value.andreBarnBegrunnelse };
                debouncedOnSave(payload);
            }
            if (
                name === `${prefix}.${barnIndex}.privatAvtale.avtaleDato` &&
                value[prefix][barnIndex].privatAvtale.avtaleDato
            ) {
                const payload = { avtaleDato: value[prefix][barnIndex].privatAvtale.avtaleDato };
                updatePrivatAvtale(payload);
            }

            if (
                name === `${prefix}.${barnIndex}.privatAvtale.avtaleType` &&
                value[prefix][barnIndex].privatAvtale.avtaleType
            ) {
                const payload = {
                    avtaleType: value[prefix][barnIndex].privatAvtale.avtaleType as PrivatAvtaleType,
                };
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
            <FlexRow className="justify-between">
                <div className="flex flex-row gap-2">
                    <FormControlledMonthPicker
                        name={`${prefix}.${barnIndex}.privatAvtale.avtaleDato`}
                        label={text.label.avtaleDato}
                        placeholder="DD.MM.ÅÅÅÅ"
                        defaultValue={initialValues[prefix][barnIndex].privatAvtale?.avtaleDato ?? null}
                        fromDate={fom}
                        toDate={tom}
                        readonly={lesemodus || isInnkrevingOgVedtakFraNav}
                        required
                    />
                    <FormControlledSelectField
                        name={`${prefix}.${barnIndex}.privatAvtale.avtaleType`}
                        label={"Avtaletype"}
                        className="w-max max-h-[10px]"
                    >
                        {Object.keys(PrivatAvtaleType)
                            .filter((value) =>
                                value === PrivatAvtaleType.VEDTAK_FRA_NAV ? !!manuelleVedtak?.length : true
                            )
                            .map((value) => (
                                <option key={value} value={value}>
                                    {hentVisningsnavn(value)}
                                </option>
                            ))}
                    </FormControlledSelectField>
                </div>
                <RemoveButton onDelete={onDeletePrivatAvtale} />
            </FlexRow>
            {!isInnkrevingOgVedtakFraNav && (
                <Perioder
                    prefix={prefix}
                    barnIndex={barnIndex}
                    item={item.privatAvtale}
                    valideringsfeil={valideringsfeil}
                />
            )}
            {isInnkrevingOgVedtakFraNav && (
                <VedtaksListeBeregning barnIdent={item.gjelderBarn.ident} omgjøring={false} />
            )}
            <FlexRow>
                <FormControlledSwitch
                    name={`${prefix}.${barnIndex}.privatAvtale.skalIndeksreguleres`}
                    legend={text.label.skalIndeksreguleres}
                    onChange={onToggle}
                    readOnly={!item.privatAvtale.perioder.length || isInnkrevingOgVedtakFraNav}
                />
            </FlexRow>
            {item.privatAvtale.skalIndeksreguleres && beregnetPrivatAvtale?.perioder && (
                <BeregnetTabel perioder={beregnetPrivatAvtale.perioder} />
            )}
        </>
    );
};
