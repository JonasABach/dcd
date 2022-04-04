import { Button, Input, Typography } from "@equinor/eds-core-react"
import { useEffect, useState } from "react"
import {
    useLocation, useNavigate, useParams,
} from "react-router"
import styled from "styled-components"
import DataTable, { CellValue } from "../Components/DataTable/DataTable"
import {
    buildGridData, getColumnAbsoluteYears, replaceOldData,
} from "../Components/DataTable/helpers"
import Import from "../Components/Import/Import"
import { DrillingScheduleDto } from "../models/assets/wellproject/DrillingScheduleDto"
import { WellProject } from "../models/assets/wellproject/WellProject"
import { WellProjectCostProfileDto } from "../models/assets/wellproject/WellProjectCostProfileDto"
import { Case } from "../models/Case"
import { Project } from "../models/Project"
import { GetProjectService } from "../Services/ProjectService"
import { GetWellProjectService } from "../Services/WellProjectService"

const AssetHeader = styled.div`
    margin-bottom: 2rem;
    display: flex;

    > *:first-child {
        margin-right: 2rem;
    }
`

const AssetViewDiv = styled.div`
    margin: 2rem;
    display: flex;
    flex-direction: column;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
`

const WrapperColumn = styled.div`
    display: flex;
    flex-direction: column;
`

const ImportButton = styled(Button)`
    margin-left: 2rem;
    &:disabled {
        margin-left: 2rem;
    }
`

const SaveButton = styled(Button)`
    margin-top: 5rem;
    margin-left: 2rem;
    &:disabled {
        margin-left: 2rem;
        margin-top: 5rem;
    }
`

const Dg4Field = styled.div`
    margin-left: 1rem;
    margin-bottom: 2rem;
    width: 10rem;
    display: flex;
`

function WellProjectView() {
    const [, setProject] = useState<Project>()
    const [caseItem, setCase] = useState<Case>()
    const [wellProject, setWellProject] = useState<WellProject>()
    const [columns, setColumns] = useState<string[]>([""])
    const [gridData, setGridData] = useState<CellValue[][]>([[]])
    const [costProfileDialogOpen, setCostProfileDialogOpen] = useState(false)
    const [drillingColumns, setDrillingColumns] = useState<string[]>([""])
    const [gridDrillingData, setGridDrillingData] = useState<CellValue[][]>([[]])
    const [drillingDialogOpen, setDrillingDialogOpen] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const emptyGuid = "00000000-0000-0000-0000-000000000000"

    useEffect(() => {
        (async () => {
            try {
                const projectResult = await GetProjectService().getProjectByID(params.projectId!)
                setProject(projectResult)
                const caseResult = projectResult.cases.find((o) => o.id === params.caseId)
                setCase(caseResult)
                let newWellProject = projectResult.wellProjects.find((s) => s.id === params.wellProjectId)
                if (newWellProject !== undefined) {
                    setWellProject(newWellProject)
                } else {
                    newWellProject = new WellProject()
                    setWellProject(newWellProject)
                }
                const newColumnTitles = getColumnAbsoluteYears(caseResult, newWellProject?.costProfile)
                setColumns(newColumnTitles)
                const newGridData = buildGridData(newWellProject?.costProfile)
                setGridData(newGridData)
                const newDrillingColumnTitles = getColumnAbsoluteYears(caseResult, newWellProject?.drillingSchedule)
                setDrillingColumns(newDrillingColumnTitles)
                const newDrillingGridData = buildGridData(newWellProject?.drillingSchedule)
                setGridDrillingData(newDrillingGridData)
            } catch (error) {
                console.error(`[CaseView] Error while fetching project ${params.projectId}`, error)
            }
        })()
    }, [params.projectId, params.caseId])

    const onCellsChanged = (changes: { cell: { value: number }; col: number; row: number; value: string }[]) => {
        const newGridData = replaceOldData(gridData, changes)
        setGridData(newGridData)
        setColumns(getColumnAbsoluteYears(caseItem, wellProject?.costProfile))
        setHasChanges(true)
    }

    const onImport = (input: string, year: number) => {
        const newWellProject = WellProject.Copy(wellProject!)
        if (newWellProject.costProfile === undefined) {
            newWellProject.costProfile = new WellProjectCostProfileDto()
        }
        newWellProject.costProfile!.startYear = year
        // eslint-disable-next-line max-len
        newWellProject.costProfile!.values = input.replace(/(\r\n|\n|\r)/gm, "").split("\t").map((i) => parseFloat(i))
        setWellProject(newWellProject)
        const newColumnTitles = getColumnAbsoluteYears(caseItem, newWellProject?.costProfile)
        setColumns(newColumnTitles)
        const newGridData = buildGridData(newWellProject?.costProfile)
        setGridData(newGridData)
        setCostProfileDialogOpen(!costProfileDialogOpen)
        setHasChanges(true)
    }

    const onDrillingImport = (input: string, year: number) => {
        const newWellProject = WellProject.Copy(wellProject!)
        if (newWellProject.drillingSchedule === undefined) {
            newWellProject.drillingSchedule = new DrillingScheduleDto()
        }
        newWellProject.drillingSchedule!.startYear = year
        // eslint-disable-next-line max-len
        newWellProject.drillingSchedule!.values = input.replace(/(\r\n|\n|\r)/gm, "").split("\t").map((i) => parseInt(i, 10))
        setWellProject(newWellProject)
        const newColumnTitles = getColumnAbsoluteYears(caseItem, newWellProject?.drillingSchedule)
        setDrillingColumns(newColumnTitles)
        const newGridData = buildGridData(newWellProject?.drillingSchedule)
        setGridDrillingData(newGridData)
        setDrillingDialogOpen(!drillingDialogOpen)
        setHasChanges(true)
    }

    const handleSave = async () => {
        const wellProjectDto = WellProject.ToDto(wellProject!)
        if (wellProject?.id === emptyGuid) {
            wellProjectDto.projectId = params.projectId
            const newProject = await GetWellProjectService().createWellProject(params.caseId!, wellProjectDto!)
            const newWellProject = newProject.wellProjects.at(-1)
            const newUrl = location.pathname.replace(emptyGuid, newWellProject!.id!)
            setProject(newProject)
            const caseResult = newProject.cases.find((o) => o.id === params.caseId)
            setCase(caseResult)
            setWellProject(newWellProject)
            navigate(`${newUrl}`, { replace: true })
        } else {
            const newProject = await GetWellProjectService().updateWellProject(wellProjectDto!)
            setProject(newProject)
            const newCase = newProject.cases.find((o) => o.id === params.caseId)
            setCase(newCase)
            const newWellProject = newProject.wellProjects.find((s) => s.id === params.wellProjectId)
            setWellProject(newWellProject)
        }
        setHasChanges(false)
    }

    return (
        <AssetViewDiv>
            <AssetHeader>
                <Typography variant="h2">{wellProject?.name}</Typography>
            </AssetHeader>
            <Wrapper>
                <Typography variant="h4">DG4</Typography>
                <Dg4Field>
                    <Input disabled defaultValue={caseItem?.DG4Date?.toLocaleDateString("en-CA")} type="date" />
                </Dg4Field>
            </Wrapper>
            <Wrapper>
                <Typography variant="h4">Cost profile</Typography>
                <ImportButton onClick={() => { setCostProfileDialogOpen(true) }}>Import</ImportButton>
            </Wrapper>
            <WrapperColumn>
                <DataTable columns={columns} gridData={gridData} onCellsChanged={onCellsChanged} />
            </WrapperColumn>
            {!costProfileDialogOpen ? null
                : <Import onClose={() => { setCostProfileDialogOpen(!costProfileDialogOpen) }} onImport={onImport} />}
            <Wrapper>
                <Typography variant="h4">Drilling schedule</Typography>
                <ImportButton onClick={() => { setDrillingDialogOpen(true) }}>Import</ImportButton>
            </Wrapper>
            <WrapperColumn>
                <DataTable columns={drillingColumns} gridData={gridDrillingData} onCellsChanged={onCellsChanged} />
            </WrapperColumn>
            {!drillingDialogOpen ? null
                : <Import onClose={() => { setDrillingDialogOpen(!drillingDialogOpen) }} onImport={onDrillingImport} />}
            <Wrapper><SaveButton disabled={!hasChanges} onClick={handleSave}>Save</SaveButton></Wrapper>

        </AssetViewDiv>
    )
}

export default WellProjectView