import { SecuritySessionUtils } from "@navikt/bidrag-ui-common";
import { useQuery } from "@tanstack/react-query";
import { useFlag, useUnleashClient } from "@unleash/proxy-client-react";
import { useEffect } from "react";

export default function useFeatureToogle() {
    const isMockEnabled = process.env.ENABLE_MOCK === "true";
    const enableFatteVedtak = useFlag("behandling.fattevedtak");
    const enableAdmin = useFlag("behandling.admin");
    const enableOpphørsdato = useFlag("behandling.opphorsdato");
    const enableBidragV2 = useFlag("behandling.v2_endring");
    const utvikler = useFlag("bidrag.utvikler");
    const enableBehandlingVesntremeny = useFlag("behandling_vesntremeny");
    const client = useUnleashClient();
    const { data: userId } = useQuery({
        queryKey: ["user"],
        queryFn: async () => SecuritySessionUtils.hentSaksbehandlerId(),
        initialData: () => (isMockEnabled ? "" : undefined),
        staleTime: isMockEnabled ? 0 : Infinity,
    });

    useEffect(() => {
        client.updateContext({
            userId,
        });
    }, [userId]);

    useEffect(() => {
        console.debug(
            "enableFatteVedtak",
            enableFatteVedtak,
            "enableAdmin",
            enableAdmin,
            "enableOpphørsdato",
            enableOpphørsdato,
            "enableBidragV2",
            enableBidragV2
        );
    }, [enableFatteVedtak, enableAdmin]);
    return {
        isAdminEnabled: enableAdmin,
        isDeveloper: utvikler,
        isFatteVedtakEnabled: enableFatteVedtak,
        isOpphørsdatoEnabled: enableOpphørsdato,
        isBidragV2Enabled: enableBidragV2,
        isbehandlingVesntremenyEnabled: enableBehandlingVesntremeny,
    };
}
