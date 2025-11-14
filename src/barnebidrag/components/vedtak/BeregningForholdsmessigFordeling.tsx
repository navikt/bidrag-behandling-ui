import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

export const BeregningForholdsmessigFordeling = () => {
    const {
        beregningsdetaljer: { sluttberegning, bpsAndel, delberegningBidragsevne, forholdsmessigFordeling },
    } = useBidragBeregningPeriode();

    const erFF =
        (sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor &&
            sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor < 1) ||
        forholdsmessigFordeling.erForholdsmessigFordelt;
    if (!erFF) return null;
    function renderResult() {
        if (sluttberegning.bidragJustertNedTil25ProsentAvInntekt) {
            return ` (redusert ned til 25% av inntekt)`;
        } else if (sluttberegning.bidragJustertNedTilEvne) {
            return ` (redusert ned til evne)`;
        }
        return "";
    }
    const bpAndelAvUVedForholdsmessigFordelingFaktor =
        sluttberegning.bpAndelAvUVedForholdsmessigFordelingFaktor ??
        forholdsmessigFordeling?.andelAvSumBidragTilFordelingFaktor;
    const bpEvneVedForholdsmessigFordeling =
        forholdsmessigFordeling?.andelAvEvneBeløp ?? sluttberegning.bpEvneVedForholdsmessigFordeling;
    const bidragTilFordelingForBarnet = Math.min(
        delberegningBidragsevne.bidragsevne,
        delberegningBidragsevne.sumInntekt25Prosent
    );
    const foreløpigBidrag =
        forholdsmessigFordeling?.bidragEtterFordeling ?? sluttberegning.bruttoBidragJustertForEvneOg25Prosent ?? 0;
    const bpsSumAndelAvU = forholdsmessigFordeling?.sumBidragTilFordeling ?? sluttberegning.bpSumAndelAvU ?? 0;
    const andelFordeltTilBarnet = forholdsmessigFordeling?.bidragTilFordelingForBarnet ?? bpsAndel.andelBeløp ?? 0;
    return (
        <ResultatDescription
            title="Forholdsmessig fordeling"
            data={[
                {
                    label: "BPs totale underholdskostnad",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(bpsSumAndelAvU)}`,
                },
                {
                    label: "Barnets andel av underholdskostnad",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(andelFordeltTilBarnet)} / ${formatterBeløpForBeregning(bpsSumAndelAvU)}`,
                    result: `${formatterProsent(bpAndelAvUVedForholdsmessigFordelingFaktor)}`,
                },
                {
                    label: "BPs evne etter forholdsmessig fordeling",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterProsent(bpAndelAvUVedForholdsmessigFordelingFaktor)} x ${formatterBeløpForBeregning(bidragTilFordelingForBarnet)}`,
                    result: `${formatterBeløpForBeregning(bpEvneVedForholdsmessigFordeling)}`,
                },
                {
                    label: "Foreløpig bidrag",
                    textRight: false,
                    labelBold: true,
                    value: ` ${formatterBeløpForBeregning(foreløpigBidrag)}${renderResult()}`,
                },
            ].filter((d) => d)}
        />
    );
};
