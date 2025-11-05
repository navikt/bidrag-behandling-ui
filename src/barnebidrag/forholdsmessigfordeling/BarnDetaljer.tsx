import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Box, HGrid, HStack, Label } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto, Stonadstype } from "../../api/BidragBehandlingApiV1";
import BehandlingLenke from "../../common/components/BehandlingLenke";
import SakLenke from "../../common/components/SakLenke";
import Søknadslenke from "../../common/components/Søknadslenke";
import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import { hentVisningsnavn } from "../../common/hooks/useVisningsnavn";
import { dateOrNull, DateToMMYYYYString } from "../../utils/date-utils";

interface BarnDetaljerFFProps {
    barn: ForholdsmessigFordelingBarnDto[];
}

interface BarnDetaljerOpprettFFProps {
    barn: ForholdsmessigFordelingBarnDto[];
}

export function BarnDetaljerOpprettFF({ barn }: BarnDetaljerOpprettFFProps) {
    if (barn.length === 0) return null;
    const { stønadstype } = useGetBehandlingV2();
    const saksnr = barn[0].saksnr;
    const bidragsmottaker = barn[0].bidragsmottaker;
    const enhet = barn[0].enhet;
    function renderInnkreving(barn: ForholdsmessigFordelingBarnDto) {
        const medInnkreving = barn.åpneBehandlinger.some((b) => b.medInnkreving);
        if (medInnkreving && !barn.innkrevesFraDato) {
            return <BodyShort size="small">Ja</BodyShort>;
        }
        if ((barn.åpneBehandlinger.length === 0 || medInnkreving) && barn.innkrevesFraDato) {
            return <BodyShort size="small">Ja, fra {DateToMMYYYYString(dateOrNull(barn.innkrevesFraDato))}</BodyShort>;
        }
        if (barn.harLøpendeBidrag) {
            return <BodyShort size="small">Ja</BodyShort>;
        }
        return <BodyShort size="small">Nei</BodyShort>;
    }
    function renderÅpenBehandling(barn: ForholdsmessigFordelingBarnDto) {
        let link = null;
        let behandlingstype = null;
        const åpneBehandling = barn.åpneBehandlinger.map((b) => {
            if (b?.behandlingId) {
                link = <BehandlingLenke saksnummer={barn.saksnr} id={b.behandlingId} />;
                behandlingstype = hentVisningsnavn(b.behandlingstype);
            } else if (b?.søknadsid) {
                link = <Søknadslenke id={b.søknadsid} saksnr={saksnr} />;
                behandlingstype = hentVisningsnavn(b.behandlingstype);
            }
            return (
                <BodyShort size="small">
                    {behandlingstype ? ` ${behandlingstype?.toLowerCase()}` : " "} {link}{" "}
                </BodyShort>
            );
        });
        return åpneBehandling.length > 0 ? (
            <HStack gap="2" className="items-center">
                <BodyShort size="small">Ja,</BodyShort> {åpneBehandling.map((b) => b)}
            </HStack>
        ) : (
            <BodyShort size="small">Nei</BodyShort>
        );
    }
    return (
        <Box
            background="surface-subtle"
            borderColor="border-alt-3"
            padding="2"
            borderWidth="1"
            borderRadius="medium"
            className="shadow-sm"
        >
            {!saksnr && (
                <Alert variant="warning" size="small" inline className="mb-2">
                    Ingen bidragssak funnet for barnet. Legg til eksisterende eller opprett bidragssak for å opprette FF
                </Alert>
            )}
            {(saksnr || bidragsmottaker.ident) && (
                <Box padding="2" background="surface-default" className="mb-2" borderRadius="small">
                    <HStack gap="4" align="center">
                        {saksnr && (
                            <div>
                                <Label size="small">Sak / Enhet</Label>
                                <BodyShort size="small">
                                    <SakLenke saksnummer={saksnr} /> / {enhet}
                                </BodyShort>
                            </div>
                        )}
                        {bidragsmottaker.ident && (
                            <div>
                                <Label size="small">Bidragsmottaker</Label>
                                <BodyShort size="small">
                                    <PersonNavnIdent ident={bidragsmottaker.ident} variant="compact" />
                                </BodyShort>
                            </div>
                        )}
                    </HStack>
                </Box>
            )}
            {barn.map((barn, index) => (
                <Box key={barn.ident} padding="1" className="border-t border-border-subtle">
                    {index > 0 && <hr className="my-1 border-t border-border-subtle" />}
                    <BodyShort size="small" className="ml-[-2px] font-semibold">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                    <HGrid gap="space-1" columns={{ xs: 1, sm: 2 }} className="mt-1">
                        {stønadstype !== barn.stønadstype && barn.stønadstype && (
                            <div>
                                <Label size="small">Søkt om</Label>
                                <BodyShort size="small">
                                    {barn.stønadstype === Stonadstype.BIDRAG18AAR ? "Bidrag 18 år" : "Bidrag"}{" "}
                                </BodyShort>
                            </div>
                        )}
                        <div>
                            <Label size="small">Innkreving</Label>
                            <BodyShort size="small">{renderInnkreving(barn)} </BodyShort>
                        </div>
                        {barn.eldsteSøktFraDato && barn.åpneBehandlinger.length > 1 && (
                            <div>
                                <Label size="small">Eldste søkt fra dato</Label>
                                <BodyShort size="small">
                                    {DateToMMYYYYString(dateOrNull(barn.eldsteSøktFraDato))}
                                </BodyShort>
                            </div>
                        )}
                        <div>
                            <Label size="small">Har åpen behandling?</Label>
                            <BodyShort size="small">{renderÅpenBehandling(barn)}</BodyShort>
                        </div>
                    </HGrid>
                </Box>
            ))}
        </Box>
    );
}
export default function BarnDetaljerFF({ barn }: BarnDetaljerFFProps) {
    if (barn.length === 0) return null;
    const saksnr = barn[0].saksnr;
    const bidragsmottaker = barn[0].bidragsmottaker;
    const enhet = barn[0].enhet;
    function renderType(barn: ForholdsmessigFordelingBarnDto) {
        const åpenBehandling = barn.åpneBehandlinger.length > 0 ? barn.åpneBehandlinger[0] : null;
        if (barn.erRevurdering) {
            return (
                <BodyShort size="small">
                    Revurdering fra {DateToMMYYYYString(dateOrNull(åpenBehandling.søktFraDato))}
                    {åpenBehandling?.søknadsid && <Søknadslenke id={åpenBehandling.søknadsid} saksnr={saksnr} />}
                </BodyShort>
            );
        }
        let behandlingerInfo = "";
        if (barn.åpneBehandlinger.length > 1) {
            behandlingerInfo = ` (${barn.åpneBehandlinger.length} behandlinger: ${barn.åpneBehandlinger.map((b) => hentVisningsnavn(b.behandlingstype)).join(", ")})`;
        }
        return <BodyShort size="small">Del av hovedbehandling{behandlingerInfo}</BodyShort>;
    }
    return (
        <Box
            background="surface-subtle"
            borderColor="border-alt-3"
            padding="2"
            borderWidth="1"
            borderRadius="medium"
            className="shadow-sm"
        >
            <Box padding="2" background="surface-default" className="mb-2" borderRadius="small">
                <HStack gap="4" align="center">
                    <div>
                        <Label size="small">Sak / Enhet</Label>
                        <BodyShort size="small">
                            <SakLenke saksnummer={saksnr} /> / {enhet}
                        </BodyShort>
                    </div>
                    <div>
                        <Label size="small">Bidragsmottaker</Label>
                        <BodyShort size="small">
                            <PersonNavnIdent ident={bidragsmottaker.ident} variant="compact" />
                        </BodyShort>
                    </div>
                </HStack>
            </Box>
            {barn.map((barn, index) => (
                <Box key={barn.ident} padding="2" className="border-t border-border-subtle">
                    {index > 0 && <hr className="my-1 border-t border-border-subtle" />}
                    <BodyShort size="small" className="ml-[-3px] font-semibold">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                    <HGrid gap="space-2" columns={{ xs: 1, sm: 2 }} className="mt-1">
                        <div>
                            <Label size="small">Har løpende bidrag?</Label>
                            <BodyShort size="small">{barn.harLøpendeBidrag ? "Ja" : "Nei"} </BodyShort>
                        </div>
                        {barn.eldsteSøktFraDato && (
                            <div>
                                <Label size="small">Senest søkt fra dato</Label>
                                <BodyShort size="small">
                                    {DateToMMYYYYString(dateOrNull(barn.eldsteSøktFraDato))}
                                </BodyShort>
                            </div>
                        )}
                        <div>
                            <Label size="small">Søknad</Label>
                            <BodyShort size="small">{renderType(barn)}</BodyShort>
                        </div>
                    </HGrid>
                </Box>
            ))}
        </Box>
    );
}
