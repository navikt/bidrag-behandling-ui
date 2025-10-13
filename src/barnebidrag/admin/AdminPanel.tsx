import { ArrowCirclepathIcon, CogIcon, TrashIcon } from "@navikt/aksel-icons";
import { Alert, Button, Modal } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { BEHANDLING_API_V1 } from "../../common/constants/api";
import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import useFeatureToogle from "../../common/hooks/useFeatureToggle";

export const AdminPanel: React.FC = () => {
    const { isAdminEnabled } = useFeatureToogle();
    const behandling = useGetBehandlingV2();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<
        "reset_vedtak" | "delete" | "reset_grunnlag" | "ignore_grunnlag" | null
    >(null);

    const slettBehandling = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.slettBehandling(behandling.id);
        },
    });
    const resetVedtak = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.resetFattetVedtak(behandling.id);
        },
    });
    const resetGrunnlag = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.resetHentGrunnlag(behandling.id);
        },
    });
    const ignoreGrunnlag = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.ignorerHentGrunnlag(behandling.id);
        },
    });
    const handleIgnorerGrunnlag = async () => {
        if (confirmAction !== "ignore_grunnlag") {
            setConfirmAction("ignore_grunnlag");
            return;
        }

        await ignoreGrunnlag.mutate();
        setIsModalOpen(false);
        setConfirmAction(null);
    };
    const handleResetGrunnlag = async () => {
        if (confirmAction !== "reset_grunnlag") {
            setConfirmAction("reset_grunnlag");
            return;
        }

        await resetGrunnlag.mutate();
        setIsModalOpen(false);
        setConfirmAction(null);
    };
    const handleResetVedtak = async () => {
        if (confirmAction !== "reset_vedtak") {
            setConfirmAction("reset_vedtak");
            return;
        }

        await resetVedtak.mutate();
        setIsModalOpen(false);
        setConfirmAction(null);
    };

    const handleDelete = async () => {
        if (confirmAction !== "delete") {
            setConfirmAction("delete");
            return;
        }

        await slettBehandling.mutate();
    };

    const isLoading =
        slettBehandling.isPending || resetVedtak.isPending || resetGrunnlag.isPending || ignoreGrunnlag.isPending;
    const resetConfirmation = () => setConfirmAction(null);

    if (!isAdminEnabled) return null;
    return (
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
                            <Alert variant="error">
                                Er du sikker på at du vil tilbakestille behandlingen? All data vil gå tapt.
                            </Alert>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                variant={confirmAction === "ignore_grunnlag" ? "danger" : "secondary"}
                                size="medium"
                                icon={<ArrowCirclepathIcon />}
                                onClick={handleIgnorerGrunnlag}
                                loading={isLoading && confirmAction === "ignore_grunnlag"}
                                disabled={isLoading}
                            >
                                {confirmAction === "ignore_grunnlag"
                                    ? "Bekreft ignorer grunnlagsinnhenting"
                                    : "Ignorer grunnlagsinnhenting"}
                            </Button>

                            <Button
                                variant={confirmAction === "reset_grunnlag" ? "danger" : "secondary"}
                                size="medium"
                                icon={<ArrowCirclepathIcon />}
                                onClick={handleResetGrunnlag}
                                loading={isLoading && confirmAction === "reset_grunnlag"}
                                disabled={isLoading}
                            >
                                {confirmAction === "reset_grunnlag"
                                    ? "Bekreft reset grunnlagsinnhenting"
                                    : "Reset grunnlagsinnhenting"}
                            </Button>

                            <Button
                                variant={confirmAction === "reset_vedtak" ? "danger" : "secondary"}
                                size="medium"
                                icon={<ArrowCirclepathIcon />}
                                onClick={handleResetVedtak}
                                loading={isLoading && confirmAction === "reset_vedtak"}
                                disabled={isLoading}
                            >
                                {confirmAction === "reset_vedtak"
                                    ? "Bekreft tilbakestilling"
                                    : "Tilbakestill behandling"}
                            </Button>

                            <Button
                                variant={confirmAction === "delete" ? "danger" : "secondary"}
                                size="medium"
                                icon={<TrashIcon />}
                                onClick={handleDelete}
                                loading={isLoading && confirmAction === "delete"}
                                disabled={isLoading}
                            >
                                {confirmAction === "delete" ? "Bekreft sletting" : "Slett behandling"}
                            </Button>

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
    );
};
