import { Alert, Button, HStack, Modal, VStack } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { BEHANDLING_API_V1 } from "../../common/constants/api";
import {
    useGetBehandlingV2,
    useGetForholdsmessigFordelingDetaljer,
    useRefetchFFInfoFn,
} from "../../common/hooks/useApiData";
import { BarnListeOpprettFF } from "./BarnListe";

export default function OpprettForholdsmessigFordelingPrompt() {
    const { forholdsmessigFordeling, id } = useGetBehandlingV2();
    const refetchFF = useRefetchFFInfoFn();

    const detaljer = useGetForholdsmessigFordelingDetaljer();
    const [modalOpen, setModalOpen] = useState(false);
    const opprettFFFn = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.opprettForholdsmessigFordeling(id);
        },
        onSuccess: () => {
            setModalOpen(false);
            refetchFF();
        },
    });
    if (detaljer.kanOppretteForholdsmessigFordeling === false) return null;

    const harOpprettetFF = forholdsmessigFordeling !== undefined;
    function opprettForholsmessigFordeling() {
        opprettFFFn.mutate();
    }
    const harBarnMedSak = detaljer.barn.some((b) => b.saksnr !== undefined);

    return (
        <>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-label="">
                <Modal.Header>
                    {harOpprettetFF ? "Oppdater forholdsmessig fordeling" : "Opprett forholdsmessig fordeling"}
                </Modal.Header>
                <Modal.Body className="min-w-[700px]">
                    <VStack gap="2">
                        <BarnListeOpprettFF barn={detaljer.barn} skalBehandlesAvEnhet={detaljer.skalBehandlesAvEnhet} />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    {harBarnMedSak && (
                        <Button
                            size="small"
                            variant="primary"
                            onClick={() => opprettForholsmessigFordeling()}
                            loading={opprettFFFn.isPending}
                        >
                            {harOpprettetFF ? "Oppdater" : "Opprett"}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            <Alert size="small" variant={harOpprettetFF ? "warning" : "info"}>
                <VStack gap="space-12">
                    {harOpprettetFF
                        ? "Behandling har andre barn/saker som ikke er del av behandlingen. Se detaljer for hvilken barn/saker det gjelder"
                        : "Bidragspliktig har andre barn/saker med løpende bidrag. Det kan hende bidraget må forholdsmessig fordeles"}

                    <HStack gap="space-16">
                        <Button size="small" variant="secondary-neutral" onClick={() => setModalOpen(true)}>
                            Vis detaljer
                        </Button>
                    </HStack>
                </VStack>
            </Alert>
        </>
    );
}
