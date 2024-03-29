import { SakHeader } from "@navikt/bidrag-ui-common";
import { Loader } from "@navikt/ds-react";
import React, { memo, Suspense } from "react";

import text from "../../constants/texts";
import { useForskudd } from "../../context/ForskuddContext";
import { useGetBehandlingV2, usePersonsQueries } from "../../hooks/useApiData";

export const Header = memo(() => {
    const { behandlingId, vedtakId } = useForskudd();
    const { roller, saksnummer } = useGetBehandlingV2();
    const personsQueries = usePersonsQueries(roller);
    const rollerMedPersonNavn = personsQueries.map(({ data }) => data);
    return (
        <SakHeader
            saksnummer={saksnummer}
            roller={rollerMedPersonNavn.map((person) => ({
                ...person,
                ident: person.ident!,
                navn: person.visningsnavn,
            }))}
            skjermbilde={{ navn: text.skjermbildeNavn, referanse: `#${behandlingId ?? vedtakId}` }}
        />
    );
});

export const ForskuddHeader = () => (
    <Suspense
        fallback={
            <div className="flex justify-center">
                <Loader size="3xlarge" title={text.loading} variant="interaction" />
            </div>
        }
    >
        <Header />
    </Suspense>
);
