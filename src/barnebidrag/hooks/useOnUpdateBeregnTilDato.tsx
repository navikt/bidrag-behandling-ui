import { BehandlingDtoV2 } from "@api/BidragBehandlingApiV1";
import { useBehandlingProvider } from "@common/context/BehandlingContext";
import { QueryKeys, useUpdateBeregnTilDato } from "@common/hooks/useApiData";
import { useQueryClient } from "@tanstack/react-query";

export const useOnUpdateBeregnTilDato = () => {
    const queryClient = useQueryClient();
    const { behandlingId } = useBehandlingProvider();
    const mutation = useUpdateBeregnTilDato();
    const queryClientUpdater = (updateFn: (currentData: BehandlingDtoV2) => BehandlingDtoV2) =>
        queryClient.setQueryData<BehandlingDtoV2>(QueryKeys.behandlingV2(behandlingId), updateFn);

    return { mutation, queryClientUpdater };
};
