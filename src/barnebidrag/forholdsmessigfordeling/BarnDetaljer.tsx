import { PersonNavnIdent } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Box, HGrid, Label } from "@navikt/ds-react";

import { ForholdsmessigFordelingBarnDto, Stonadstype } from "../../api/BidragBehandlingApiV1";
import BehandlingLenke from "../../common/components/BehandlingLenke";
import SakLenke from "../../common/components/SakLenke";
import Søknadslenke from "../../common/components/Søknadslenke";
import { useGetBehandlingV2 } from "../../common/hooks/useApiData";
import { hentVisningsnavn } from "../../common/hooks/useVisningsnavn";
import { dateOrNull, DateToMMYYYYString } from "../../utils/date-utils";

interface BarnDetaljerProps {
    barn: ForholdsmessigFordelingBarnDto;
}

export function BarnDetaljerOpprettFF({ barn }: BarnDetaljerProps) {
    const { stønadstype } = useGetBehandlingV2();
    function renderInnkreving() {
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
    function renderÅpenBehandling() {
        let link = null;
        let behandlingstype = null;
        if (barn.åpenBehandling?.behandlingId) {
            link = <BehandlingLenke saksnummer={barn.saksnr} id={barn.åpenBehandling.behandlingId} />;
            behandlingstype = hentVisningsnavn(barn.åpenBehandling.behandlingstype);
        } else if (barn.åpenBehandling?.søknadsid) {
            link = <Søknadslenke id={barn.åpenBehandling.søknadsid} />;
            behandlingstype = hentVisningsnavn(barn.åpenBehandling.behandlingstype);
        }
        return (
            <>
                {barn.åpenBehandling ? "Ja" : "Nei"} {link}
                {behandlingstype ? `, (${behandlingstype})` : ""}
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
            {!barn.saksnr && (
                <Alert variant="warning" size="small" inline className="mb-2">
                    Ingen bidragssak funnet for barnet. Legg til eksisterende eller opprett bidragssak for å opprette FF
                </Alert>
            )}
            <HGrid gap="space-6" columns={{ xs: 1, sm: 2, md: 2 }} className="border-t border-border-subtle">
                <Box>
                    <Label size="small" className="mb-1">
                        Barn
                    </Label>
                    <BodyShort size="small" className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                </Box>
                {barn.bidragsmottaker.ident && (
                    <Box>
                        <Label size="small">Bidragsmottaker</Label>
                        <BodyShort size="small" className="ml-[-3px]">
                            <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                        </BodyShort>
                    </Box>
                )}
                {barn.saksnr && (
                    <Box>
                        <Label size="small">Sak / Enhet</Label>
                        <BodyShort size="small">
                            <SakLenke saksnummer={barn.saksnr} /> / {barn.enhet}
                        </BodyShort>
                    </Box>
                )}
                {stønadstype !== barn.stønadstype && barn.stønadstype && (
                    <Box>
                        <Label size="small">Søkt om</Label>
                        <BodyShort size="small">
                            {barn.stønadstype === Stonadstype.BIDRAG18AAR ? "Bidrag 18 år" : "Bidrag"}{" "}
                        </BodyShort>
                    </Box>
                )}
                <Box>
                    <Label size="small">Innkreving</Label>
                    <BodyShort size="small">{renderInnkreving()} </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Har åpen behandling?</Label>
                    <BodyShort size="small">{renderÅpenBehandling()}</BodyShort>
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
                    <BodyShort size="small" className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Bidragsmottaker</Label>
                    <BodyShort size="small" className="ml-[-3px]">
                        <PersonNavnIdent ident={barn.bidragsmottaker.ident} variant="compact" />
                    </BodyShort>
                </Box>
                <Box>
                    <Label size="small">Sak / Enhet</Label>
                    <BodyShort size="small">
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
