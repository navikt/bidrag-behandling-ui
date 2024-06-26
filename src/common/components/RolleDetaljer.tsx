import { IRolleUI } from "@commonTypes/rolle";
import { CopyButton } from "@navikt/ds-react";
import { removePlaceholder } from "@utils/string-utils";
import React from "react";

import text from "../constants/texts";
import { RolleTag } from "./RolleTag";

export const RolleDetaljer = ({ rolle, withBorder = true }: { rolle: IRolleUI; withBorder?: boolean }) => {
    return (
        <div
            className={`px-6 py-2 ${
                withBorder && "border-[var(--a-border-divider)] border-solid border-b"
            } flex items-center`}
        >
            <RolleTag rolleType={rolle.rolletype} />
            <span>{rolle.navn}</span>
            <span className="mx-4">/</span> {rolle.ident}
            <CopyButton
                size="small"
                copyText={rolle.ident}
                title={removePlaceholder(text.title.copyButton, rolle.ident)}
            />
        </div>
    );
};
