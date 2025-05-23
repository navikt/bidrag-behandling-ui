import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

export const BeregningForholdsmessigFordeling = () => {
    const {
        beregningsdetaljer: { sluttberegning, bpsAndel, delberegningBidragsevne },
    } = useBidragBeregningPeriode();

    const erFF =
        sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor &&
        sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor < 1;
    if (!erFF) return null;
    function renderResult() {
        if (sluttberegning.bidragJustertNedTil25ProsentAvInntekt) {
            return ` (redusert ned til 25% av inntekt)`;
        } else if (sluttberegning.bidragJustertNedTilEvne) {
            return ` (redusert ned til evne)`;
        }
        return "";
    }
    return (
        <ResultatDescription
            title="Forholdsmessig fordeling"
            data={[
                {
                    label: "BPs totale underholdskostnad",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(sluttberegning.bpSumAndelAvU ?? 0)}`,
                },
                {
                    label: "Andel av underholdskostnad",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(bpsAndel?.andelBeløp ?? 0)} / ${formatterBeløpForBeregning(sluttberegning.bpSumAndelAvU ?? 0)}`,
                    result: `${formatterProsent(sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor)}`,
                },
                {
                    label: "BPs evne etter forholdsmessig fordeling",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterProsent(sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor ?? 0)} x ${formatterBeløpForBeregning(Math.min(delberegningBidragsevne.bidragsevne, delberegningBidragsevne.sumInntekt25Prosent))}`,
                    result: `${formatterBeløpForBeregning(sluttberegning.bpEvneVedForholdsmessigFordeling)}`,
                },
                {
                    label: "Foreløpig bidrag",
                    textRight: false,
                    labelBold: true,
                    value: ` ${formatterBeløpForBeregning(sluttberegning.bruttoBidragJustertForEvneOg25Prosent ?? 0)}${renderResult()}`,
                },
            ].filter((d) => d)}
        />
    );
};
