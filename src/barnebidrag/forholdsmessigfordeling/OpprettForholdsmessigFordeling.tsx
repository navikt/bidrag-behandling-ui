import { Alert, Button, HStack, Modal, VStack } from "@navikt/ds-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { BEHANDLING_API_V1 } from "../../common/constants/api";
import { useBehandlingProvider } from "../../common/context/BehandlingContext";
import { QueryKeys, useGetBehandlingV2, useGetForholdsmessigFordelingDetaljer } from "../../common/hooks/useApiData";
import BarnListe from "./BarnListe";

export default function OpprettForholdsmessigFordelingPrompt() {
    const { forholdsmessigFordeling, id } = useGetBehandlingV2();
    const { behandlingId } = useBehandlingProvider();

    const detaljer = useGetForholdsmessigFordelingDetaljer();
    const client = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const opprettFFFn = useMutation({
        mutationFn: () => {
            return BEHANDLING_API_V1.api.opprettForholdsmessigFordeling(id);
        },
        onSuccess: () => {
            setModalOpen(false);
            client.refetchQueries({ queryKey: QueryKeys.behandlingV2(behandlingId) });
        },
    });
    if (forholdsmessigFordeling || detaljer.kanOppretteForholdsmessigFordeling === false) return null;

    function opprettForholsmessigFordeling() {
        opprettFFFn.mutate();
    }
    return (
        <>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-label="">
                <Modal.Header>Opprett forholdsmessig fordeling</Modal.Header>
                <Modal.Body>
                    <VStack gap="2">
                        <BarnListe barn={detaljer.barn} />
                    </VStack>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="small"
                        variant="primary"
                        onClick={() => opprettForholsmessigFordeling()}
                        loading={opprettFFFn.isPending}
                    >
                        Opprett
                    </Button>
                </Modal.Footer>
            </Modal>
            <Alert size="small" variant="info">
                <VStack gap="space-12">
                    Bidragspliktig har andre barn/saker med løpende bidrag. Det kan hende bidraget må forholdsmessig
                    fordeles
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
