import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { BodyShort, Box, HGrid, Label } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto } from "../../api/BidragBehandlingApiV1";
import BehandlingLenke from "../../common/components/BehandlingLenke";
import SakLenke from "../../common/components/SakLenke";
import Søknadslenke from "../../common/components/Søknadslenke";
import { dateOrNull, DateToMMYYYYString } from "../../utils/date-utils";

interface BarnDetaljerProps {
    barn: ForholdsmessigFordelingBarnDto;
}

export function BarnDetaljerOpprettFF({ barn }: BarnDetaljerProps) {
    function renderInnkreving() {
        if (barn.åpenBehandling?.medInnkreving && !barn.innkrevesFraDato) {
            return <BodyShort size="small">Ja</BodyShort>;
        }
        if ((barn.åpenBehandling == null || barn.åpenBehandling.medInnkreving) && barn.innkrevesFraDato) {
            return <BodyShort size="small">Ja, fra {DateToMMYYYYString(dateOrNull(barn.innkrevesFraDato))}</BodyShort>;
        }
        return <BodyShort size="small">Nei</BodyShort>;
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
            <HGrid gap="space-6" columns={{ xs: 1, sm: 2, md: 2 }} className="border-t border-border-subtle">
                <Box>
                    <Label size="small" className="mb-1">
                        Barn
                    </Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Bidragsmottaker</Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Sak / Enhet</Label>
                    <BodyShort>
                        <SakLenke saksnummer={barn.saksnr} /> / {barn.enhet}
                    </BodyShort>
                </Box>
                {/* <Box>
                    <Label size="small">Har løpende bidrag?</Label>
                    <BodyShort>{barn.harLøpendeBidrag ? "Ja" : "Nei"} </BodyShort>
                </Box> */}
                <Box>
                    <Label size="small">Innkreving</Label>
                    <BodyShort>{renderInnkreving()} </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Har åpen behandling?</Label>
                    <BodyShort>
                        {barn.åpenBehandling ? "Ja" : "Nei"}{" "}
                        {barn.åpenBehandling?.behandlingId ? (
                            <BehandlingLenke saksnummer={barn.saksnr} id={barn.åpenBehandling.behandlingId} />
                        ) : barn.åpenBehandling?.søknadsid ? (
                            <Søknadslenke id={barn.åpenBehandling.søknadsid} />
                        ) : null}
                    </BodyShort>
                </Box>
            </HGrid>
        </Box>
    );
}
export default function BarnDetaljerFF({ barn }: BarnDetaljerProps) {
    function renderType() {
        if (barn.erRevurdering) {
            return (
                <BodyShort size="small">
                    Revurdering fra {DateToMMYYYYString(dateOrNull(barn.åpenBehandling?.søktFraDato))}
                    {barn.åpenBehandling?.søknadsid && <Søknadslenke id={barn.åpenBehandling.søknadsid} />}
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
            <HGrid gap="space-6" columns={{ xs: 1, sm: 2, md: 2 }} className="border-t border-border-subtle">
                <Box>
                    <Label size="small" className="mb-1">
                        Barn
                    </Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Bidragsmottaker</Label>
                    <BodyShort className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Sak / Enhet</Label>
                    <BodyShort>
                        <SakLenke saksnummer={barn.saksnr} /> / {barn.enhet}
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Har løpende bidrag?</Label>
                    <BodyShort size="small">{barn.harLøpendeBidrag ? "Ja" : "Nei"} </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Søknad</Label>
                    <BodyShort size="small">{renderType()}</BodyShort>
                </Box>
            </HGrid>
        </Box>
    );
}
