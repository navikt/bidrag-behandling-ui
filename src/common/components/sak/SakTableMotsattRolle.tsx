import { PersonNavnIdent, RolleTag } from "@navikt/bidrag-ui-common";

import { useHentPersonData } from "../../hooks/useApiData";
import { Sak } from "./sak";

export default function SakTableMotsattRolle({ sak }: { sak: Sak }) {
    const person = useHentPersonData(sak.motsattRolle?.fodselsnummer);
    if (sak.erIkkeBidragSak) {
        return <div></div>;
    }
    if (sak.begrensetTilgang) {
        return (
            <div>
                <p>
                    Skjermet
                    <RolleTag rolleType={sak.motsattRolle?.type} />
                </p>
            </div>
        );
    }
    if (!sak.ferdigRegistrert) {
        return <div>Ikke ferdigregistrert</div>;
    }

    if (!sak.motsattRolle) {
        return <div>Ingen motpart</div>;
    }

    return (
        <div className="[&>.personident]:grow-1 [&>span]:flex-wrap w-[140px]">
            {sak.motsattRolle?.fodselsnummer ? (
                <PersonNavnIdent
                    rolle={sak.motsattRolle.type}
                    ident={sak.motsattRolle.fodselsnummer}
                    navn={person?.data.visningsnavn ?? ""}
                />
            ) : (
                <p>{person?.data.visningsnavn ?? ""}</p>
            )}
        </div>
    );
}
