import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";

import { useGetBehandlingV2 } from "../hooks/useApiData";
import { useQueryParams } from "../hooks/useQueryParams";

const KlagetPåVedtakButton = () => {
    const { vedtakRefId, saksnummer } = useGetBehandlingV2();
    const enhet = useQueryParams().get("enhet");
    const sessionState = useQueryParams().get("sessionState");

    if (!vedtakRefId) return null;
    return (
        <Link
            className="w-max"
            to={`/sak/${saksnummer}/vedtak/${vedtakRefId}/?steg=vedtak&enhet=${enhet}&sessionState=${sessionState}`}
            target="_blank"
            rel="noreferrer"
        >
            Klaget på vedtak <ExternalLinkIcon aria-hidden />
        </Link>
    );
};

export default KlagetPåVedtakButton;
