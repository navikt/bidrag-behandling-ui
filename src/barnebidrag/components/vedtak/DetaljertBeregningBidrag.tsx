import { VStack } from "@navikt/ds-react";
import { createContext, useContext } from "react";

import {
    BidragPeriodeBeregningsdetaljer,
    ResultatBarnebidragsberegningPeriodeDto,
    Resultatkode,
    Rolletype,
} from "../../../api/BidragBehandlingApiV1";
import { BPsEvne } from "../../../common/components/vedtak/BPsEvneTabell";
import { BarnetilleggSkatteprosent } from "./BarnetilleggSkatteprosent";
import { BeregningBegrensetRevurdering } from "./BeregningBegrensetRevurdering";
import { EndeligBidragTable } from "./BeregningEndeligBidrag";
import { BeregningEndringUnderGrense } from "./BeregningEndringUnderGrense";
import { BeregningFordeltBidrag } from "./BeregningFordeltBidrag";
import { BeregningForholdsmessigFordeling } from "./BeregningForholdsmessigFordeling";
import { BeregningJusterBMsBarnetillegg } from "./BeregningJusterBMsBarnetillegg";
import { BeregningJusterBPsBarnetillegg } from "./BeregningJusterBPsBarnetillegg";
import BeregningSamværsfradrag from "./BeregningSamværsfradrag";
import { BPsAndelUnderholdskostnad } from "./BPsAndelUnderholdstkostnad";
import { NettoBarnetilleggTable } from "./NettoBarnetilleggTable";

type DetaljertBeregningBidragProps = {
    periode: ResultatBarnebidragsberegningPeriodeDto;
};

type BidragBeregningContextProps = {
    endeligBeløp: number;
    erEndringUnderGrense: boolean;
    beregningsdetaljer: BidragPeriodeBeregningsdetaljer;
};
export const BidragBeregningContext = createContext<BidragBeregningContextProps | null>(null);
export const useBidragBeregningPeriode = () => {
    const context = useContext(BidragBeregningContext);
    if (context === null) {
        throw new Error("useBidragBeregningPeriode must be used within a BidragBeregningContext");
    }
    return context;
};

export const DetaljertBeregningBidrag: React.FC<DetaljertBeregningBidragProps> = ({ periode }) => {
    const beregningsdetaljer = periode.beregningsdetaljer as BidragPeriodeBeregningsdetaljer;

    if (periode.erBeregnetAvslag) return null;
    return (
        <VStack gap="6" className={"w-[800px]"}>
            <BidragBeregningContext.Provider
                value={{
                    beregningsdetaljer,
                    endeligBeløp: periode.faktiskBidrag,
                    erEndringUnderGrense: periode.resultatKode === Resultatkode.INGEN_ENDRING_UNDER_GRENSE,
                }}
            >
                <BPsAndelUnderholdskostnad />

                {!beregningsdetaljer.deltBosted && <BeregningSamværsfradrag />}
                {!beregningsdetaljer.deltBosted && beregningsdetaljer.barnetilleggBM.barnetillegg.length > 0 && (
                    <VStack gap="2">
                        <BarnetilleggSkatteprosent rolle={Rolletype.BM} />
                        <NettoBarnetilleggTable rolle={Rolletype.BM} />
                        <BeregningJusterBMsBarnetillegg />
                    </VStack>
                )}

                <VStack gap="2">
                    <BPsEvne
                        inntekter={beregningsdetaljer.inntekter}
                        bidragsevne={beregningsdetaljer.delberegningBidragsevne}
                    />
                    <BeregningFordeltBidrag />
                    <BeregningForholdsmessigFordeling />
                </VStack>
                <BeregningBegrensetRevurdering />
                {!beregningsdetaljer.deltBosted && beregningsdetaljer.barnetilleggBP.barnetillegg.length > 0 && (
                    <VStack gap="2">
                        <BarnetilleggSkatteprosent rolle={Rolletype.BP} />
                        <NettoBarnetilleggTable rolle={Rolletype.BP} />
                        <BeregningJusterBPsBarnetillegg />
                    </VStack>
                )}
                <EndeligBidragTable />
                <BeregningEndringUnderGrense />
            </BidragBeregningContext.Provider>
        </VStack>
    );
};
