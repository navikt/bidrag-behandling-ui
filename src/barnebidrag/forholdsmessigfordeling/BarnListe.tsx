import { BodyShort, Heading, HStack, Label, VStack } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";
import BarnDetaljerFF, { BarnDetaljerOpprettFF } from "./BarnDetaljer";

interface BarnListeProps {
    skalBehandlesAvEnhet?: string;
    barn: ForholdsmessigFordelingBarnDto[];
}
export function BarnListeOpprettFF({ barn, skalBehandlesAvEnhet }: BarnListeProps) {
    const barnFraSammeSak = barn.filter((b) => b.sammeSakSomBehandling);
    const barnFraAndreSaker = barn.filter((b) => !b.sammeSakSomBehandling);
    return (
        <VStack gap="2">
            <HStack gap={"2"}>
                <Label size="small">Skal behandles av enhet: </Label>
                <BodyShort size="small">{skalBehandlesAvEnhet}</BodyShort>
            </HStack>
            <div>
                <Heading size="xsmall">Barn fra samme sak:</Heading>
                <VStack gap="2">
                    {barnFraSammeSak.length > 0 ? (
                        barnFraSammeSak.map((b) => (
                            <div key={b.ident}>
                                <BarnDetaljerOpprettFF barn={b} />
                            </div>
                        ))
                    ) : (
                        <BodyShort size="small">Ingen flere barn fra samme sak</BodyShort>
                    )}
                </VStack>
            </div>
            <div>
                <Heading size="xsmall">Barn fra andre saker:</Heading>
                <VStack gap="2">
                    {barnFraAndreSaker.length > 0 ? (
                        barnFraAndreSaker.map((b) => (
                            <div key={b.ident}>
                                <BarnDetaljerOpprettFF barn={b} />
                            </div>
                        ))
                    ) : (
                        <BodyShort size="small">Ingen flere barn fra andre saker</BodyShort>
                    )}
                </VStack>
            </div>
        </VStack>
    );
}

export function BarnListe({ barn }: BarnListeProps) {
    return (
        <VStack gap="2">
            <VStack gap="2">
                {barn.map((b) => (
                    <div key={b.ident}>
                        <BarnDetaljerFF barn={b} />
                    </div>
                ))}
            </VStack>
        </VStack>
    );
}
