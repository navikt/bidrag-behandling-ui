import { Alert, Button, Heading, HStack, Modal, VStack } from "@navikt/ds-react";
import { useState } from "react";

import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import { BarnListe } from "./BarnListe";

export default function ForholdsmessigFordelingInfo() {
    const { forholdsmessigFordeling } = useGetBehandlingV2();

    const [modalOpen, setModalOpen] = useState(false);

    if (!forholdsmessigFordeling) return null;

    return (
        <>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} aria-label="">
                <Modal.Header>Forholdsmessig fordeling detaljer</Modal.Header>
                <Modal.Body className="min-w-[500px]">
                    <VStack gap="2">
                        <BarnListe barn={forholdsmessigFordeling.barn} />
                    </VStack>
                </Modal.Body>
            </Modal>
            <Alert size="small" variant="info">
                <Heading size="xsmall">Forholdsmessig fordeling</Heading>
                <VStack gap="space-12">
                    Forholdsmessig fordeling er opprettet for behandling. Se detaljer om hvilken barn/BM og saker FF er
                    del av.
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
