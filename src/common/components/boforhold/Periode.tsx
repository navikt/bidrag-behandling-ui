import { BostatusperiodeDto, HusstandsmedlemDtoV2, TypeBehandling } from "@api/BidragBehandlingApiV1";
import { FormControlledMonthPicker } from "@common/components/formFields/FormControlledMonthPicker";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { getEitherFirstDayOfFoedselsOrVirkingsdatoMonth } from "@common/helpers/virkningstidspunktHelpers";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { useFomTomDato } from "@common/hooks/useFomTomDato";
import { useVirkningsdato } from "@common/hooks/useVirkningsdato";
import { ObjectUtils } from "@navikt/bidrag-ui-common";
import { dateOrNull, DateToDDMMYYYYString, isAfterDate } from "@utils/date-utils";
import React from "react";
import { useFormContext } from "react-hook-form";

import { BoforholdFormValues } from "../../types/boforholdFormValues";

export const Periode = ({
    editableRow,
    item,
    field,
    fieldName,
    barn,
    label,
}: {
    editableRow: boolean;
    item: BostatusperiodeDto;
    fieldName: `husstandsbarn.${number}.perioder.${number}`;
    field: "datoFom" | "datoTom";
    barn: HusstandsmedlemDtoV2;
    label: string;
}) => {
    const virkningsOrSoktFraDato = useVirkningsdato();
    const { type } = useGetBehandlingV2();
    const { erVirkningstidspunktNåværendeMånedEllerFramITid, lesemodus } = useBehandlingProvider();
    const { getValues, clearErrors, setError } = useFormContext<BoforholdFormValues>();
    const datoFra = getEitherFirstDayOfFoedselsOrVirkingsdatoMonth(barn.fødselsdato, virkningsOrSoktFraDato);
    const fieldIsDatoTom = field === "datoTom";
    const [fom, tom] = useFomTomDato(fieldIsDatoTom, datoFra);
    const isSærbidragTypeAndFieldIsDatoFom = type === TypeBehandling.SAeRBIDRAG && !fieldIsDatoTom;

    const validateFomOgTom = () => {
        const periode = getValues(fieldName);
        const fomOgTomInvalid = !ObjectUtils.isEmpty(periode.datoTom) && isAfterDate(periode?.datoFom, periode.datoTom);

        if (fomOgTomInvalid) {
            setError(`${fieldName}.datoFom`, {
                type: "notValid",
                message: text.error.tomDatoKanIkkeVæreFørFomDato,
            });
        } else {
            clearErrors(`${fieldName}.datoFom`);
        }
    };

    return !isSærbidragTypeAndFieldIsDatoFom && editableRow && !erVirkningstidspunktNåværendeMånedEllerFramITid ? (
        <FormControlledMonthPicker
            name={`${fieldName}.${field}`}
            label={label}
            placeholder="DD.MM.ÅÅÅÅ"
            defaultValue={item[field]}
            customValidation={validateFomOgTom}
            fromDate={fom}
            toDate={tom}
            lastDayOfMonthPicker={fieldIsDatoTom}
            required={!fieldIsDatoTom}
            readonly={lesemodus}
            hideLabel
        />
    ) : (
        <div className="h-6 flex items-center">{item[field] && DateToDDMMYYYYString(dateOrNull(item[field]))}</div>
    );
};
