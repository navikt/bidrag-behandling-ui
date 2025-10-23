import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Link } from "@navikt/ds-react";

import environment from "../../environment";

export default function Søknadslenke({ id }: { id: number }) {
    return (
        <Link
            variant="action"
            href={`${environment.url.bisys}Sak.do?executeVelg=1&hentSoknadsnr=${id}`}
            target="_blank"
        >
            <ExternalLinkIcon aria-hidden />
        </Link>
    );
}
