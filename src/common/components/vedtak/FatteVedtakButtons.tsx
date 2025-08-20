import { faro } from "@grafana/faro-react";
import { RedirectTo } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Button, Checkbox, CheckboxGroup, Heading, Select } from "@navikt/ds-react";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useParams } from "react-router-dom";

import { FatteVedtakFeil, TypeBehandling, Vedtakstype } from "../../../api/BidragBehandlingApiV1";
import environment from "../../../environment";
import { BEHANDLING_API_V1 } from "../../constants/api";
import tekster from "../../constants/texts";
import { useBehandlingProvider } from "../../context/BehandlingContext";
import { useGetBehandlingV2 } from "../../hooks/useApiData";
import { useQueryParams } from "../../hooks/useQueryParams";
import { FlexRow } from "../layout/grid/FlexRow";
import NotatButton from "../NotatButton";
export class MåBekrefteOpplysningerStemmerError extends Error {
    constructor() {
        super("Bekreft at opplysningene stemmer");
    }
}

const utsettDagerListe = [3, 4, 5, 6, 7, 8, 9];
const fatteVedtakMutationKey = ["fatteVedtak"];
export const FatteVedtakButtons = ({
    isBeregningError,
    disabled = false,
    opprettesForsendelse = false,
}: {
    isBeregningError: boolean;
    disabled?: boolean;
    opprettesForsendelse?: boolean;
}) => {
    const [bekreftetVedtak, setBekreftetVedtak] = useState(false);
    const { behandlingId, type } = useBehandlingProvider();
    const { engangsbeløptype, stønadstype, vedtakstype } = useGetBehandlingV2();
    const erBarnebidrag = type === TypeBehandling.BIDRAG;
    const erAldersjustering = vedtakstype === Vedtakstype.ALDERSJUSTERING;
    const [innkrevingUtsattAntallDager, setInnkrevingUtsattAntallDager] = useState<number | null>(
        erBarnebidrag && !erAldersjustering ? 3 : null
    );
    const isMutating = Boolean(useIsMutating({ mutationKey: fatteVedtakMutationKey }));
    const { saksnummer } = useParams<{ saksnummer?: string }>();
    const skalBekrefteNotatOpplysninger = vedtakstype !== Vedtakstype.ALDERSJUSTERING;
    const enhet = useQueryParams().get("enhet");
    const fatteVedtakFn = useMutation({
        mutationKey: fatteVedtakMutationKey,
        mutationFn: async () => {
            if (!bekreftetVedtak && skalBekrefteNotatOpplysninger) {
                throw new MåBekrefteOpplysningerStemmerError();
            }

            try {
                return await BEHANDLING_API_V1.api.fatteVedtak(Number(behandlingId), {
                    innkrevingUtsattAntallDager,
                    enhet,
                });
            } catch (error) {
                if (error instanceof AxiosError && error.response.status === 400) {
                    if (error.response?.data) {
                        const data = error.response.data as FatteVedtakFeil;
                        throw {
                            melding: data.feilmelding,
                            detaljer: data,
                        };
                    }
                }
                throw new Error();
            }
        },
        onSuccess: () => {
            faro.api.pushEvent(`fatte.vedtak`, {
                behandlingId: behandlingId?.toString() ?? "Ukjent",
                stønadstype,
                engangsbeløptype,
                behandlingType: type,
            });
            RedirectTo.sakshistorikk(saksnummer, environment.url.bisys);
        },
    });
    const throttledSubmit = debounce(fatteVedtakFn.mutate, 100);

    const måBekrefteAtOpplysningerStemmerFeil =
        fatteVedtakFn.isError && fatteVedtakFn.error instanceof MåBekrefteOpplysningerStemmerError;

    return (
        <div>
            {erBarnebidrag &&
                vedtakstype !== Vedtakstype.OPPHOR &&
                vedtakstype !== Vedtakstype.ALDERSJUSTERING &&
                vedtakstype !== Vedtakstype.KLAGE && (
                    <Select
                        size="small"
                        onChange={(e) =>
                            setInnkrevingUtsattAntallDager(e.target.value === "" ? null : Number(e.target.value))
                        }
                        defaultValue={innkrevingUtsattAntallDager}
                        label="Utsett overføring til regnskap"
                        className="w-max pb-2"
                    >
                        <option value="">Ikke utsett</option>
                        {utsettDagerListe.map((dager, index) => (
                            <option value={dager} key={dager + "-" + index}>
                                {dager} dager
                            </option>
                        ))}
                    </Select>
                )}
            {skalBekrefteNotatOpplysninger && (
                <Alert
                    className="pb-2 mb-2"
                    variant={måBekrefteAtOpplysningerStemmerFeil ? "error" : bekreftetVedtak ? "success" : "warning"}
                >
                    <Heading spacing level="2" size="xsmall">
                        {tekster.title.sjekkNotatOgOpplysninger}
                    </Heading>
                    <div className="text-wrap">
                        {tekster.varsel.vedtakNotat} <NotatButton />
                    </div>
                    <CheckboxGroup
                        legend=""
                        hideLegend
                        error={
                            måBekrefteAtOpplysningerStemmerFeil ? "Du må bekrefte at opplysningene stemmer" : undefined
                        }
                    >
                        <Checkbox
                            checked={bekreftetVedtak}
                            error={måBekrefteAtOpplysningerStemmerFeil}
                            onChange={() => {
                                setBekreftetVedtak((x) => !x);
                                fatteVedtakFn.reset();
                            }}
                        >
                            {tekster.varsel.bekreftFatteVedtak}
                        </Checkbox>
                    </CheckboxGroup>
                </Alert>
            )}
            {fatteVedtakFn.isError && !måBekrefteAtOpplysningerStemmerFeil && (
                <Alert variant="error" className="mt-2 mb-2">
                    <Heading spacing size="small" level="3">
                        {tekster.error.kunneIkkFatteVedtak}
                    </Heading>
                    <BodyShort>{fatteVedtakFn.error?.melding || tekster.error.fatteVedtak}</BodyShort>
                </Alert>
            )}
            {fatteVedtakFn.isSuccess && (
                <Alert variant="success" size="small" className={"mt-2 mb-2"}>
                    <Heading size="small" level="3">
                        {tekster.title.vedtakFattet}
                    </Heading>
                    <BodyShort>
                        {opprettesForsendelse
                            ? tekster.varsel.vedtakFattetUtenNotatDistribuert
                            : erAldersjustering
                                ? tekster.varsel.vedtakFattetAvvistUtenNotatForsendelse
                                : tekster.varsel.vedtakFattet}
                    </BodyShort>
                </Alert>
            )}
            <FlexRow>
                <Button
                    loading={fatteVedtakFn.isPending}
                    disabled={isBeregningError || fatteVedtakFn.isSuccess || disabled || isMutating}
                    onClick={() => throttledSubmit()}
                    className="w-max"
                    size="small"
                >
                    {opprettesForsendelse
                        ? tekster.label.fatteVedtakOgSendForsendelseButton
                        : tekster.label.fatteVedtakButton}
                </Button>
            </FlexRow>
        </div>
    );
};

export default function Confetti() {
    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        if (refAnimationInstance.current) {
            refAnimationInstance.current.confetti({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio),
            });
        }
    }, []);

    useEffect(() => fire(), []);

    const fire = useCallback(() => {
        makeShot(0.25, {
            spread: 26,
            startVelocity: 55,
        });

        makeShot(0.2, {
            spread: 60,
        });

        makeShot(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
        });

        makeShot(0.1, {
            spread: 120,
            startVelocity: 45,
        });
    }, [makeShot]);

    return (
        <ReactCanvasConfetti
            onInit={(ref) => getInstance(ref)}
            style={{
                position: "fixed",
                pointerEvents: "none",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
            }}
        />
    );
}
