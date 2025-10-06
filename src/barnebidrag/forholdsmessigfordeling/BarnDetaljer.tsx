import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, Label, VStack } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";

interface BarnDetaljerProps {
    barn: ForholdsmessigFordelingBarnDto;
}

export default function BarnDetaljer({ barn }: BarnDetaljerProps) {
    return (
        <Box background="surface-subtle" borderColor="border-alt-3" padding="2" borderWidth="1" borderRadius="small">
            <BodyShort size="small" className="ml-[-5px]">
                <PersonNavnIdent ident={barn.ident} variant="compact" />
            </BodyShort>
            <VStack gap="1">
                <div className="flex gap-x-2">
                    <Label size="small">Sak:</Label>
                    <BodyShort size="small">{barn.saksnr}</BodyShort>
                </div>
                <div className="flex gap-x-2">
                    <Label size="small">Bidragsmottaker:</Label>
                    <BodyShort size="small" className="ml-[-5px]">
                        <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                    </BodyShort>
                </div>
            </VStack>
        </Box>
    );
}
