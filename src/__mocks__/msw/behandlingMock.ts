import { BehandlingDtoV2, OppdatereVirkningstidspunkt } from "@api/BidragBehandlingApiV1";
import { rest, RestHandler } from "msw";

import environment from "../../environment";
import { behandlingMockApiData } from "../testdata/behandlingTestData";
import { behandlingMockApiDataV2 } from "../testdata/behandlingTestDataV2";

export function behandlingMock(): RestHandler[] {
    return [
        rest.get(`${environment.url.bidragBehandling}/api/v1/behandling/:behandlingId`, (req, res, ctx) => {
            if (!localStorage.getItem(`behandling-${req.params.behandlingId}`)) {
                localStorage.setItem(`behandlingId`, req.params.behandlingId.toString());
                localStorage.setItem(
                    `behandling-${req.params.behandlingId}`,
                    JSON.stringify({
                        ...behandlingMockApiData,
                        id: req.params.behandlingId,
                    })
                );
            }
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.body(localStorage.getItem(`behandling-${req.params.behandlingId}`))
            );
        }),
        rest.get(`${environment.url.bidragBehandling}/api/v2/behandling/:behandlingId`, (req, res, ctx) => {
            if (!localStorage.getItem(`behandling-${req.params.behandlingId}-V2`)) {
                localStorage.setItem(`behandlingId`, req.params.behandlingId.toString());
                localStorage.setItem(
                    `behandling-${req.params.behandlingId}-V2`,
                    JSON.stringify(behandlingMockApiDataV2)
                );
            }
            return res(
                ctx.set("Content-Type", "application/json"),
                ctx.body(localStorage.getItem(`behandling-${req.params.behandlingId}-V2`))
            );
        }),
        rest.put(`${environment.url.bidragBehandling}/api/v1/behandling/:behandlingId`, async (req, res, ctx) => {
            const body = await req.json();
            const behandling = JSON.parse(
                localStorage.getItem(`behandling-${req.params.behandlingId}`)
            ) as BehandlingDtoV2;
            const oppdater = body as OppdatereVirkningstidspunkt;
            const updatedBehandling: BehandlingDtoV2 = {
                ...behandling,
                ...oppdater,
                virkningstidspunkt: {
                    ...behandling.virkningstidspunkt,
                    årsak: oppdater?.årsak,
                    avslag: oppdater?.avslag,
                },
                id: Number(req.params.behandlingId),
            };

            const sucessHeaders = [
                ctx.set("Content-Type", "application/json"),
                ctx.status(200),
                ctx.body(JSON.stringify(updatedBehandling)),
            ];
            // const errorHeaders = [
            //     ctx.status(503),
            //     ctx.json({
            //         errorMessage: "Service Unavailable",
            //     }),
            // ];
            //
            // const index = Math.random() < 0.9 ? 0 : 1;
            // const response = [sucessHeaders, errorHeaders];
            const index = 0;
            const response = [sucessHeaders];

            if (index === 0) {
                localStorage.setItem(`behandling-${req.params.behandlingId}`, JSON.stringify(updatedBehandling));
            }

            return res(...response[index]);
        }),
    ];
}
