import { Alert, BodyShort, HStack, Label, VStack } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";
import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import BarnDetaljerFF, { BarnDetaljerOpprettFF } from "./BarnDetaljer";

interface BarnListeProps {
    skalBehandlesAvEnhet?: string;
    barn: ForholdsmessigFordelingBarnDto[];
}
export function BarnListeOpprettFF({ barn, skalBehandlesAvEnhet }: BarnListeProps) {
    const { behandlerenhet } = useGetBehandlingV2();
    const barnFraSammeSak = barn.filter((b) => b.sammeSakSomBehandling);
    const barnFraAndreSaker = barn.filter((b) => !b.sammeSakSomBehandling);
    const groupBySaksnr = (list: ForholdsmessigFordelingBarnDto[]) =>
        list.reduce(
            (acc, b) => {
                const key = b.saksnr || "unknown";
                if (!acc[key]) acc[key] = [];
                acc[key].push(b);
                return acc;
            },
            {} as Record<string, ForholdsmessigFordelingBarnDto[]>
        );
    const groupedSammeSak = groupBySaksnr(barnFraSammeSak);
    const groupedAndreSaker = groupBySaksnr(barnFraAndreSaker);
    return (
        <VStack gap="2">
            <HStack gap={"2"}>
                <Label size="small">Skal behandles av enhet: </Label>
                <BodyShort size="small">{skalBehandlesAvEnhet}</BodyShort>
            </HStack>
            {behandlerenhet !== skalBehandlesAvEnhet && (
                <Alert variant="info" size="small">
                    En eller flere saker til BP tilhører enhet {skalBehandlesAvEnhet}. Behandlingen vil derfor bli
                    overført til enhet {skalBehandlesAvEnhet} etter forholdsmessig fordeling er opprettet
                </Alert>
            )}
            <VStack gap="2">
                {Object.keys(groupedSammeSak).length > 0 &&
                    Object.values(groupedSammeSak).map((group, index) => (
                        <div key={group[0]?.saksnr + index}>
                            <BarnDetaljerOpprettFF barn={group} />
                        </div>
                    ))}
            </VStack>
            <VStack gap="2">
                {Object.keys(groupedAndreSaker).length > 0 &&
                    Object.values(groupedAndreSaker).map((group, index) => (
                        <div key={group[0]?.saksnr + index}>
                            <BarnDetaljerOpprettFF barn={group} />
                        </div>
                    ))}
            </VStack>
        </VStack>
    );
}

export function BarnListe({ barn }: BarnListeProps) {
    const groupedBarn = barn.reduce(
        (acc, b) => {
            const key = b.saksnr || "unknown";
            if (!acc[key]) acc[key] = [];
            acc[key].push(b);
            return acc;
        },
        {} as Record<string, ForholdsmessigFordelingBarnDto[]>
    );
    return (
        <VStack gap="2">
            <VStack gap="2">
                {Object.values(groupedBarn).map((group) => (
                    <div key={group[0].saksnr || "unknown"}>
                        <BarnDetaljerFF barn={group} />
                    </div>
                ))}
            </VStack>
        </VStack>
    );
}
