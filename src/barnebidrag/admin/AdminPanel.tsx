import { ArrowCirclepathIcon, CogIcon, TrashIcon } from "@navikt/aksel-icons";
import { Alert, BodyShort, Button, CopyButton, Modal } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { BEHANDLING_API_V1 } from "../../common/constants/api";
import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import useFeatureToogle from "../../common/hooks/useFeatureToggle";

type AdminAction = {
    key: string;
    label: string;
    confirmLabel: string;
    icon: React.ComponentType<unknown>;
    mutation: ReturnType<typeof useMutation>;
};

export const AdminPanel: React.FC = () => {
    const { isAdminEnabled } = useFeatureToogle();
    const behandling = useGetBehandlingV2();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);

    const avsluttFF = useMutation({
        mutationFn: () => BEHANDLING_API_V1.api.avsluttFfSoknad(behandling.id),
    });
    const slettBehandling = useMutation({
        mutationFn: () => BEHANDLING_API_V1.api.slettBehandling(behandling.id),
    });
    const resetVedtak = useMutation({
        mutationFn: () => BEHANDLING_API_V1.api.resetFattetVedtak(behandling.id),
    });
    const resetGrunnlag = useMutation({
        mutationFn: () => BEHANDLING_API_V1.api.resetHentGrunnlag(behandling.id),
    });
    const ignoreGrunnlag = useMutation({
        mutationFn: () => BEHANDLING_API_V1.api.ignorerHentGrunnlag(behandling.id),
    });

    const actions: AdminAction[] = [
        {
            key: "ignore_grunnlag",
            label: "Ignorer grunnlagsinnhenting",
            confirmLabel: "Bekreft ignorer grunnlagsinnhenting",
            icon: ArrowCirclepathIcon,
            mutation: ignoreGrunnlag,
        },
        {
            key: "reset_grunnlag",
            label: "Reset grunnlagsinnhenting",
            confirmLabel: "Bekreft reset grunnlagsinnhenting",
            icon: ArrowCirclepathIcon,
            mutation: resetGrunnlag,
        },
        {
            key: "reset_vedtak",
            label: "Tilbakestill behandling",
            confirmLabel: "Bekreft tilbakestilling",
            icon: ArrowCirclepathIcon,
            mutation: resetVedtak,
        },
        {
            key: "delete",
            label: "Slett behandling",
            confirmLabel: "Bekreft sletting",
            icon: TrashIcon,
            mutation: slettBehandling,
        },
        {
            key: "avslutt_ff",
            label: "Avslutt FF",
            confirmLabel: "Bekreft avslutning",
            icon: TrashIcon,
            mutation: avsluttFF,
        },
    ];

    const handleAction = async (action: AdminAction) => {
        if (confirmAction !== action.key) {
            setConfirmAction(action.key);
            return;
        }
        //@ts-ignore
        await action.mutation.mutate();
        setIsModalOpen(false);
        setConfirmAction(null);
    };

    const isLoading = actions.some((action) => action.mutation.isPending);
    const resetConfirmation = () => setConfirmAction(null);

    if (!isAdminEnabled) return null;
    return (
        <>
            <Søknadsid />
            <div className="agroup fixed bottom-0 right-[180px] p-2 flex items-end justify-end w-max h-0 flex-row gap-[5px]">
                <Button variant="tertiary" size="small" icon={<CogIcon />} onClick={() => setIsModalOpen(true)}>
                    Admin
                </Button>

                <Modal
                    open={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setConfirmAction(null);
                    }}
                    header={{ heading: "Admin Panel" }}
                    width="medium"
                >
                    <Modal.Body>
                        <div className="space-y-4">
                            <Alert variant="warning">
                                Disse handlingene er irreversible og skal kun brukes av administratorer.
                            </Alert>

                            {confirmAction && (
                                <Alert variant="error">Er du sikker på at du vil tilbakestille behandlingen?.</Alert>
                            )}

                            <div className="flex flex-col gap-3">
                                {actions.map((action) => (
                                    <Button
                                        key={action.key}
                                        variant={confirmAction === action.key ? "danger" : "secondary"}
                                        size="medium"
                                        icon={<action.icon />}
                                        onClick={() => handleAction(action)}
                                        loading={isLoading && confirmAction === action.key}
                                        disabled={isLoading}
                                    >
                                        {confirmAction === action.key ? action.confirmLabel : action.label}
                                    </Button>
                                ))}

                                {confirmAction && (
                                    <Button
                                        variant="tertiary"
                                        size="medium"
                                        onClick={resetConfirmation}
                                        disabled={isLoading}
                                    >
                                        Avbryt
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

function Søknadsid() {
    const { søknadsid } = useGetBehandlingV2();
    return (
        <BodyShort
            size="small"
            className="z-[10000] agroup fixed bottom-0 left-0 p-2 flex items-end justify-end w-max h-0 flex-row gap-[5px]"
        >
            <CopyButton
                size="small"
                text={søknadsid.toString()}
                copyText={søknadsid.toString()}
                title="Kopier søknadsid"
            />
        </BodyShort>
    );
}
