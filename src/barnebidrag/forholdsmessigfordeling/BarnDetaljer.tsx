import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, Heading, HGrid, HStack, Label, VStack } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";
import SakLenke from "../../common/components/SakLenke";

interface BarnDetaljerProps {
    barn: ForholdsmessigFordelingBarnDto;
}

export default function BarnDetaljer({ barn }: BarnDetaljerProps) {
    return (
        <Box
            background="surface-subtle"
            borderColor="border-alt-3"
            padding="2"
            borderWidth="1"
            borderRadius="medium"
            className="shadow-sm"
        >
            <HGrid gap="space-1" columns={{ xs: 1, sm: 2, md: 2 }} className="border-t border-border-subtle">
                <Box>
                    <Label size="small" className="mb-1">Barn</Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small"  >
                        Bidragsmottaker
                    </Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">
                        Sak / Enhet
                    </Label>
                    <BodyShort><SakLenke saksnummer={barn.saksnr} /> / {barn.enhet}</BodyShort>
                </Box>
                <Box>
                    <Label size="small"  >
                        Har åpen søknad
                    </Label>
                    <BodyShort >
                        {barn.åpenBehandling ? "Ja" : "Nei"}
                    </BodyShort>
                </Box>

            </HGrid>
        </Box>
    );
}
