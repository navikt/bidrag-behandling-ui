import { Vedtakstype } from "@api/BidragBehandlingApiV1";
import { FlexRow } from "@common/components/layout/grid/FlexRow";
import text from "@common/constants/texts";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { useGetBehandlingV2 } from "@common/hooks/useApiData";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { Button, Link } from "@navikt/ds-react";
import React from "react";
import { useParams } from "react-router-dom";

export const ActionButtons = ({ onNext }) => {
    const { behandlingId, vedtakId, saksnummer } = useParams<{
        behandlingId?: string;
        vedtakId?: string;
        saksnummer?: string;
    }>();
    const { vedtakstype, erBisysVedtak } = useGetBehandlingV2();
    const { lesemodus } = useBehandlingProvider();
    const notatUrl = behandlingId ? `/behandling/${behandlingId}/notat` : vedtakId ? `/vedtak/${vedtakId}/notat` : "";

    return (
        <FlexRow className="items-center">
            <Button
                type="button"
                onClick={onNext}
                variant="primary"
                iconPosition="right"
                className="w-max"
                size="small"
            >
                {text.label.gåVidere}
            </Button>
            {vedtakstype !== Vedtakstype.ALDERSJUSTERING && !lesemodus && !erBisysVedtak && (
                <Link
                    href={saksnummer ? `/sak/${saksnummer}${notatUrl}` : notatUrl}
                    target="_blank"
                    className="font-bold"
                >
                    {text.label.notatButton} <ExternalLinkIcon aria-hidden />
                </Link>
            )}
        </FlexRow>
    );
};
