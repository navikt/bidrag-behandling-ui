import { LoggerService, PersonNavnIdent, RolleTag } from "@navikt/bidrag-ui-common";
import { Alert, BodyShort, Button, Checkbox, CheckboxGroup, Heading, HGrid, Modal } from "@navikt/ds-react";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

import { Rolletype } from "../../../api/SakApi";
import { SAK_API } from "../../constants/api";
import { MåBekrefteOpplysningerStemmerError } from "../../constants/MåBekrefteOpplysningerStemmerError";
import { useGetSakerForBp, useRefetchFFInfoFn } from "../../hooks/useApiData";
import { KategoriNavnDisplayValue, Sak, SakStatusDisplayValue } from "./sak";
import SakTableMotsattRolle from "./SakTableMotsattRolle";
import SelectSakCheckbox from "./SelectSakCheckbox";
import TableInternal, { ColumnData, RowData } from "./Table";

interface SakstilknytningTableProps {
    gjelderBarnIdent: string;
    onClose: () => void;
}
const columns: ColumnData[] = [{ label: "" }, { label: "Sak" }, { label: "Motpart" }, { label: "Enhet" }];

export function SakstilknytningModal({ gjelderBarnIdent }: { gjelderBarnIdent: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button size="xsmall" variant="secondary" onClick={() => setIsOpen(true)}>
                Knytt til eksisterende sak
            </Button>
            <Modal open={isOpen} onClose={() => setIsOpen(false)} aria-label="Koble til sak" className="max-w-max">
                <Modal.Header>Knytt til eksisterende sak</Modal.Header>
                <Modal.Body>
                    <SakstilknytningTable gjelderBarnIdent={gjelderBarnIdent} onClose={() => setIsOpen(false)} />
                </Modal.Body>
            </Modal>
        </>
    );
}
export default function SakstilknytningTable({ gjelderBarnIdent, onClose }: SakstilknytningTableProps) {
    const [oppdaterSak, setOppdaterSak] = React.useState<Sak>();
    const [bekreftetSakstilknytning, setBekreftetSakstilknytning] = useState(false);
    const saker = useGetSakerForBp();
    const refetchFFInfo = useRefetchFFInfoFn();
    const leggTilSakFn = useMutation({
        mutationFn: async () => {
            if (!oppdaterSak) {
                throw new Error("Du må velge en sak før du kan legge den til");
            }
            if (!bekreftetSakstilknytning) {
                throw new MåBekrefteOpplysningerStemmerError();
            }
            try {
                const oppdatertSak = SAK_API.sak.oppdaterSak({
                    saksnummer: oppdaterSak.saksnummer,
                    roller: [
                        {
                            rolleType: Rolletype.BA,
                            type: Rolletype.BA,
                            foedselsnummer: gjelderBarnIdent,
                            mottagerErVerge: false,
                        },
                    ],
                });
                console.log("oppdatertSak", oppdatertSak);
            } catch (e) {
                LoggerService.error("Feil ved oppdatering av sak", e);
            }
        },
        onSuccess: () => {
            onClose();
            refetchFFInfo();
        },
    });
    const måBekrefteAtOpplysningerStemmerFeil =
        leggTilSakFn.isError && leggTilSakFn.error instanceof MåBekrefteOpplysningerStemmerError;
    function BekreftKnyttTilSak() {
        if (!oppdaterSak) return;
        return (
            <Alert
                size="small"
                className="pt-2 mt-2 mb-2 pb-2"
                variant={
                    måBekrefteAtOpplysningerStemmerFeil ? "error" : bekreftetSakstilknytning ? "success" : "warning"
                }
            >
                <Heading spacing level="2" size="xsmall">
                    Bekreft at barnet skal tilknyttes sak {oppdaterSak.saksnummer}
                </Heading>
                <BodyShort
                    size="small"
                    className="mb-4 [&>span]:inline-flex [&>span]:relative [&>span]:top-[6px] [&>span]:right-[3px]"
                >
                    <PersonNavnIdent ident={gjelderBarnIdent} variant="compact" />
                    vil bli knyttet til sak {oppdaterSak.saksnummer}. Ved å bekrefte at barnet skal tilknyttes valgt
                    sak, godkjenner du barnet tilhører saken og bidragsmottaker{" "}
                    <PersonNavnIdent ident={oppdaterSak.motsattRolle.fodselsnummer} variant="compact" />.
                </BodyShort>

                <CheckboxGroup
                    legend=""
                    hideLegend
                    error={
                        måBekrefteAtOpplysningerStemmerFeil
                            ? "Du må bekrefte at barnet skal tilknyttes valgt sak"
                            : undefined
                    }
                >
                    <Checkbox
                        checked={bekreftetSakstilknytning}
                        error={måBekrefteAtOpplysningerStemmerFeil}
                        onChange={() => {
                            setBekreftetSakstilknytning((x) => !x);
                            leggTilSakFn.reset();
                        }}
                    >
                        Jeg bekrefter at barnet skal tilknyttes valgt sak
                    </Checkbox>
                </CheckboxGroup>
            </Alert>
        );
    }

    function renderTable() {
        if (saker.length === 0) {
            return (
                <>
                    <Alert variant="info" size="small" inline className={"no-sak-alert"}>
                        Bidragspliktig har ingen tilknyttede saker
                    </Alert>
                </>
            );
        }
        return (
            <CheckboxGroup error={leggTilSakFn.error?.message} legend="" hideLegend>
                <TableInternal
                    id={"sakstilknytningTable"}
                    columns={columns}
                    rows={(row) => createRow(row, setOppdaterSak, oppdaterSak)}
                    data={saker}
                    expandableContent={RollerExpandableContent}
                />
            </CheckboxGroup>
        );
    }

    return (
        <div>
            {leggTilSakFn.error?.message && !måBekrefteAtOpplysningerStemmerFeil && (
                <Alert variant="error" size="small">
                    {`Det skjedde en feil ved registrering av sak: ${leggTilSakFn.error.message}`}
                </Alert>
            )}
            {renderTable()}
            <BekreftKnyttTilSak />
            <Modal.Footer>
                <Button
                    variant="primary"
                    size="xsmall"
                    onClick={() => {
                        leggTilSakFn.mutate();
                    }}
                    disabled={!oppdaterSak}
                >
                    Knytt barn til valgt sak
                </Button>
                <Button variant="secondary" size="xsmall" onClick={onClose}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </div>
    );
}

function RollerExpandableContent(sak: Sak) {
    const finnesRm = sak.roller.some((rolle) => rolle.reellMottaker !== null && rolle.reellMottaker !== undefined);
    return (
        <div className="flex flex-col gap-2">
            <Heading size="xsmall" className="mb-4">
                Roller i sak
            </Heading>
            <HGrid className="w-max" gap={"4"} columns={2}>
                {sak.roller
                    .filter((rolle) => rolle.type !== Rolletype.FR && rolle.type !== Rolletype.RM)
                    .sort((a, b) => {
                        if (a.type === Rolletype.BA && b.type !== Rolletype.BA) {
                            return 1;
                        }
                        if (a.type === Rolletype.BA && b.type === Rolletype.BA) {
                            return b.fodselsnummer.localeCompare(a.fodselsnummer);
                        }
                        return -1;
                    })
                    .map((rolle) => (
                        <div className={`flex flex-col gap-2 `} key={rolle.fodselsnummer}>
                            <div className="w-full inline-flex ">
                                <PersonNavnIdent rolle={rolle.type} ident={rolle.fodselsnummer} />
                            </div>
                            {finnesRm && rolle.type === Rolletype.BA ? (
                                rolle.reellMottaker ? (
                                    <div className="ml-[0.2em] text-slate-500">
                                        <PersonNavnIdent rolle={Rolletype.RM} ident={rolle.reellMottaker.ident} />
                                        {rolle.reellMottaker.verge && (
                                            <>
                                                <span className="mx-1">/</span>
                                                <span className="personident">{"Verge"}</span>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="ml-[0.2em] text-slate-500">
                                        <RolleTag rolleType={Rolletype.RM} />
                                        <span className="ml-2 personnavn">Ingen reell mottaker</span>
                                    </div>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
            </HGrid>
        </div>
    );
}

function createRow(sak: Sak, setRegistrerSak: (saksnummer: Sak) => void, registrerSak?: Sak): RowData {
    const isSelected = registrerSak?.saksnummer === sak.saksnummer;

    return {
        components: [
            {
                content: <SelectSakCheckbox sak={sak} isSelected={isSelected} onChecked={() => setRegistrerSak(sak)} />,
                className: "row-checbox",
                width: "1",
            },
            {
                content: (
                    <>
                        {sak.saksnummer && (
                            <span className="inline [&__p]:inline">
                                {/* [&__p]:inline */}
                                <p className="inline">{sak.saksnummer}</p>
                                <RolleTag rolleType={sak.rolle?.type} />
                            </span>
                        )}
                        <p> {KategoriNavnDisplayValue[sak.kategori]}</p>
                        <p>{SakStatusDisplayValue[sak.saksstatus]}</p>
                    </>
                ),
            },
            {
                content: <SakTableMotsattRolle sak={sak} />,
            },
            {
                content: (
                    <BodyShort size="small">
                        <div>{sak.eierfogd}</div>
                        <div>{sak.enhetInformasjon ?? "Fant ikke enhetsnavn"}</div>
                    </BodyShort>
                ),
            },
        ],
        isSelected: isSelected,
    };
}
