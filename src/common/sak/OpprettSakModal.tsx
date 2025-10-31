import { Button } from "@navikt/ds-react";
import React, { useState } from "react";

import { Rolletype } from "../../api/BidragBehandlingApiV1";

const OpprettSakComponent = React.lazy(() => import("bidrag_sak_ui/OpprettSak"));

export interface IOpprettSakModalProps {
    ident: string;
    bpIdent: string;
    navn: string;
    rolle: Rolletype;
    eierfogd: string;
    onSubmit: (saksnummer: string) => void;
}

export default function OpprettSakModal({ ident, rolle, navn, eierfogd, onSubmit, bpIdent }: IOpprettSakModalProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Button variant="secondary" size="xsmall" onClick={() => setModalOpen(true)}>
                Opprett sak
            </Button>
            <OpprettSakComponent
                id={`opprett${ident}`}
                isOpen={modalOpen}
                ident={ident}
                navn={navn}
                rolle={rolle}
                initialSelectedForeldre={{ ident: bpIdent, rolle: Rolletype.BP }}
                eierfogd={eierfogd}
                onSubmit={onSubmit}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
