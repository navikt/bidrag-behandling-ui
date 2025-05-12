import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

export const BeregningFordeltBidrag = () => {
    const {
        beregningsdetaljer: { sluttberegning, sluttberegningAldersjustering, delberegningBidragsevne: evne },
    } = useBidragBeregningPeriode();

    if (!evne) return null;
    const erFF =
        sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor &&
        sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor < 1;
    function renderResult() {
        if (erFF) return "";
        if (sluttberegning.bidragJustertNedTilEvne) {
            return ` (redusert ned til evne)`;
        } else if (sluttberegning.bidragJustertNedTil25ProsentAvInntekt) {
            return ` (redusert ned til 25% av inntekt)`;
        }
        return "";
    }

    return (
        <ResultatDescription
            data={[
                {
                    label: "25% av inntekt",
                    textRight: false,
                    labelBold: true,
                    value: formatterBeløpForBeregning(evne.sumInntekt25Prosent),
                },
                !erFF && {
                    label: "Foreløpig bidrag",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(sluttberegningAldersjustering?.beregnetBeløp ?? sluttberegning.bruttoBidragJustertForEvneOg25Prosent)}${renderResult()}`,
                },
            ].filter((d) => d)}
        />
    );
};
