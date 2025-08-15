import text from "@common/constants/texts";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Alert, BodyShort, Checkbox, Link, Table } from "@navikt/ds-react";
import { useState } from "react";

import { ManuellVedtakDto, Vedtakstype } from "../../api/BidragBehandlingApiV1";
import { OverlayLoader } from "../../common/components/OverlayLoader";
import { useBehandlingProvider } from "../../common/context/BehandlingContext";
import { useGetBehandlingV2, useGetBeregningBidrag, useOppdaterManuelleVedtak } from "../../common/hooks/useApiData";
import { dateOrNull, DateToDDMMYYYYString } from "../../utils/date-utils";

type VedtaksListeProps = { barnIdent: string; aldersjusteringForÅr?: number; onSelectVedtak?: () => void };
export const VedtaksListeBeregning = (props: VedtaksListeProps) => {
    const { data: beregning } = useGetBeregningBidrag(true);
    const { virkningstidspunktV2 } = useGetBehandlingV2();
    const selectedBarn = virkningstidspunktV2.find(({ rolle }) => rolle.ident === props.barnIdent);
    const barn = beregning.resultat?.resultatBarn?.find((b) => b.barn.ident === props.barnIdent);

    return (
        <VedtaksListe
            {...props}
            valgVedtak={
                barn?.barn?.grunnlagFraVedtak?.find((g) => g.aldersjusteringForÅr === props.aldersjusteringForÅr)
                    ?.vedtak
            }
            vedtaksLista={selectedBarn.manuelleVedtak}
        />
    );
};

export const VedtaksListeVirkningstidspunkt = (props: VedtaksListeProps) => {
    const { virkningstidspunktV2, vedtakstype } = useGetBehandlingV2();
    const selectedBarn = virkningstidspunktV2.find(({ rolle }) => rolle.ident === props.barnIdent);

    if (![Vedtakstype.ALDERSJUSTERING].includes(vedtakstype)) return null;

    return (
        <VedtaksListe
            {...props}
            vedtaksLista={selectedBarn.manuelleVedtak}
            valgVedtak={selectedBarn.grunnlagFraVedtak}
        />
    );
};

export const VedtaksListe = ({
    barnIdent,
    aldersjusteringForÅr,
    onSelectVedtak,
    vedtaksLista,
    valgVedtak,
}: VedtaksListeProps & { vedtaksLista: ManuellVedtakDto[]; valgVedtak?: number }) => {
    const { virkningstidspunktV2, saksnummer } = useGetBehandlingV2();
    const selectedBarn = virkningstidspunktV2.find(({ rolle }) => rolle.ident === barnIdent);
    const { lesemodus } = useBehandlingProvider();
    const { mutate, isError: mutationError, isPending } = useOppdaterManuelleVedtak(onSelectVedtak);
    const [val, setVal] = useState<number>(valgVedtak);

    const onSelect = (vedtaksid: number, checked: boolean) => {
        const updatedValue = checked ? vedtaksid : null;
        setVal(updatedValue);
        mutate({
            barnId: selectedBarn.rolle.id,
            vedtaksid: updatedValue,
            aldersjusteringForÅr,
        });
    };

    return (
        <div>
            <BodyShort size="small" weight="semibold" className="mb-2">
                {text.description.velgVedtak}
            </BodyShort>
            <div className={`${isPending ? "relative" : "inherit"} block overflow-x-auto whitespace-nowrap`}>
                <OverlayLoader loading={isPending} />
                <Table size="small" zebraStripes>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell scope="col"></Table.HeaderCell>
                            <Table.HeaderCell scope="col" textSize="small">
                                Virkingsdato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" textSize="small">
                                Vedtaksdato
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" textSize="small">
                                Søknadstype
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" textSize="small">
                                Resultat siste periode
                            </Table.HeaderCell>
                            <Table.HeaderCell scope="col" textSize="small">
                                Vedtak
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {vedtaksLista.map((vedtak) => (
                            <Table.Row key={vedtak.vedtaksid}>
                                <Table.HeaderCell scope="row">
                                    <Checkbox
                                        hideLabel
                                        value={vedtak.vedtaksid}
                                        checked={val === vedtak.vedtaksid}
                                        onChange={(e) => onSelect(vedtak.vedtaksid, e.target.checked)}
                                        size="small"
                                        readOnly={lesemodus}
                                    >
                                        {vedtak.vedtaksid}
                                    </Checkbox>
                                </Table.HeaderCell>
                                <Table.DataCell>
                                    {DateToDDMMYYYYString(dateOrNull(vedtak.virkningsDato))}
                                </Table.DataCell>
                                <Table.DataCell>
                                    {DateToDDMMYYYYString(dateOrNull(vedtak.fattetTidspunkt))}
                                </Table.DataCell>
                                <Table.DataCell>{vedtak.søknadstype}</Table.DataCell>
                                <Table.DataCell>{vedtak.resultatSistePeriode}</Table.DataCell>
                                <Table.DataCell>
                                    <Link
                                        variant="action"
                                        href={`/sak/${saksnummer}/vedtak/${vedtak.vedtaksid}/?steg=vedtak`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLinkIcon title="vedtak lenken" fontSize="1.5rem" />
                                    </Link>
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            {mutationError && <Alert variant="error">{text.error.feilVedOppdatering}</Alert>}
        </div>
    );
};
