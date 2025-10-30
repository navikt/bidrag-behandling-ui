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
    barns: ForholdsmessigFordelingBarnDto[];
}

interface BarnDetaljerOpprettFFProps {
    barns: ForholdsmessigFordelingBarnDto[];
}

export function BarnDetaljerOpprettFF({ barns }: BarnDetaljerOpprettFFProps) {
    if (barns.length === 0) return null;
    const { stønadstype } = useGetBehandlingV2();
    const saksnr = barns[0].saksnr;
    const bidragsmottaker = barns[0].bidragsmottaker;
    const enhet = barns[0].enhet;
    function renderInnkreving(barn: ForholdsmessigFordelingBarnDto) {
        if (barn.åpenBehandling?.medInnkreving && !barn.innkrevesFraDato) {
            return <BodyShort size="small">Ja</BodyShort>;
        }
        if ((barn.åpenBehandling == null || barn.åpenBehandling.medInnkreving) && barn.innkrevesFraDato) {
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
        if (barn.åpenBehandling?.behandlingId) {
            link = <BehandlingLenke saksnummer={barn.saksnr} id={barn.åpenBehandling.behandlingId} />;
            behandlingstype = hentVisningsnavn(barn.åpenBehandling.behandlingstype);
        } else if (barn.åpenBehandling?.søknadsid) {
            link = <Søknadslenke id={barn.åpenBehandling.søknadsid} saksnr={saksnr} />;
            behandlingstype = hentVisningsnavn(barn.åpenBehandling.behandlingstype);
        }
        return (
            <>
                {barn.åpenBehandling ? "Ja" : "Nei"} {link}
                {behandlingstype ? `, ${behandlingstype?.toLowerCase()}` : ""}
            </>
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
            {barns.map((barn, index) => (
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
export default function BarnDetaljerFF({ barns }: BarnDetaljerFFProps) {
    if (barns.length === 0) return null;
    const saksnr = barns[0].saksnr;
    const bidragsmottaker = barns[0].bidragsmottaker;
    const enhet = barns[0].enhet;
    function renderType(barn: ForholdsmessigFordelingBarnDto) {
        if (barn.erRevurdering) {
            return (
                <BodyShort size="small">
                    Revurdering fra {DateToMMYYYYString(dateOrNull(barn.åpenBehandling?.søktFraDato))}
                    {barn.åpenBehandling?.søknadsid && (
                        <Søknadslenke id={barn.åpenBehandling.søknadsid} saksnr={saksnr} />
                    )}
                </BodyShort>
            );
        }
        return <BodyShort size="small">Del av hovedbehandling</BodyShort>;
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
            {barns.map((barn, index) => (
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
