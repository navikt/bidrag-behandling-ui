import { ResultatTable } from "../../../common/components/vedtak/ResultatTable";
import { formatterBeløpForBeregning } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

// eslint-disable-next-line no-empty-pattern
export const EndeligBidragTable = () => {
    const {
        beregningsdetaljer: { deltBosted, sluttberegning, samværsfradrag: beregning },
    } = useBidragBeregningPeriode();

    return (
        <ResultatTable
            title="Endelig bidrag"
            data={[
                !deltBosted && {
                    label: "Etter samværsfradraget",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(sluttberegning.bruttoBidragEtterBarnetilleggBP)} - ${formatterBeløpForBeregning(beregning.samværsfradrag)} = ${formatterBeløpForBeregning(sluttberegning.beregnetBeløp)}`,
                },
                {
                    label: "Avrundet beløp",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(sluttberegning.resultatBeløp)}`,
                },
            ].filter((d) => d)}
        />
    );
};
