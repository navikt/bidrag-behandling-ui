import { BodyShort, Heading, VStack } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";
import BarnDetaljer from "./BarnDetaljer";

interface BarnListeProps {
    barn: ForholdsmessigFordelingBarnDto[];
}

export default function BarnListe({ barn }: BarnListeProps) {
    const barnFraSammeSak = barn.filter((b) => b.sammeSakSomBehandling);
    const barnFraAndreSaker = barn.filter((b) => !b.sammeSakSomBehandling);
    return (
        <VStack gap="2">
            <div>
                <Heading size="xsmall">Barn fra samme sak:</Heading>
                <VStack gap="2">
                    {barnFraSammeSak.length > 0 ? (
                        barnFraSammeSak.map((b) => (
                            <div key={b.ident}>
                                <BarnDetaljer barn={b} />
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
                                <BarnDetaljer barn={b} />
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
