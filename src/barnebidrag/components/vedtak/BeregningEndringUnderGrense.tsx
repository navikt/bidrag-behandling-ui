import { ResultatDescription } from "../../../common/components/vedtak/ResultatDescription";
import { formatterBeløpForBeregning, formatterProsent } from "../../../utils/number-utils";
import { useBidragBeregningPeriode } from "./DetaljertBeregningBidrag";

export const BeregningEndringUnderGrense = () => {
    const {
        beregningsdetaljer: { endringUnderGrense },
        erEndringUnderGrense,
        endeligBeløp,
    } = useBidragBeregningPeriode();

    if (!erEndringUnderGrense) return null;

    return (
        <ResultatDescription
            title="Endring under grense"
            data={[
                {
                    label: "Løpende bidragsbeløp",
                    textRight: false,
                    labelBold: true,
                    value: `${formatterBeløpForBeregning(endeligBeløp)}`,
                },
                {
                    label: "Endring i prosent",
                    textRight: false,
                    labelBold: true,
                    value: `(${formatterBeløpForBeregning(endeligBeløp)} - ${formatterBeløpForBeregning(endringUnderGrense.beregnetBidragBeløp)}) / ${formatterBeløpForBeregning(endeligBeløp)} = ${formatterProsent(endringUnderGrense.faktiskEndringFaktor)}`,
                },
            ].filter((d) => d)}
        />
    );
};
