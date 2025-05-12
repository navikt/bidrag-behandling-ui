import behandlingQueryKeys from "@common/constants/behandlingQueryKeys";
import { VirkningstidspunktFormValues } from "@common/types/virkningstidspunktFormValues";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export const useGetActiveAndDefaultVirkningstidspunktTab = () => {
    const { getValues } = useFormContext<VirkningstidspunktFormValues>();
    const roller = getValues("roller");
    const [searchParams] = useSearchParams();
    const selectedTab = searchParams.get(behandlingQueryKeys.tab);

    const defaultTab = useMemo(() => {
        if (selectedTab) {
            return selectedTab;
        }

        return roller[0].rolle.ident;
    }, []);

    const activeTab = selectedTab ?? defaultTab;

    return [activeTab, defaultTab];
};
