import { CopyToClipboard } from "@navikt/ds-react-internal";
import React from "react";

import { RolleDto } from "../api/BidragBehandlingApi";
import { PersonNavn } from "./PersonNavn";
import { RolleTag } from "./RolleTag";

export const RolleDetaljer = ({ rolle, withBorder = true }: { rolle: RolleDto; withBorder?: boolean }) => {
    return (
        <div
            className={`px-6 py-2 ${
                withBorder && "border-[var(--a-border-divider)] border-solid border-b"
            } flex items-center`}
        >
            <RolleTag rolleType={rolle.rolleType} />
            <span>
                <PersonNavn ident={rolle.ident}></PersonNavn>
            </span>
            <span className="mx-4">/</span> {rolle.ident}
            <CopyToClipboard size="small" copyText={rolle.ident} popoverText="Kopierte fødselsnummeret" />
        </div>
    );
};
