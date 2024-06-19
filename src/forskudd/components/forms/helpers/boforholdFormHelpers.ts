import {
    BoforholdDtoV2,
    Bostatuskode,
    HusstandsbarnDtoV2,
    HusstandsbarnperiodeDto,
    Kilde,
    RolleDto,
    SivilstandDto,
    Sivilstandskode,
} from "@api/BidragBehandlingApiV1";
import { RelatertPersonGrunnlagDto, SivilstandGrunnlagDto, SivilstandskodePDL } from "@api/BidragGrunnlagApi";
import text from "@common/constants/texts";
import { firstDayOfMonth } from "@navikt/bidrag-ui-common";
import {
    addDays,
    dateOrNull,
    deductDays,
    deductMonths,
    isAfterDate,
    isAfterEqualsDate,
    isBeforeDate,
    lastDayOfMonth,
    periodCoversMinOneFullCalendarMonth,
    toISODateString,
} from "@utils/date-utils";
import { removePlaceholder } from "@utils/string-utils";

import {
    BoforholdFormValues,
    BoforholdOpplysninger,
    HusstandOpplysningFraFolkeRegistre,
    HusstandOpplysningPeriode,
    ParsedBoforholdOpplysninger,
    SavedOpplysningFraFolkeRegistrePeriode,
    SivilstandOpplysninger,
} from "../../../types/boforholdFormValues";
export const boststatusOver18År = [Bostatuskode.REGNES_IKKE_SOM_BARN, Bostatuskode.DOKUMENTERT_SKOLEGANG];
export const boforholdForskuddOptions = {
    under18År: [Bostatuskode.MED_FORELDER, Bostatuskode.IKKE_MED_FORELDER],
    likEllerOver18År: [...boststatusOver18År, Bostatuskode.MED_FORELDER, Bostatuskode.IKKE_MED_FORELDER],
};
export const sivilstandForskuddOptions = [Sivilstandskode.GIFT_SAMBOER, Sivilstandskode.BOR_ALENE_MED_BARN];
export const calculateFraDato = (
    fieldArrayValues: HusstandsbarnperiodeDto[] | SivilstandDto[],
    virkningstidspunkt: Date
) => {
    if (
        fieldArrayValues.length &&
        !fieldArrayValues.some((periode: HusstandsbarnperiodeDto | SivilstandDto) => periode.datoTom === null)
    ) {
        const filtrertOgSorterListe = fieldArrayValues.sort(
            (a: HusstandsbarnperiodeDto | SivilstandDto, b: HusstandsbarnperiodeDto | SivilstandDto) => {
                if (a.datoTom == null || b.datoTom == null) {
                    return a.datoTom == null ? 1 : -1;
                }
                return new Date(a.datoTom).getTime() - new Date(b.datoTom).getTime();
            }
        );
        const lastDatoTom = filtrertOgSorterListe[filtrertOgSorterListe.length - 1].datoTom;
        return lastDatoTom == null ? null : toISODateString(addDays(new Date(lastDatoTom), 1));
    }

    if (!fieldArrayValues.length) {
        return toISODateString(virkningstidspunkt);
    }
    return null;
};
function calculateAge(dateOfBirth: Date | string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    // Check if the birthday has occurred this year
    const hasBirthdayOccurred =
        today.getMonth() > birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    // If the birthday hasn't occurred yet, subtract 1 from the age
    if (!hasBirthdayOccurred) {
        age--;
    }

    return age;
}
export function getFirstDayOfMonthAfterEighteenYears(dateOfBirth: Date): Date {
    const eighteenYearsLater = new Date(dateOfBirth);
    eighteenYearsLater.setFullYear(eighteenYearsLater.getFullYear() + 18, eighteenYearsLater.getMonth() + 1, 1);

    return eighteenYearsLater;
}
export const isOver18YearsOld = (dateOfBirth: Date | string): boolean => calculateAge(dateOfBirth) >= 18;
export const fillInPeriodGaps = (egneBarnIHusstanden: RelatertPersonGrunnlagDto) => {
    const perioder: HusstandOpplysningPeriode[] = [];
    const fodselsdato = dateOrNull(egneBarnIHusstanden.fødselsdato);
    egneBarnIHusstanden.borISammeHusstandDtoListe.forEach((periode, i) => {
        const firstPeriod = i === 0;
        const lastPeriod = i === egneBarnIHusstanden.borISammeHusstandDtoListe.length - 1;
        const fodselsDatoIsBeforePeriodeFra =
            periode.periodeFra && periode.periodeFra !== egneBarnIHusstanden.fødselsdato
                ? isAfterDate(periode.periodeFra, fodselsdato)
                : false;

        if (firstPeriod && fodselsDatoIsBeforePeriodeFra) {
            perioder.push({
                fraDato: fodselsdato,
                tilDato: deductDays(new Date(periode.periodeFra), 1),
                bostatus: Bostatuskode.IKKE_MED_FORELDER,
            });
        }
        const prevPeriod = perioder[perioder.length - 1];
        const gapBetweenPeriods =
            periode.periodeFra && prevPeriod?.tilDato
                ? isAfterDate(periode.periodeFra, addDays(new Date(prevPeriod.tilDato), 1))
                : false;
        const prevPeriodIsRegistrert = prevPeriod?.bostatus === Bostatuskode.MED_FORELDER;

        if (gapBetweenPeriods) {
            perioder.push({
                fraDato: addDays(new Date(prevPeriod.tilDato), 1),
                tilDato: deductDays(new Date(periode.periodeFra), 1),
                bostatus: Bostatuskode.IKKE_MED_FORELDER,
            });
        }

        if (prevPeriodIsRegistrert && !gapBetweenPeriods) {
            prevPeriod.tilDato =
                periode?.periodeTil && prevPeriod.tilDato
                    ? isAfterDate(periode.periodeTil, prevPeriod.tilDato)
                        ? new Date(periode.periodeTil)
                        : new Date(prevPeriod.tilDato)
                    : null;
        } else {
            perioder.push({
                fraDato: periode.periodeFra ? dateOrNull(periode.periodeFra) : fodselsdato,
                tilDato: dateOrNull(periode.periodeTil),
                bostatus: Bostatuskode.MED_FORELDER,
            });
        }

        if (lastPeriod && periode.periodeTil) {
            perioder.push({
                fraDato: addDays(new Date(periode.periodeTil), 1),
                tilDato: null,
                bostatus: Bostatuskode.IKKE_MED_FORELDER,
            });
        }
    });
    return perioder.sort((a, b) => a.fraDato?.getTime() - b.fraDato?.getTime());
};

export const mapHusstandsMedlemmerToBarn = (husstandmedlemmerOgEgneBarnListe: RelatertPersonGrunnlagDto[]) => {
    return husstandmedlemmerOgEgneBarnListe
        .filter((medlem) => medlem.erBarnAvBmBp)
        .map((barn) => ({
            foedselsdato: barn.fødselsdato,
            ident: barn.relatertPersonPersonId,
            navn: barn.navn,
            perioder: fillInPeriodGaps(barn),
        }));
};

const getSivilstandType = (sivilstand: SivilstandskodePDL): Sivilstandskode => {
    if ([SivilstandskodePDL.GIFT, SivilstandskodePDL.REGISTRERT_PARTNER].includes(sivilstand)) {
        return Sivilstandskode.GIFT_SAMBOER;
    }
    return Sivilstandskode.BOR_ALENE_MED_BARN;
};

export const mapGrunnlagSivilstandToBehandlingSivilstandType = (
    sivilstandListe: SivilstandGrunnlagDto[]
): SivilstandOpplysninger[] => {
    return sivilstandListe.map((sivilstand) => ({
        datoFom: sivilstand.gyldigFom,
        datoTom: null,
        sivilstand: getSivilstandType(sivilstand.type),
    }));
};

export const getEitherFirstDayOfFoedselsOrVirkingsdatoMonth = (
    barnsFoedselsDato: Date | string,
    virkningsOrSoktFraDato: Date
) => {
    const date =
        barnsFoedselsDato && isAfterDate(barnsFoedselsDato, virkningsOrSoktFraDato)
            ? new Date(barnsFoedselsDato)
            : virkningsOrSoktFraDato;

    return firstDayOfMonth(date);
};

const periodIsAfterVirkningstidspunkt =
    (virkningsOrSoktFraDato: Date) =>
    ({ datoTom }: { datoTom: string }) =>
        datoTom === null || (datoTom && isAfterDate(datoTom, virkningsOrSoktFraDato));
export const getSivilstandPerioder = (
    sivilstandListe: SivilstandOpplysninger[],
    virkningsOrSoktFraDato: Date
): SivilstandDto[] => {
    const perioderEtterVirkningstidspunkt = sivilstandListe?.filter(
        periodIsAfterVirkningstidspunkt(virkningsOrSoktFraDato)
    );

    const result: {
        sivilstand: Sivilstandskode;
        kilde: Kilde;
        datoFom: string;
        datoTom: string | null;
    }[] = [];
    perioderEtterVirkningstidspunkt?.forEach(({ datoTom, sivilstand }) => {
        const prevPeriode = result[result.length - 1];
        const hasSameStatus = prevPeriode?.sivilstand === sivilstand;
        const coversAtLeastOneCalendarMonth = datoTom
            ? periodCoversMinOneFullCalendarMonth(new Date(datoTom), new Date(datoTom))
            : true;
        const tilDato = coversAtLeastOneCalendarMonth
            ? toISODateString(dateOrNull(datoTom))
            : toISODateString(lastDayOfMonth(deductMonths(new Date(datoTom), 1)));

        if (hasSameStatus) {
            prevPeriode.datoTom = tilDato;
        }

        if (!hasSameStatus) {
            result.push({
                sivilstand,
                datoFom: toISODateString(
                    result.length === 0
                        ? virkningsOrSoktFraDato
                        : addDays(new Date(result[result.length - 1].datoTom), 1)
                ),
                datoTom: tilDato,
                kilde: Kilde.OFFENTLIG,
            });
        }
    });

    return result;
};

export const createInitialValues = (boforhold: BoforholdDtoV2): BoforholdFormValues => {
    return {
        ...boforhold,
        husstandsbarn: boforhold.husstandsbarn.sort(compareHusstandsBarn),
        sivilstand: boforhold.sivilstand,
    };
};

export const checkOverlappingPeriods = (perioder: { datoFom?: string; datoTom?: string }[]) => {
    const overlappingPeriods = [];

    for (let i = 0; i < perioder.length; i++) {
        for (let j = i + 1; j < perioder.length; j++) {
            if (
                perioder[i].datoTom === null ||
                (perioder[i].datoTom && isAfterDate(perioder[i].datoTom, perioder[j].datoFom))
            ) {
                overlappingPeriods.push([`${perioder[i].datoTom}`, `${perioder[j].datoFom}`]);
            }
        }
    }

    return overlappingPeriods;
};

const getOppositeBostatus = (bostatus: Bostatuskode): Bostatuskode => {
    switch (bostatus) {
        case Bostatuskode.MED_FORELDER:
            return Bostatuskode.IKKE_MED_FORELDER;
        case Bostatuskode.IKKE_MED_FORELDER:
            return Bostatuskode.MED_FORELDER;
        case Bostatuskode.REGNES_IKKE_SOM_BARN:
            return Bostatuskode.DOKUMENTERT_SKOLEGANG;
        case Bostatuskode.DOKUMENTERT_SKOLEGANG:
            return Bostatuskode.REGNES_IKKE_SOM_BARN;
    }
};
function addPeriodIfThereIsNoRunningPeriod(
    periodsList: HusstandsbarnperiodeDto[],
    monthAfter18?: Date
): HusstandsbarnperiodeDto[];
function addPeriodIfThereIsNoRunningPeriod(periodsList: SivilstandDto[], monthAfter18?: Date): SivilstandDto[];
function addPeriodIfThereIsNoRunningPeriod(
    periodsList: HusstandsbarnperiodeDto[] | SivilstandDto[],
    monthAfter18?: Date
): HusstandsbarnperiodeDto[] | SivilstandDto[] {
    const lastPeriod = periodsList[periodsList.length - 1];
    if (lastPeriod.datoTom) {
        if (Object.hasOwn(lastPeriod, "bostatus")) {
            const lastPeriodBostatus = (lastPeriod as HusstandsbarnperiodeDto).bostatus;
            const firstDayOfNextPeriod = toISODateString(addDays(new Date(lastPeriod.datoTom), 1));
            const firstDayOfNextPeriodIsAfterOrEqualToMonthOf18 = isAfterEqualsDate(firstDayOfNextPeriod, monthAfter18);

            (periodsList as HusstandsbarnperiodeDto[]).push({
                datoFom: firstDayOfNextPeriod,
                datoTom: null,
                bostatus:
                    firstDayOfNextPeriodIsAfterOrEqualToMonthOf18 && !boststatusOver18År.includes(lastPeriodBostatus)
                        ? Bostatuskode.REGNES_IKKE_SOM_BARN
                        : getOppositeBostatus(lastPeriodBostatus),
                kilde: Kilde.MANUELL,
            });
        }

        if (Object.hasOwn(lastPeriod, "sivilstand")) {
            (periodsList as SivilstandDto[]).push({
                datoFom: toISODateString(addDays(new Date(lastPeriod.datoTom), 1)),
                datoTom: null,
                sivilstand:
                    (lastPeriod as SivilstandDto).sivilstand === Sivilstandskode.BOR_ALENE_MED_BARN
                        ? Sivilstandskode.GIFT_SAMBOER
                        : Sivilstandskode.BOR_ALENE_MED_BARN,
                kilde: Kilde.MANUELL,
            });
        }
    }

    return periodsList;
}
function spliceAndInsertPeriods(
    periodsList: HusstandsbarnperiodeDto[] | SivilstandDto[],
    startIndex: number,
    deleteCount: number,
    periodsToInsert: HusstandsbarnperiodeDto[] | SivilstandDto[],
    statusField: "bostatus" | "sivilstand",
    monthAfter18?: Date
): HusstandsbarnperiodeDto[] | SivilstandDto[] {
    if (statusField === "bostatus") {
        const editedPeriods = periodsList.toSpliced(
            startIndex,
            deleteCount,
            ...(periodsToInsert as HusstandsbarnperiodeDto[])
        );
        return addPeriodIfThereIsNoRunningPeriod(editedPeriods as HusstandsbarnperiodeDto[], monthAfter18);
    }

    if (statusField === "sivilstand") {
        const editedPeriods = periodsList.toSpliced(startIndex, deleteCount, ...(periodsToInsert as SivilstandDto[]));
        return addPeriodIfThereIsNoRunningPeriod(editedPeriods as SivilstandDto[]);
    }
}
export function editPeriods(
    periodsList: HusstandsbarnperiodeDto[],
    periodeIndex: number,
    monthAfter18?: Date
): HusstandsbarnperiodeDto[];
export function editPeriods(periodsList: SivilstandDto[], periodeIndex: number, monthAfter18?: Date): SivilstandDto[];
export function editPeriods(
    periodsList: HusstandsbarnperiodeDto[] | SivilstandDto[],
    periodeIndex: number,
    monthAfter18?: Date
): HusstandsbarnperiodeDto[] | SivilstandDto[] {
    const editedPeriod = { ...periodsList[periodeIndex], kilde: Kilde.MANUELL };
    const periodsToInsert = [editedPeriod];
    const statusField = Object.hasOwn(editedPeriod, "bostatus") ? "bostatus" : "sivilstand";
    const periods = periodsList.toSpliced(periodeIndex, 1);
    let startIndex = periods.filter(
        (period) => new Date(period.datoFom).getTime() < new Date(editedPeriod.datoFom).getTime()
    ).length;

    const postPeriodIndex = editedPeriod.datoTom
        ? periods.findIndex(
              (period: HusstandsbarnperiodeDto | SivilstandDto) =>
                  period.datoTom === null || (period.datoTom && isAfterDate(period.datoTom, editedPeriod.datoTom))
          )
        : -1;

    let deleteCount = postPeriodIndex === -1 ? periods.length - startIndex : postPeriodIndex - startIndex;

    const prevPeriodIndex = startIndex ? startIndex - 1 : 0;
    const prevPeriod = startIndex ? periods[prevPeriodIndex] : undefined;
    const postPeriod = postPeriodIndex !== -1 ? periods[postPeriodIndex] : undefined;
    const existingPeriodCoversWholeEditedPeriod = prevPeriod && prevPeriodIndex === postPeriodIndex;

    if (periodeIndex && existingPeriodCoversWholeEditedPeriod) {
        const sameStatus = prevPeriod[statusField] === editedPeriod[statusField];

        if (sameStatus) {
            return periods;
        } else {
            const periodsToInsert = [
                {
                    datoFom: prevPeriod.datoFom,
                    datoTom: toISODateString(deductDays(new Date(editedPeriod.datoFom), 1)),
                    [statusField]: prevPeriod[statusField],
                    kilde: Kilde.MANUELL,
                },
                editedPeriod,
                {
                    datoFom: toISODateString(addDays(new Date(editedPeriod.datoTom), 1)),
                    datoTom: prevPeriod.datoTom,
                    [statusField]: prevPeriod[statusField],
                    kilde: Kilde.MANUELL,
                },
            ];

            return spliceAndInsertPeriods(
                periods,
                prevPeriodIndex,
                1,
                periodsToInsert as HusstandsbarnperiodeDto[] | SivilstandDto[],
                statusField,
                monthAfter18
            );
        }
    }

    if (prevPeriod) {
        const sameStatus = editedPeriod[statusField] === prevPeriod[statusField];

        if (sameStatus) {
            startIndex -= 1;
            deleteCount += 1;
            editedPeriod.datoFom = prevPeriod.datoFom;
        } else {
            const isHusstandPerioder = statusField === "bostatus";
            const datoFomIsAfter18 = isAfterDate(editedPeriod.datoFom, monthAfter18);
            const prevPeriodStatusIsNotOver18 = !boststatusOver18År.includes(prevPeriod[statusField]);
            const limitPrevPeriodDatoTomToUnder18 =
                isHusstandPerioder && datoFomIsAfter18 && prevPeriodStatusIsNotOver18;
            const dayBeforeEditedFom = toISODateString(deductDays(new Date(editedPeriod.datoFom), 1));
            const updatedPrevPeriodDatoTom = limitPrevPeriodDatoTomToUnder18 ? prevPeriod.datoTom : dayBeforeEditedFom;
            const gapBetweenPeriods = updatedPrevPeriodDatoTom !== dayBeforeEditedFom;
            const dateChanged = prevPeriod.datoTom !== updatedPrevPeriodDatoTom;

            prevPeriod.datoTom = updatedPrevPeriodDatoTom;
            prevPeriod.kilde = dateChanged ? Kilde.MANUELL : prevPeriod.kilde;

            if (monthAfter18 && isHusstandPerioder && gapBetweenPeriods) {
                const gapPeriod = {
                    datoFom: toISODateString(monthAfter18),
                    datoTom: dayBeforeEditedFom,
                    bostatus: getOppositeBostatus(editedPeriod[statusField]),
                    kilde: Kilde.MANUELL,
                };
                periodsToInsert.unshift(gapPeriod as HusstandsbarnperiodeDto);
            }
        }
    }

    if (postPeriod) {
        const sameStatus = editedPeriod[statusField] === postPeriod[statusField];

        if (sameStatus) {
            deleteCount += 1;
            editedPeriod.datoTom = postPeriod.datoTom;
        } else {
            const isHusstandPerioder = statusField === "bostatus";
            const datoTomIsBefore18 = isBeforeDate(editedPeriod.datoTom, monthAfter18);
            const postPeriodStatusIsOver18 = boststatusOver18År.includes(postPeriod[statusField]);
            const limitPostPeriodDatoFomToOver18 = isHusstandPerioder && datoTomIsBefore18 && postPeriodStatusIsOver18;
            const dayAfterEditedTom = toISODateString(addDays(new Date(editedPeriod.datoTom), 1));
            const updatedPostPeriodDatoFom = limitPostPeriodDatoFomToOver18 ? postPeriod.datoFom : dayAfterEditedTom;
            const gapBetweenPeriods = updatedPostPeriodDatoFom !== dayAfterEditedTom;
            const dateChanged = postPeriod.datoFom !== updatedPostPeriodDatoFom;

            postPeriod.datoFom = updatedPostPeriodDatoFom;
            postPeriod.kilde = dateChanged ? Kilde.MANUELL : postPeriod.kilde;

            if (monthAfter18 && isHusstandPerioder && gapBetweenPeriods) {
                const gapPeriod = {
                    datoFom: dayAfterEditedTom,
                    datoTom: toISODateString(deductDays(monthAfter18, 1)),
                    bostatus: getOppositeBostatus(editedPeriod[statusField]),
                    kilde: Kilde.MANUELL,
                };
                periodsToInsert.push(gapPeriod as HusstandsbarnperiodeDto);
            }
        }
    }

    return spliceAndInsertPeriods(
        periods,
        startIndex,
        deleteCount,
        periodsToInsert as HusstandsbarnperiodeDto[] | SivilstandDto[],
        statusField,
        monthAfter18
    );
}

export function removeAndEditPeriods(
    periodsList: HusstandsbarnperiodeDto[],
    index: number,
    monthAfter18?: Date
): HusstandsbarnperiodeDto[];
export function removeAndEditPeriods(periodsList: SivilstandDto[], index: number, monthAfter18?: Date): SivilstandDto[];
export function removeAndEditPeriods(
    periodsList: HusstandsbarnperiodeDto[] | SivilstandDto[],
    index: number,
    monthAfter18?: Date
): HusstandsbarnperiodeDto[] | SivilstandDto[] {
    const periodToRemove = periodsList[index];
    const prevPeriod = periodsList[index - 1];
    const postPeriod = periodsList[index + 1];

    if ("bostatus" in periodToRemove) {
        if (
            postPeriod &&
            !boststatusOver18År.includes((prevPeriod as HusstandsbarnperiodeDto).bostatus) &&
            boststatusOver18År.includes((postPeriod as HusstandsbarnperiodeDto).bostatus)
        ) {
            prevPeriod.datoTom = toISODateString(deductDays(monthAfter18, 1));
            prevPeriod.kilde = Kilde.MANUELL;
            return periodsList.filter((_, i) => i !== index) as HusstandsbarnperiodeDto[];
        }
        prevPeriod.datoTom = postPeriod ? postPeriod.datoTom : null;
        prevPeriod.kilde = Kilde.MANUELL;
        return periodsList.filter((_, i) => i !== index && i !== index + 1) as HusstandsbarnperiodeDto[];
    }

    if ("sivilstand" in periodToRemove) {
        prevPeriod.datoTom = postPeriod ? postPeriod.datoTom : null;
        prevPeriod.kilde = Kilde.MANUELL;
        return periodsList.filter((_, i) => i !== index && i !== index + 1) as SivilstandDto[];
    }
}

export const compareOpplysninger = (
    savedOpplysninger: ParsedBoforholdOpplysninger,
    latestOpplysninger: BoforholdOpplysninger
) => {
    const changedLog = [];

    if (savedOpplysninger.husstand.length < latestOpplysninger.husstand.length) {
        changedLog.push(text.alert.flereBarnRegistrertPåAdresse);
    }
    if (savedOpplysninger.husstand.length > latestOpplysninger.husstand.length) {
        changedLog.push(text.alert.færreBarnRegistrertPåAdresse);
    }

    const removed = savedOpplysninger.husstand?.filter(
        (b) => !latestOpplysninger.husstand?.some((barn) => barn.ident === b.ident)
    );

    const added = latestOpplysninger.husstand?.filter(
        (b) => !savedOpplysninger.husstand.some((barn) => barn.ident === b.ident)
    );

    if (added.length) {
        changedLog.push(text.alert.barnSomHarBlittLagtInn);
        added.forEach((barn) => changedLog.push(`${barn.navn} / ${barn.ident}`));
    }

    if (removed.length) {
        changedLog.push(text.alert.barnSomIkkeFinnes);
        removed.forEach((barn) => changedLog.push(`${barn.navn} / ${barn.ident}`));
    }

    savedOpplysninger.husstand.forEach((barn) => {
        const barnInLatestOpplysninger = latestOpplysninger.husstand.find((b) => barn.ident === b.ident);
        const notTheSameNumberOfPeriods =
            barnInLatestOpplysninger && barnInLatestOpplysninger.perioder.length !== barn.perioder.length;
        const statusOrDatesChangedForSomePeriods = (perioder: SavedOpplysningFraFolkeRegistrePeriode[]) => {
            let changed = false;
            perioder.forEach((periode, index) => {
                const periodeFraLatestOpplysninger = barnInLatestOpplysninger?.perioder[index];
                if (periodeFraLatestOpplysninger) {
                    if (
                        toISODateString(dateOrNull(periode.fraDato)) !==
                            toISODateString(periodeFraLatestOpplysninger.fraDato) ||
                        toISODateString(dateOrNull(periode.tilDato)) !==
                            toISODateString(periodeFraLatestOpplysninger.tilDato) ||
                        periode.bostatus !== periodeFraLatestOpplysninger.bostatus
                    ) {
                        changed = true;
                    }
                }
            });

            return changed;
        };
        if (notTheSameNumberOfPeriods || statusOrDatesChangedForSomePeriods(barn.perioder)) {
            changedLog.push(removePlaceholder(text.alert.enEllerFlereBoforholdPerioderEndret, barn.ident));
        }
    });

    const oneOrMoreSivilstandPeriodsChanged = (sivilstandPerioder: SivilstandGrunnlagDto[]) => {
        let changed = false;
        sivilstandPerioder.forEach((periode, index) => {
            const periodeFraLatestOpplysninger = latestOpplysninger.sivilstand[index];
            if (periodeFraLatestOpplysninger) {
                if (
                    periode.gyldigFom !== periodeFraLatestOpplysninger.gyldigFom ||
                    periode.type !== periodeFraLatestOpplysninger.type
                ) {
                    changed = true;
                }
            }
        });
        return changed;
    };

    if (savedOpplysninger.sivilstand.length !== latestOpplysninger.sivilstand.length) {
        changedLog.push(text.alert.antallSivilstandsperioderEndret);
    } else if (oneOrMoreSivilstandPeriodsChanged(savedOpplysninger.sivilstand)) {
        changedLog.push(text.alert.enEllerFlereSivilstandPerioderEndret);
    }

    return changedLog;
};

export const compareHusstandsBarn = (currentBarn: HusstandsbarnDtoV2, nextBarn: HusstandsbarnDtoV2) => {
    if (
        (currentBarn.medIBehandling && nextBarn.medIBehandling) ||
        (!currentBarn.medIBehandling && !nextBarn.medIBehandling)
    ) {
        return new Date(currentBarn.fødselsdato).getTime() - new Date(nextBarn.fødselsdato).getTime();
    }
    if (currentBarn.medIBehandling && !nextBarn.medIBehandling) {
        return -1;
    }
    if (!currentBarn.medIBehandling && nextBarn.medIBehandling) {
        return 1;
    }
};

export const checkPeriodizationErrors = (
    perioderValues: HusstandsbarnperiodeDto[] | SivilstandDto[],
    datoFra: Date
) => {
    const atLeastOneRunningPeriod = perioderValues.some((periode) => !periode?.datoTom);
    const firstDayOfCurrentMonth = firstDayOfMonth(new Date());
    const virkningsDatoIsInFuture = isAfterDate(datoFra, firstDayOfCurrentMonth);
    const futurePeriodExists = perioderValues.some((periode) =>
        virkningsDatoIsInFuture
            ? isAfterDate(periode.datoFom, datoFra)
            : isAfterDate(periode.datoFom, firstDayOfCurrentMonth)
    );
    const firstPeriodIsNotFromVirkningsTidspunkt = isAfterDate(perioderValues[0]?.datoFom, datoFra);
    const errorTypes: string[] = [];

    if (!atLeastOneRunningPeriod) {
        errorTypes.push("ingenLoependePeriode");
    }

    if (futurePeriodExists) {
        errorTypes.push("framoverPeriodisering");
    }

    if (firstPeriodIsNotFromVirkningsTidspunkt) {
        errorTypes.push("hullIPerioder");
    }

    return errorTypes;
};

// Kan fjernes

export const getBarnPerioder = (
    perioder: HusstandOpplysningPeriode[] | SavedOpplysningFraFolkeRegistrePeriode[],
    virkningsOrSoktFraDato: Date,
    barnsFoedselsDato: string
): HusstandsbarnperiodeDto[] => {
    const virkingsdato = getEitherFirstDayOfFoedselsOrVirkingsdatoMonth(barnsFoedselsDato, virkningsOrSoktFraDato);
    const monthAfter18 = getFirstDayOfMonthAfterEighteenYears(new Date(barnsFoedselsDato));
    const isOver18 = isOver18YearsOld(barnsFoedselsDato);
    const periodsBetweenVirkningstidspunktAnd18 = perioder?.filter(
        ({ tilDato, fraDato }) =>
            !isAfterEqualsDate(fraDato, monthAfter18) &&
            (tilDato === null || (tilDato && isAfterDate(tilDato, virkingsdato)))
    );
    const isDateAfter18 = (date: Date | string) => date && isAfterEqualsDate(date, monthAfter18);
    const result: HusstandsbarnperiodeDto[] = [];

    if (isAfterEqualsDate(virkingsdato, monthAfter18)) {
        return [
            {
                datoFom: toISODateString(virkingsdato),
                datoTom: null,
                bostatus: Bostatuskode.REGNES_IKKE_SOM_BARN,
                kilde: Kilde.MANUELL,
            },
        ];
    }

    periodsBetweenVirkningstidspunktAnd18?.forEach(({ fraDato, tilDato, bostatus }) => {
        const isRegistrertPeriode = (bostatus: Bostatuskode) => bostatus === Bostatuskode.MED_FORELDER;
        const prevPeriode = result[result.length - 1];
        const datoFom = toISODateString(
            result.length === 0 ? virkingsdato : addDays(new Date(result[result.length - 1].datoTom), 1)
        );
        const datoTom = tilDato ? toISODateString(lastDayOfMonth(new Date(tilDato))) : null;
        const isPeriodAfter18YearOld = isDateAfter18(datoFom) || datoTom == null || isDateAfter18(datoTom);

        if (boststatusOver18År.includes(prevPeriode?.bostatus)) {
            return;
        }

        if (isPeriodAfter18YearOld && isOver18) {
            if (prevPeriode?.bostatus === bostatus) {
                prevPeriode.datoTom = toISODateString(deductDays(new Date(monthAfter18), 1));
            } else {
                result.push({
                    datoFom,
                    datoTom: toISODateString(deductDays(new Date(monthAfter18), 1)),
                    bostatus,
                    kilde: Kilde.OFFENTLIG,
                });
            }
            result.push({
                datoFom: toISODateString(monthAfter18),
                datoTom: null,
                bostatus: Bostatuskode.REGNES_IKKE_SOM_BARN,
                kilde: Kilde.MANUELL,
            });
        } else if (isRegistrertPeriode(bostatus)) {
            if (prevPeriode && isRegistrertPeriode(prevPeriode.bostatus)) {
                result[result.length - 1].datoTom = datoTom;
            } else {
                result.push({
                    datoFom,
                    datoTom,
                    bostatus,
                    kilde: Kilde.OFFENTLIG,
                });
            }
        } else {
            const coversAtLeastOneCalendarMonth = tilDato
                ? periodCoversMinOneFullCalendarMonth(new Date(fraDato), new Date(tilDato))
                : true;

            if (coversAtLeastOneCalendarMonth) {
                result.push({
                    bostatus,
                    datoFom,
                    datoTom: tilDato ? toISODateString(new Date(tilDato)) : null,
                    kilde: Kilde.OFFENTLIG,
                });
            }
        }
    });

    return result;
};

export const getBarnPerioderFromHusstandsListe = (
    opplysningerFraFolkRegistre: HusstandOpplysningFraFolkeRegistre[],
    virkningsOrSoktFraDato: Date,
    barnMedISaken: RolleDto[]
): HusstandsbarnDtoV2[] => {
    return opplysningerFraFolkRegistre.map((barn) => ({
        ...barn,
        kilde: Kilde.OFFENTLIG,
        fødselsdato: barn.foedselsdato,
        medIBehandling: barnMedISaken.some((b) => b.ident === barn.ident),
        perioder: getBarnPerioder(barn.perioder, virkningsOrSoktFraDato, barn.foedselsdato),
    }));
};
