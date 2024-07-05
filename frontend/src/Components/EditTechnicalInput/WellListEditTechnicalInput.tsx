import {
    Button, Icon, NativeSelect, Typography,
} from "@equinor/eds-core-react"
import { delete_to_trash } from "@equinor/eds-icons"
import {
    ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState,
} from "react"
import { AgGridReact } from "@ag-grid-community/react"
import useStyles from "@equinor/fusion-react-ag-grid-styles"
import { ColDef } from "@ag-grid-community/core"
import Grid from "@mui/material/Grid"
import CustomHeaderForSecondaryHeader from "../../CustomHeaderForSecondaryHeader"
import { useProjectContext } from "../../Context/ProjectContext"
import { useAppContext } from "../../Context/AppContext"
import Modal from "../Modal/Modal"

interface Props {
    wells: Components.Schemas.WellDto[] | undefined
    setWells: Dispatch<SetStateAction<Components.Schemas.WellDto[]>>
    explorationWells: boolean
    setDeletedWells: Dispatch<SetStateAction<string[]>>
}

interface TableWell {
    id: string,
    name: string,
    wellCategory: Components.Schemas.WellCategory,
    drillingDays: number,
    wellCost: number,
    well: Components.Schemas.WellDto
    wells: Components.Schemas.WellDto[]
}

const WellListEditTechnicalInput = ({
    explorationWells,
    wells,
    setWells,
    setDeletedWells,
}: Props) => {
    const { editMode } = useAppContext()
    const { project } = useProjectContext()
    const [rowData, setRowData] = useState<TableWell[]>()
    const [wellStagedForDeletion, setWellStagedForDeletion] = useState<any | undefined>()

    const gridRef = useRef(null)
    const styles = useStyles()
    const onGridReady = (params: any) => { gridRef.current = params.api }

    const wellsToRowData = () => {
        if (wells) {
            const tableWells: TableWell[] = []
            wells.forEach((w) => {
                const tableWell: TableWell = {
                    id: w.id!,
                    name: w.name ?? "",
                    wellCategory: explorationWells ? 4 : 0,
                    drillingDays: w.drillingDays ?? 0,
                    wellCost: w.wellCost ?? 0,
                    well: w,
                    wells,
                }
                if (w.wellCategory) { tableWell.wellCategory = w.wellCategory }
                tableWells.push(tableWell)
            })
            setRowData(tableWells)
        }
    }

    const updateWells = (p: any) => {
        const rowWells: any[] = p.data.wells
        if (rowWells) {
            const { field } = p.colDef
            const index = rowWells.findIndex((w) => w === p.data.well)
            if (index > -1) {
                const well = rowWells[index]
                const updatedWell = well
                updatedWell[field as keyof typeof updatedWell] = field === "name"
                    ? p.newValue : Number(p.newValue.toString().replace(/,/g, "."))
                const updatedWells = [...rowWells]
                updatedWells[index] = updatedWell
                setWells(updatedWells)
            }
        }
    }

    const handleWellCategoryChange = async (
        e: ChangeEvent<HTMLSelectElement>,
        p: any,
    ) => {
        if ([0, 1, 2, 3, 4, 5, 6, 7].indexOf(Number(e.currentTarget.value)) !== -1) {
            const newProductionStrategy: Components.Schemas.WellCategory = Number(
                e.currentTarget.value,
            ) as Components.Schemas.WellCategory

            p.setValue(newProductionStrategy)
        }
    }

    const wellCategoryRenderer = (p: any) => {
        const value = Number(p.value)
        return (
            <NativeSelect
                id="wellCategory"
                label=""
                value={value}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleWellCategoryChange(e, p)}
            >
                {!explorationWells ? (
                    <>
                        <option key="0" value={0}>Oil producer</option>
                        <option key="1" value={1}>Gas producer</option>
                        <option key="2" value={2}>Water injector</option>
                        <option key="3" value={3}>Gas injector</option>
                    </>
                )
                    : (
                        <>
                            <option key="4" value={4}>Exploration well</option>
                            <option key="5" value={5}>Appraisal well</option>
                            <option key="6" value={6}>Sidetrack</option>
                        </>
                    )}
            </NativeSelect>
        )
    }

    const handleDeleteWell = (p: any) => {
        const rowWells: any[] = p.data.wells
        if (rowWells) {
            const index = rowWells.findIndex((w) => w === p.data.well)
            if (index > -1) {
                const updatedWells = [...rowWells]
                updatedWells.splice(index, 1)
                setWells(updatedWells)
                setDeletedWells((prev) => {
                    if (!prev.includes(p.data.well.id)) {
                        const deletedWells = [...prev]
                        deletedWells.push(p.data.well.id)
                        return deletedWells
                    }
                    return prev
                })
            }
        }
        setWellStagedForDeletion(undefined)
    }

    const deleteWellRenderer = (p: any) => (
        <Button
            variant="ghost_icon"
            onClick={() => {
                const wellIsInUse = false // todo: check if well is in use
                if (wellIsInUse) {
                    setWellStagedForDeletion(p)
                } else {
                    handleDeleteWell(p)
                }
            }}
        >
            <Icon data={delete_to_trash} />
        </Button>
    )

    const defaultColDef = useMemo(() => ({
        sortable: true,
        filter: true,
        resizable: true,
        editable: true,
        onCellValueChanged: updateWells,
        suppressHeaderMenuButton: true,
        cellClass: editMode ? "editableCell" : undefined,
    }), [])

    const [columnDefs] = useState<ColDef[]>([
        {
            field: "name",
            width: 110,
        },
        {
            field: "wellCategory",
            headerName: "Well type",
            cellRenderer: wellCategoryRenderer,
            width: 250,
            editable: false,
        },
        {
            field: "drillingDays",
            headerName: "Drilling days",
            width: 110,
            flex: 1,
        },
        {
            field: "wellCost",
            headerName: `Cost (${project?.currency === 1 ? "mill NOK" : "mill USD"})`,
            width: 90,
            flex: 1,
            headerComponent: CustomHeaderForSecondaryHeader,
            headerComponentParams: {
                columnHeader: "Cost",
                unit: project?.currency === 1 ? "mill NOK" : "mill USD",
            },
        },
        {
            field: "delete",
            headerName: "",
            cellRenderer: deleteWellRenderer,
            editable: false,
        },
    ])

    useEffect(() => {
        wellsToRowData()
    }, [wells])

    return (
        <>
            <Modal
                isOpen={!!wellStagedForDeletion}
                title="Delete well"
                size="sm"
                content={(
                    <Typography>
                        This well is currently in use in a case. Are you sure you want to delete it?
                    </Typography>

                )}
                actions={(
                    <>
                        <Button
                            onClick={() => setWellStagedForDeletion(undefined)}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleDeleteWell(wellStagedForDeletion)}
                            variant="contained"
                            color="danger"
                        >
                            Delete well
                        </Button>
                    </>
                )}

            />
            <Grid item xs={12} className={styles.root}>
                <div>
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        animateRows
                        domLayout="autoHeight"
                        onGridReady={onGridReady}
                        stopEditingWhenCellsLoseFocus
                        singleClickEdit={editMode}
                        suppressRowClickSelection
                    />
                </div>
            </Grid>
        </>
    )
}
export default WellListEditTechnicalInput
