import { Heading, VStack } from "@navikt/ds-react";

import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

export const IndeksreguleringDetaljer = () => {
    const { beregningsdetaljer } = useBidragBeregningPeriode();
    const indeksreguleringDetaljer = beregningsdetaljer.indeksreguleringDetaljer;
    if (!indeksreguleringDetaljer) return null;
    return (
        <VStack gap="2">
            <Heading size="xsmall">Indeksregulering</Heading>
            <ResultatDescription
                data={[
                    {
                        label: "Indeksregulert beløp",
                        labelBold: true,
                        value: `${formatterBeløpForBeregning(indeksreguleringDetaljer.sluttberegning?.originaltBeløp, true)}`,
                    },
                    {
                        label: "Indeksfaktor",
                        labelBold: true,
                        value: `${formatterProsent(indeksreguleringDetaljer.faktor)}`,
                    },
                    {
                        label: "Beregning",
                        labelBold: true,
                        value: `${formatterBeløpForBeregning(indeksreguleringDetaljer.sluttberegning?.originaltBeløp, true)} x ${formatterProsent(100 + indeksreguleringDetaljer.faktor)}`,
                        result: formatterBeløpForBeregning(indeksreguleringDetaljer.sluttberegning?.beløp),
                    },
                ].filter((d) => d)}
            />
        </VStack>
    );
};
