import {
    Button, Icon, Progress, Tabs, Typography,
} from "@equinor/eds-core-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useModuleCurrentContext } from "@equinor/fusion-framework-react-module-context"
import styled from "styled-components"
import {
    more_vertical,
    arrow_back,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { Tooltip } from "@mui/material"
import { projectPath, unwrapProjectId } from "../Utils/common"
import CaseDropMenu from "../Components/Case/Components/CaseDropMenu"
import { GetProjectService } from "../Services/ProjectService"
import CaseDescriptionTab from "../Components/Case/Tabs/CaseDescriptionTab"
import CaseCostTab from "../Components/Case/Tabs/CaseCostTab"
import CaseFacilitiesTab from "../Components/Case/Tabs/CaseFacilitiesTab"
import CaseProductionProfilesTab from "../Components/Case/Tabs/CaseProductionProfilesTab"
import CaseScheduleTab from "../Components/Case/Tabs/CaseScheduleTab"
import CaseSummaryTab from "../Components/Case/Tabs/CaseSummaryTab"
import CaseDrillingScheduleTab from "../Components/Case/Tabs/CaseDrillingSchedule/CaseDrillingScheduleTab"
import CaseCO2Tab from "../Components/Case/Tabs/Co2Emissions/CaseCO2Tab"
import { GetCaseWithAssetsService } from "../Services/CaseWithAssetsService"
import { useAppContext } from "../Context/AppContext"
import { useModalContext } from "../Context/ModalContext"

const { Panel } = Tabs
const { List, Tab, Panels } = Tabs

const Wrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`

const StyledList = styled(List)`
    border-bottom: 1px solid LightGray;
   
`
const PageTitle = styled.div`
    flex-grow: 1;
    padding-left: 10px;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    gap: 10px;
`
const StyledTabs = styled(Tabs)`
    flex: 1;
    display: flex;
    flex-direction: column;
`
const StyledTabPanel = styled(Panel)`
    margin: 20px;
`
const HeaderWrapper = styled.div`
    padding-top: 0px;
    border-top: 1px solid LightGray;
`

const TabContentWrapper = styled(Panels)`
    flex: 1;
    overflow: hidden;
`
const CaseButtonsWrapper = styled.div`
    align-items: flex-end;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    gap: 10px;
`

const ColumnWrapper = styled.div`
    display: flex;
    flex-direction: column;
`
const MoreButton = styled(Button)`
`
const RowWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px;
    
`
const MenuIcon = styled(Icon)`
    color: ${tokens.colors.text.static_icons__secondary.rgba};

`

const CaseView = () => {
    const {
        project, setProject,
        caseItem, setCase,
        topside, setTopside,
        topsideCost, setTopsideCost,
        surf, setSurf,
        surfCost, setSurfCost,
        substructure, setSubstructure,
        substructureCost, setSubstructureCost,
        transport, setTransport,
        transportCost, setTransportCost,
        opexSum, setOpexSum,
        cessationOffshoreFacilitiesCost, setCessationOffshoreFacilitiesCost,
        totalFeasibilityAndConceptStudies, setTotalFeasibilityAndConceptStudies,
        totalFEEDStudies, setTotalFEEDStudies,
        totalOtherStudies, setTotalOtherStudies,
        activeTab, setActiveTab,
        explorationWellCostProfile, setExplorationWellCostProfile,
        drillingCost, setDrillingCost,
        totalStudyCost, setTotalStudyCost,
        productionAndSalesVolume, setProductionAndSalesVolume,
        oilCondensateProduction, setOilCondensateProduction,
        nglProduction, setNGLProduction,
        netSalesGas, setNetSalesGas,
        cO2Emissions, setCO2Emissions,
        importedElectricity, setImportedElectricity,
        gAndGAdminCost, setGAndGAdminCost,
        setStartYear,
        setEndYear,
        tableYears, setTableYears,
        seismicAcquisitionAndProcessing, setSeismicAcquisitionAndProcessing,
        exploration, setExploration,
        wellProjects, setWellProject,
    } = useAppContext();

    const [editTechnicalInputModalIsOpen, setEditTechnicalInputModalIsOpen] = useState<boolean>(false)

    const { fusionContextId, caseId } = useParams<Record<string, string | undefined>>()
    const { currentContext } = useModuleCurrentContext()
    const [drainageStrategy, setDrainageStrategy] = useState<Components.Schemas.DrainageStrategyDto>()

    const [wells, setWells] = useState<Components.Schemas.WellDto[]>()
    const [wellProjectWells, setWellProjectWells] = useState<Components.Schemas.WellProjectWellDto[]>()
    const [explorationWells, setExplorationWells] = useState<Components.Schemas.ExplorationWellDto[]>()

    const [offshoreFacilitiesOperationsCostProfile,
        setOffshoreFacilitiesOperationsCostProfile] = useState<Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto>()

    const [wellInterventionCostProfile, setWellInterventionCostProfile] = useState<Components.Schemas.WellInterventionCostProfileDto>()

    const [historicCostCostProfile,
        setHistoricCostCostProfile] = useState<Components.Schemas.HistoricCostCostProfileDto>()

    const [additionalOPEXCostProfile,
        setAdditionalOPEXCostProfile] = useState<Components.Schemas.AdditionalOPEXCostProfileDto>()

    const [cessationWellsCost, setCessationWellsCost] = useState<Components.Schemas.CessationWellsCostDto>()



    const [fuelFlaringAndLosses, setFuelFlaringAndLosses] = useState<Components.Schemas.FuelFlaringAndLossesDto>()

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null)

    const navigate = useNavigate()
    const location = useLocation()

    const [isLoading, setIsLoading] = useState<boolean>()
    const [isSaving, setIsSaving] = useState<boolean>()
    const [updateFromServer, setUpdateFromServer] = useState<boolean>(true)
    const [nameEditMode, setNameEditMode] = useState<boolean>(false)
    const [updatedCaseName, setUpdatedCaseName] = useState<string>("")

    useEffect(() => {
        (async () => {
            try {
                setUpdateFromServer(true)
                setIsLoading(true)
                const projectId = unwrapProjectId(currentContext?.externalId)
                const projectResult = await (await GetProjectService()).getProject(projectId)
                setProject(projectResult) // should we be setting project here?
            } catch (error) {
                console.error(`[CaseView] Error while fetching project ${currentContext?.externalId}`, error)
            }
        })()
    }, [currentContext?.externalId, caseId, fusionContextId])

    useEffect(() => {
        if (caseItem && nameEditMode && updatedCaseName !== caseItem.name) {
            const updatedCase = { ...caseItem }
            updatedCase.name = updatedCaseName
            setCase(updatedCase)
        }
    }, [updatedCaseName])

    useEffect(() => {
        if (project && updateFromServer) {
            const caseResult = project.cases.find((o) => o.id === caseId)
            if (!caseResult) {
                if (location.pathname.indexOf("/case") > -1) {
                    const projectUrl = location.pathname.split("/case")[0]
                    navigate(projectUrl)
                }
            }
            setCase(caseResult)

            const drainageStrategyResult = project?.drainageStrategies
                .find((drain) => drain.id === caseResult?.drainageStrategyLink)
            setDrainageStrategy(
                drainageStrategyResult,
            )

            const explorationResult = project
                ?.explorations.find((exp) => exp.id === caseResult?.explorationLink)
            setExploration(explorationResult)

            const wellProjectResult = project
                ?.wellProjects.find((wp) => wp.id === caseResult?.wellProjectLink)
            setWellProject(wellProjectResult)

            const surfResult = project?.surfs.find((sur) => sur.id === caseResult?.surfLink)
            setSurf(surfResult)

            const topsideResult = project?.topsides.find((top) => top.id === caseResult?.topsideLink)
            setTopside(topsideResult)

            const substructureResult = project?.substructures.find((sub) => sub.id === caseResult?.substructureLink)
            setSubstructure(substructureResult)

            const transportResult = project?.transports.find((tran) => tran.id === caseResult?.transportLink)
            setTransport(transportResult)

            setWells(project.wells)

            setWellProjectWells(wellProjectResult?.wellProjectWells ?? [])

            setExplorationWells(explorationResult?.explorationWells ?? [])

            setUpdateFromServer(false)
            setIsLoading(false)
        } else if (project) {
            const caseResult = project.cases.find((o) => o.id === caseId)

            const surfResult = project.surfs.find((sur) => sur.id === caseResult?.surfLink)
            setSurf(surfResult)

            const topsideResult = project.topsides.find((top) => top.id === caseResult?.topsideLink)
            setTopside(topsideResult)

            const substructureResult = project.substructures.find((sub) => sub.id === caseResult?.substructureLink)
            setSubstructure(substructureResult)

            const transportResult = project.transports.find((tran) => tran.id === caseResult?.transportLink)
            setTransport(transportResult)

            setWells(project.wells)
        }
    }, [project])

    if (isLoading || !project || !caseItem
        || !drainageStrategy || !exploration
        || !wellProjects || !surf || !topside
        || !substructure || !transport
        || !explorationWells || !wellProjectWells) {
        return (
            <>
                <Progress.Circular size={16} color="primary" />
                <p>Loading case</p>
            </>
        )
    }

    const handleSave = async () => {
        const dto: Components.Schemas.CaseWithAssetsWrapperDto = {
            caseDto: caseItem,
            drainageStrategyDto: drainageStrategy,
            wellProjectDto: wellProjects,
            explorationDto: exploration,
            surfDto: surf,
            substructureDto: substructure,
            transportDto: transport,
            topsideDto: topside,
            explorationWellDto: explorationWells,
            wellProjectWellDtos: wellProjectWells,
        }

        setIsSaving(true)
        setUpdateFromServer(true)

        try {
            const result = await (await GetCaseWithAssetsService()).update(project.id, caseId!, dto)
            const projectResult = { ...result.projectDto }
            setProject(projectResult)
            if (result.generatedProfilesDto?.studyCostProfileWrapperDto !== null && result.generatedProfilesDto?.studyCostProfileWrapperDto !== undefined) {
                setTotalFeasibilityAndConceptStudies(result.generatedProfilesDto.studyCostProfileWrapperDto.totalFeasibilityAndConceptStudiesDto)
                setTotalFEEDStudies(result.generatedProfilesDto.studyCostProfileWrapperDto.totalFEEDStudiesDto)
            }
            if (result.generatedProfilesDto?.opexCostProfileWrapperDto !== null && result.generatedProfilesDto?.opexCostProfileWrapperDto !== undefined) {
                setOffshoreFacilitiesOperationsCostProfile(result.generatedProfilesDto.opexCostProfileWrapperDto?.offshoreFacilitiesOperationsCostProfileDto)
                setWellInterventionCostProfile(result.generatedProfilesDto.opexCostProfileWrapperDto?.wellInterventionCostProfileDto)
            }
            if (result.generatedProfilesDto?.cessationCostWrapperDto !== null && result.generatedProfilesDto?.cessationCostWrapperDto !== undefined) {
                setCessationWellsCost(result.generatedProfilesDto.cessationCostWrapperDto.cessationWellsCostDto)
                setCessationOffshoreFacilitiesCost(result.generatedProfilesDto.cessationCostWrapperDto.cessationOffshoreFacilitiesCostDto)
            }
            if (result.generatedProfilesDto?.gAndGAdminCostDto !== null && result.generatedProfilesDto?.gAndGAdminCostDto !== undefined) {
                setGAndGAdminCost(result.generatedProfilesDto.gAndGAdminCostDto)
            }
            if (result.generatedProfilesDto?.seismicAcquisitionAndProcessingDto !== null && result.generatedProfilesDto?.seismicAcquisitionAndProcessingDto !== undefined) {
                setSeismicAcquisitionAndProcessing(result.generatedProfilesDto.seismicAcquisitionAndProcessingDto)
            }
            if (result.generatedProfilesDto?.co2EmissionsDto !== null && result.generatedProfilesDto?.co2EmissionsDto !== undefined) {
                setCO2Emissions(result.generatedProfilesDto.co2EmissionsDto)
            }
            if (result.generatedProfilesDto?.fuelFlaringAndLossesDto !== null && result.generatedProfilesDto?.fuelFlaringAndLossesDto !== undefined) {
                setFuelFlaringAndLosses(result.generatedProfilesDto.fuelFlaringAndLossesDto)
            }
            if (result.generatedProfilesDto?.netSalesGasDto !== null && result.generatedProfilesDto?.netSalesGasDto !== undefined) {
                setNetSalesGas(result.generatedProfilesDto.netSalesGasDto)
            }
            if (result.generatedProfilesDto?.importedElectricityDto !== null && result.generatedProfilesDto?.importedElectricityDto !== undefined) {
                setImportedElectricity(result.generatedProfilesDto.importedElectricityDto)
            }
            const setIfNotNull = (data: any, setState: any) => {
                if (data !== null && data !== undefined) { setState(data) }
            }
            setIfNotNull(result.generatedProfilesDto?.studyCostProfileWrapperDto?.totalFeasibilityAndConceptStudiesDto, setTotalFeasibilityAndConceptStudies)
            setIfNotNull(result.generatedProfilesDto?.studyCostProfileWrapperDto?.totalFEEDStudiesDto, setTotalFEEDStudies)
            setIfNotNull(result.generatedProfilesDto?.studyCostProfileWrapperDto?.totalOtherStudiesDto, setTotalOtherStudies)
            setIfNotNull(result.generatedProfilesDto?.opexCostProfileWrapperDto?.offshoreFacilitiesOperationsCostProfileDto, setOffshoreFacilitiesOperationsCostProfile)
            setIfNotNull(result.generatedProfilesDto?.opexCostProfileWrapperDto?.wellInterventionCostProfileDto, setWellInterventionCostProfile)
            setIfNotNull(result.generatedProfilesDto?.opexCostProfileWrapperDto?.historicCostCostProfileDto, setHistoricCostCostProfile)
            setIfNotNull(result.generatedProfilesDto?.opexCostProfileWrapperDto?.additionalOPEXCostProfileDto, setAdditionalOPEXCostProfile)
            setIfNotNull(result.generatedProfilesDto?.cessationCostWrapperDto?.cessationWellsCostDto, setCessationWellsCost)
            setIfNotNull(result.generatedProfilesDto?.cessationCostWrapperDto?.cessationOffshoreFacilitiesCostDto, setCessationOffshoreFacilitiesCost)
            setIfNotNull(result.generatedProfilesDto?.gAndGAdminCostDto, setGAndGAdminCost)
            setIfNotNull(result.generatedProfilesDto?.co2EmissionsDto, setCO2Emissions)
            setIfNotNull(result.generatedProfilesDto?.fuelFlaringAndLossesDto, setFuelFlaringAndLosses)
            setIfNotNull(result.generatedProfilesDto?.netSalesGasDto, setNetSalesGas)
            setIfNotNull(result.generatedProfilesDto?.importedElectricityDto, setImportedElectricity)
            setIfNotNull(result.generatedProfilesDto?.seismicAcquisitionAndProcessingDto, setSeismicAcquisitionAndProcessing)

            setIsSaving(false)
            setNameEditMode(false)
        } catch (e) {
            setIsSaving(false)
            setNameEditMode(false)
            console.error("Error when saving case and assets: ", e)
        }
    }

    return (
        <Wrapper>
            <HeaderWrapper>
                <RowWrapper>
                    <Button
                        onClick={() => navigate(projectPath(currentContext?.id!))}
                        variant="ghost_icon"
                    >
                        <Icon data={arrow_back} />
                    </Button>
                    {
                        nameEditMode
                            ? (

                                <PageTitle>
                                    <input
                                        type="text"
                                        defaultValue={caseItem.name}
                                        onChange={(e) => setUpdatedCaseName(e.target.value)}
                                    />
                                </PageTitle>

                            )
                            : (
                                <PageTitle>
                                    <Typography variant="h4">
                                        {caseItem.name}
                                    </Typography>
                                </PageTitle>
                            )
                    }
                    <ColumnWrapper>
                        <CaseButtonsWrapper>
                            {!isSaving ? <Button onClick={handleSave}>Save case</Button> : (
                                <Button>
                                    <Progress.Dots />
                                </Button>
                            )}
                            <Button
                                onClick={() => setEditTechnicalInputModalIsOpen(true)}
                                variant="outlined"
                            >
                                Edit technical input
                            </Button>
                            <MoreButton
                                variant="ghost_icon"
                                aria-label="case menu"
                                ref={setMenuAnchorEl}
                                onClick={() => (isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true))}
                            >
                                <Icon data={more_vertical} />
                            </MoreButton>
                        </CaseButtonsWrapper>
                    </ColumnWrapper>
                </RowWrapper>
                <CaseDropMenu
                    setNameEditMode={setNameEditMode}
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                    menuAnchorEl={menuAnchorEl}
                    caseItem={caseItem}
                />
            </HeaderWrapper>
            <StyledTabs activeTab={activeTab} onChange={setActiveTab} scrollable>
                <StyledList>
                    <Tab>Description</Tab>
                    <Tab>Production Profiles</Tab>
                    <Tab>Schedule</Tab>
                    <Tab>Drilling Schedule</Tab>
                    <Tab>Facilities</Tab>
                    <Tab>Cost</Tab>
                    <Tab>CO2 Emissions</Tab>
                    <Tab>Summary</Tab>
                </StyledList>
                <TabContentWrapper>
                    <StyledTabPanel>
                        <CaseDescriptionTab
                            caseItem={caseItem}
                            setCase={setCase}
                            activeTab={activeTab}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseProductionProfilesTab
                            project={project}
                            caseItem={caseItem}
                            setCase={setCase}
                            drainageStrategy={drainageStrategy}
                            setDrainageStrategy={setDrainageStrategy}
                            activeTab={activeTab}
                            fuelFlaringAndLosses={fuelFlaringAndLosses}
                            setFuelFlaringAndLosses={setFuelFlaringAndLosses}
                            netSalesGas={netSalesGas}
                            setNetSalesGas={setNetSalesGas}
                            importedElectricity={importedElectricity}
                            setImportedElectricity={setImportedElectricity}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseScheduleTab
                            caseItem={{ ...caseItem }}
                            setCase={setCase}
                            activeTab={activeTab}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseDrillingScheduleTab
                            project={project}
                            caseItem={caseItem}
                            explorationWells={explorationWells}
                            setExplorationWells={setExplorationWells}
                            wellProjectWells={wellProjectWells}
                            setWellProjectWells={setWellProjectWells}
                            wells={wells}
                            activeTab={activeTab}
                            exploration={exploration}
                            wellProject={wellProjects}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseFacilitiesTab
                            project={project}
                            caseItem={caseItem}
                            setCase={setCase}
                            topside={topside}
                            setTopside={setTopside}
                            surf={surf}
                            setSurf={setSurf}
                            substructure={substructure}
                            setSubstrucutre={setSubstructure}
                            transport={transport}
                            setTransport={setTransport}
                            activeTab={activeTab}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseCostTab
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseCO2Tab
                            project={project}
                            caseItem={caseItem}
                            activeTab={activeTab}
                            topside={topside}
                            setTopside={setTopside}
                            drainageStrategy={drainageStrategy}
                            setDrainageStrategy={setDrainageStrategy}
                            co2Emissions={cO2Emissions}
                            setCo2Emissions={setCO2Emissions}
                        />
                    </StyledTabPanel>
                    <StyledTabPanel>
                        <CaseSummaryTab

                        />
                    </StyledTabPanel>
                </TabContentWrapper>
            </StyledTabs>
        </Wrapper>
    )
}

export default CaseView
