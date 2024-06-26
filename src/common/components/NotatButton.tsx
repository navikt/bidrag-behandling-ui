import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";
import React from "react";

import text from "../constants/texts";

export default function NotatButton({ label = text.label.notatButton }: { label?: string }) {
    const { behandlingId, vedtakId, saksnummer } = useBehandlingProvider();
    const notatUrl = behandlingId ? `/behandling/${behandlingId}/notat` : vedtakId ? `/vedtak/${vedtakId}/notat` : "";
    return (
        <Link href={saksnummer ? `/sak/${saksnummer}${notatUrl}` : notatUrl} target="_blank" className="font-bold">
            {label} <ExternalLinkIcon aria-hidden />
        </Link>
    );
}
