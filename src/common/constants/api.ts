import { Api as BidragBehandlingApiV1 } from "@api/BidragBehandlingApiV1";
import { Api as BidragDokumentProduksjonApi } from "@api/BidragDokumentProduksjonApi";
import { Api as PersonApi } from "@api/PersonApi";
import { useApi } from "@navikt/bidrag-ui-common";

import environment from "../../environment";

export const PERSON_API = useApi(new PersonApi({ baseURL: process.env.BIDRAG_PERSON_URL }), {
    app: "bidrag-person",
    cluster: "fss",
    showAlertOnNetworkError: environment.system.visMeldingVedNettverksfeil,
});

export const BEHANDLING_API_V1 = useApi(new BidragBehandlingApiV1({ baseURL: environment.url.bidragBehandling }), {
    app: "bidrag-behandling",
    cluster: "gcp",
    env: environment.system.environment,
    showAlertOnNetworkError: environment.system.visMeldingVedNettverksfeil,
});

export const BIDRAG_DOKUMENT_PRODUKSJON_API = useApi(
    new BidragDokumentProduksjonApi({ baseURL: environment.url.bidragDokumentProduksjon }),
    {
        app: "bidrag-dokument-produksjon",
        cluster: "gcp",
        showAlertOnNetworkError: environment.system.visMeldingVedNettverksfeil,
    }
);
