import { PersonNavnIdent, RolleTypeFullName } from "@navikt/bidrag-ui-common";
import { BodyShort, VStack } from "@navikt/ds-react";
import { useMemo } from "react";

import { useGetBehandlingV2 } from "../../common/hooks/useApiData";

export default function PersonIdentSak({ ident, rolle }: { ident: string; rolle?: RolleTypeFullName }) {
    const { roller } = useGetBehandlingV2();
    const harUlikeSaksnummer = useMemo(
        () => roller.map((r) => r.saksnummer).filter((value, index, self) => self.indexOf(value) === index).length > 1,
        [roller]
    );
    const saksnummerIdent = useMemo(() => roller.find((r) => r.ident === ident)?.saksnummer, [roller, ident]);
    return (
        <VStack gap="0">
            <PersonNavnIdent skjulNavn rolle={rolle ?? RolleTypeFullName.BARN} ident={ident} variant="compact" />
            {harUlikeSaksnummer && saksnummerIdent && (
                <BodyShort className="self-end mr-[5px]" size="small">
                    sak {saksnummerIdent}
                </BodyShort>
            )}
        </VStack>
    );
}
