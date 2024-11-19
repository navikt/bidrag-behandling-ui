import { ResultatTable } from "../../../common/components/vedtak/ResultatTable";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

// eslint-disable-next-line no-empty-pattern
export const BeregningFordeltBidrag = () => {
    const {
        beregningsdetaljer: { sluttberegning, delberegningBidragsevne: evne, beløpEtterFratrekkDeltBosted },
    } = useBidragBeregningPeriode();

    function renderResult() {
        if (sluttberegning.justertNedTilEvne) {
            return ` (redusert ned til evne)`;
        } else if (sluttberegning.justertNedTil25ProsentAvInntekt) {
            return ` (redusert ned til 25% av inntekt)`;
        }
        return "";
    }

    function hentForeløpigBidrag() {
        if (sluttberegning.justertNedTilEvne) return formatterBeløpForBeregning(evne.bidragsevne);
        if (sluttberegning.justertNedTil25ProsentAvInntekt) return formatterBeløpForBeregning(evne.sumInntekt25Prosent);
        return formatterBeløpForBeregning(beløpEtterFratrekkDeltBosted);
    }
    return (
        <ResultatTable
            data={[
                {
                    label: "25% av inntekt",
                    textRight: false,
                    labelBold: true,
                    value: formatterBeløpForBeregning(evne.sumInntekt25Prosent),
                },
                {
                    label: "Foreløpig bidrag",
                    textRight: false,
                    labelBold: true,
                    value: `${hentForeløpigBidrag()}${renderResult()}`,
                },
            ].filter((d) => d)}
        />
    );
};