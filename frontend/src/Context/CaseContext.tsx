import {
    FC,
    Dispatch,
    SetStateAction,
    createContext,
    useState,
    ReactNode,
    useContext,
    useMemo,
    useEffect,
} from "react"
import { useAppContext } from "./AppContext"
import { ITimeSeries } from "../Models/ITimeSeries"

interface CaseContextType {
    projectCase: Components.Schemas.CaseDto | undefined;
    setProjectCase: Dispatch<SetStateAction<Components.Schemas.CaseDto | undefined>>,
    renameProjectCase: boolean,
    setRenameProjectCase: Dispatch<SetStateAction<boolean>>,
    projectCaseEdited: Components.Schemas.CaseDto | undefined;
    setProjectCaseEdited: Dispatch<SetStateAction<Components.Schemas.CaseDto | undefined>>,
    saveProjectCase: boolean,
    setSaveProjectCase: Dispatch<SetStateAction<boolean>>,
    projectCaseNew: Components.Schemas.CreateCaseDto | undefined;
    setProjectCaseNew: Dispatch<SetStateAction<Components.Schemas.CreateCaseDto | undefined>>,
    activeTabCase: number;
    setActiveTabCase: Dispatch<SetStateAction<number>>,

    // OPEX
    totalStudyCost: ITimeSeries | undefined
    setTotalStudyCost: Dispatch<SetStateAction<ITimeSeries | undefined>>
    opexSum: Components.Schemas.OpexCostProfileDto | undefined
    setOpexSum: Dispatch<SetStateAction<Components.Schemas.OpexCostProfileDto | undefined>>
    // cessationCost: Components.Schemas.SurfCessationCostProfileDto | undefined
    // setCessationCost: Dispatch<SetStateAction<Components.Schemas.SurfCessationCostProfileDto | undefined>>
    offshoreFacilitiesOperationsCostProfile: Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto | undefined
    setOffshoreFacilitiesOperationsCostProfile: Dispatch<SetStateAction<Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto | undefined>>
    wellInterventionCostProfile: Components.Schemas.WellInterventionCostProfileDto | undefined
    setWellInterventionCostProfile: Dispatch<SetStateAction<Components.Schemas.WellInterventionCostProfileDto | undefined>>

    // CAPEX
    topside: Components.Schemas.TopsideDto | undefined
    setTopside: Dispatch<SetStateAction<Components.Schemas.TopsideDto | undefined>>
    topsideCost: Components.Schemas.TopsideCostProfileDto | undefined
    setTopsideCost: Dispatch<SetStateAction<Components.Schemas.TopsideCostProfileDto | undefined>>
    surf: Components.Schemas.SurfDto | undefined
    setSurf: Dispatch<SetStateAction<Components.Schemas.SurfDto | undefined>>
    surfCost: Components.Schemas.SurfCostProfileDto | undefined
    setSurfCost: Dispatch<SetStateAction<Components.Schemas.SurfCostProfileDto | undefined>>
    substructure: Components.Schemas.SubstructureDto | undefined
    setSubstructure: Dispatch<SetStateAction<Components.Schemas.SubstructureDto | undefined>>
    substructureCost: Components.Schemas.SubstructureCostProfileDto | undefined
    setSubstructureCost: Dispatch<SetStateAction<Components.Schemas.SubstructureCostProfileDto | undefined>>
    transport: Components.Schemas.TransportDto | undefined
    setTransport: Dispatch<SetStateAction<Components.Schemas.TransportDto | undefined>>
    transportCost: Components.Schemas.TransportCostProfileDto | undefined
    setTransportCost: Dispatch<SetStateAction<Components.Schemas.TransportCostProfileDto | undefined>>
    setStartYear: Dispatch<SetStateAction<number>>
    setEndYear: Dispatch<SetStateAction<number>>
    tableYears: [number, number]
    setTableYears: Dispatch<SetStateAction<[number, number]>>
    cessationOffshoreFacilitiesCost: Components.Schemas.CessationOffshoreFacilitiesCostDto | undefined
    setCessationOffshoreFacilitiesCost: Dispatch<SetStateAction<Components.Schemas.CessationOffshoreFacilitiesCostDto | undefined>>

    exploration: Components.Schemas.ExplorationDto | undefined,
    setExploration: Dispatch<SetStateAction<Components.Schemas.ExplorationDto | undefined>>,
    totalExplorationCost: ITimeSeries | undefined,
    setTotalExplorationCost: Dispatch<SetStateAction<ITimeSeries | undefined>>,
    gAndGAdminCost: Components.Schemas.GAndGAdminCostDto | undefined
    setGAndGAdminCost: Dispatch<SetStateAction<Components.Schemas.GAndGAdminCostDto | undefined>>
    seismicAcqAndProcCost: Components.Schemas.SeismicAcquisitionAndProcessingDto | undefined
    setSeismicAcqAndProcCost: Dispatch<SetStateAction<Components.Schemas.SeismicAcquisitionAndProcessingDto | undefined>>
    countryOfficeCost: Components.Schemas.CountryOfficeCostDto | undefined
    setCountryOfficeCost: Dispatch<SetStateAction<Components.Schemas.CountryOfficeCostDto | undefined>>
    explorationWellCostProfile: Components.Schemas.ExplorationWellCostProfileDto | undefined
    setExplorationWellCostProfile: Dispatch<SetStateAction<Components.Schemas.ExplorationWellCostProfileDto | undefined>>
    explorationAppraisalWellCost: Components.Schemas.AppraisalWellCostProfileDto | undefined
    setExplorationAppraisalWellCost: Dispatch<SetStateAction<Components.Schemas.AppraisalWellCostProfileDto | undefined>>
    explorationSidetrackCost: Components.Schemas.SidetrackCostProfileDto | undefined
    setExplorationSidetrackCost: Dispatch<SetStateAction<Components.Schemas.SidetrackCostProfileDto | undefined>>

    totalFeasibilityAndConceptStudies: Components.Schemas.TotalFeasibilityAndConceptStudiesDto | undefined
    setTotalFeasibilityAndConceptStudies: Dispatch<SetStateAction<Components.Schemas.TotalFeasibilityAndConceptStudiesDto | undefined>>
    totalFeasibilityAndConceptStudiesOverride: Components.Schemas.TotalFeasibilityAndConceptStudiesOverrideDto | undefined
    setTotalFeasibilityAndConceptStudiesOverride: Dispatch<SetStateAction<Components.Schemas.TotalFeasibilityAndConceptStudiesOverrideDto | undefined>>

    totalFEEDStudies: Components.Schemas.TotalFEEDStudiesDto | undefined
    setTotalFEEDStudies: Dispatch<SetStateAction<Components.Schemas.TotalFEEDStudiesDto | undefined>>
    totalFEEDStudiesOverride: Components.Schemas.TotalFEEDStudiesOverrideDto | undefined
    setTotalFEEDStudiesOverride: Dispatch<SetStateAction<Components.Schemas.TotalFEEDStudiesOverrideDto | undefined>>

    totalOtherStudies: Components.Schemas.TotalOtherStudiesDto | undefined,
    setTotalOtherStudies: Dispatch<SetStateAction<Components.Schemas.TotalOtherStudiesDto | undefined>>
    historicCostCostProfile: Components.Schemas.HistoricCostCostProfileDto | undefined,
    setHistoricCostCostProfile: Dispatch<SetStateAction<Components.Schemas.HistoricCostCostProfileDto | undefined>>
    additionalOPEXCostProfile: Components.Schemas.AdditionalOPEXCostProfileDto | undefined,
    setAdditionalOPEXCostProfile: Dispatch<SetStateAction<Components.Schemas.AdditionalOPEXCostProfileDto | undefined>>

    productionAndSalesVolume: Components.Schemas.ProductionAndSalesVolumesDto | undefined
    setProductionAndSalesVolume: Dispatch<SetStateAction<Components.Schemas.ProductionAndSalesVolumesDto | undefined>>
    oilCondensateProduction: Components.Schemas.ProductionProfileOilDto | undefined
    setOilCondensateProduction: Dispatch<SetStateAction<Components.Schemas.ProductionProfileOilDto | undefined>>
    nglProduction: Components.Schemas.ProductionProfileNGLDto | undefined
    setNGLProduction: Dispatch<SetStateAction<Components.Schemas.ProductionProfileNGLDto | undefined>>
    netSalesGas: Components.Schemas.NetSalesGasDto | undefined
    setNetSalesGas: Dispatch<SetStateAction<Components.Schemas.NetSalesGasDto | undefined>>
    cO2Emissions: Components.Schemas.Co2EmissionsDto | undefined
    setCO2Emissions: Dispatch<SetStateAction<Components.Schemas.Co2EmissionsDto | undefined>>
    importedElectricity: Components.Schemas.ImportedElectricityDto | undefined
    setImportedElectricity: Dispatch<SetStateAction<Components.Schemas.ImportedElectricityDto | undefined>>

    // wellProjects: Components.Schemas.WellProjectDto | undefined
    // setWellProject: Dispatch<SetStateAction<Components.Schemas.WellProjectDto | undefined>>
    wellProjectOilProducerCost: Components.Schemas.OilProducerCostProfileDto | undefined
    setWellProjectOilProducerCost: Dispatch<SetStateAction<Components.Schemas.OilProducerCostProfileDto | undefined>>
}

const CaseContext = createContext<CaseContextType | undefined>(undefined)

const CaseContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { editMode, setEditMode } = useAppContext()
    const [projectCase, setProjectCase] = useState<Components.Schemas.CaseDto | undefined>()
    const [renameProjectCase, setRenameProjectCase] = useState<boolean>(false)
    const [projectCaseEdited, setProjectCaseEdited] = useState<Components.Schemas.CaseDto | undefined>()
    const [saveProjectCase, setSaveProjectCase] = useState<boolean>(false)
    const [projectCaseNew, setProjectCaseNew] = useState<Components.Schemas.CreateCaseDto | undefined>()
    const [activeTabCase, setActiveTabCase] = useState<number>(0)
    const [topside, setTopside] = useState<Components.Schemas.TopsideDto | undefined>()
    const [topsideCost, setTopsideCost] = useState<Components.Schemas.TopsideCostProfileDto | undefined>()
    const [surf, setSurf] = useState<Components.Schemas.SurfDto>()
    const [surfCost, setSurfCost] = useState<Components.Schemas.SurfCostProfileDto | undefined>()
    const [substructure, setSubstructure] = useState<Components.Schemas.SubstructureDto>()
    const [substructureCost, setSubstructureCost] = useState<Components.Schemas.SubstructureCostProfileDto | undefined>()
    const [transport, setTransport] = useState<Components.Schemas.TransportDto>()
    const [transportCost, setTransportCost] = useState<Components.Schemas.TransportCostProfileDto | undefined>()

    const [startYear, setStartYear] = useState<number>(2020)
    const [endYear, setEndYear] = useState<number>(2030)
    const [tableYears, setTableYears] = useState<[number, number]>([2020, 2030])
    const [totalStudyCost, setTotalStudyCost] = useState<ITimeSeries | undefined>()
    const [opexSum, setOpexSum] = useState<Components.Schemas.OpexCostProfileDto | undefined>()
    const [exploration, setExploration] = useState<Components.Schemas.ExplorationDto | undefined>()

    const [totalFeasibilityAndConceptStudies, setTotalFeasibilityAndConceptStudies] = useState<Components.Schemas.TotalFeasibilityAndConceptStudiesDto | undefined>()
    const [totalFeasibilityAndConceptStudiesOverride, setTotalFeasibilityAndConceptStudiesOverride] = useState<Components.Schemas.TotalFeasibilityAndConceptStudiesOverrideDto | undefined>()

    const [totalFEEDStudies, setTotalFEEDStudies] = useState<Components.Schemas.TotalFEEDStudiesDto | undefined>()
    const [totalFEEDStudiesOverride, setTotalFEEDStudiesOverride] = useState<Components.Schemas.TotalFEEDStudiesOverrideDto | undefined>()
    const [totalOtherStudies, setTotalOtherStudies] = useState<Components.Schemas.TotalOtherStudiesDto | undefined>()
    const [historicCostCostProfile, setHistoricCostCostProfile] = useState<Components.Schemas.HistoricCostCostProfileDto | undefined>()
    const [additionalOPEXCostProfile, setAdditionalOPEXCostProfile] = useState<Components.Schemas.AdditionalOPEXCostProfileDto | undefined>()
    const [offshoreFacilitiesOperationsCostProfile, setOffshoreFacilitiesOperationsCostProfile] = useState<Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto | undefined>()
    const [wellInterventionCostProfile, setWellInterventionCostProfile] = useState<Components.Schemas.WellInterventionCostProfileDto | undefined>()

    const [productionAndSalesVolume, setProductionAndSalesVolume] = useState<Components.Schemas.ProductionAndSalesVolumesDto | undefined>()
    const [oilCondensateProduction, setOilCondensateProduction] = useState<Components.Schemas.ProductionProfileOilDto | undefined>()
    const [nglProduction, setNGLProduction] = useState<Components.Schemas.ProductionProfileNGLDto | undefined>()
    const [netSalesGas, setNetSalesGas] = useState<Components.Schemas.NetSalesGasDto | undefined>()
    const [cO2Emissions, setCO2Emissions] = useState<Components.Schemas.Co2EmissionsDto | undefined>()
    const [importedElectricity, setImportedElectricity] = useState<Components.Schemas.ImportedElectricityDto | undefined>()
    const [cessationOffshoreFacilitiesCost, setCessationOffshoreFacilitiesCost] = useState<Components.Schemas.CessationOffshoreFacilitiesCostDto>()
    const [totalExplorationCost, setTotalExplorationCost] = useState<ITimeSeries | undefined>()
    const [explorationWellCostProfile, setExplorationWellCostProfile] = useState<Components.Schemas.ExplorationWellCostProfileDto>()
    const [gAndGAdminCost, setGAndGAdminCost] = useState<Components.Schemas.GAndGAdminCostDto>()
    const [countryOfficeCost, setCountryOfficeCost] = useState<Components.Schemas.CountryOfficeCostDto>()
    const [explorationAppraisalWellCost, setExplorationAppraisalWellCost] = useState<Components.Schemas.AppraisalWellCostProfileDto>()
    const [explorationSidetrackCost, setExplorationSidetrackCost] = useState<Components.Schemas.SidetrackCostProfileDto>()
    const [seismicAcqAndProcCost, setSeismicAcqAndProcCost] = useState<Components.Schemas.SeismicAcquisitionAndProcessingDto>()
    const [wellProjectOilProducerCost, setWellProjectOilProducerCost] = useState<Components.Schemas.OilProducerCostProfileDto | undefined>()

    const value = useMemo(() => ({
        projectCase,
        setProjectCase,
        renameProjectCase,
        setRenameProjectCase,
        projectCaseEdited,
        setProjectCaseEdited,
        saveProjectCase,
        setSaveProjectCase,
        projectCaseNew,
        setProjectCaseNew,
        activeTabCase,
        setActiveTabCase,
        totalStudyCost,
        setTotalStudyCost,
        opexSum,
        setOpexSum,
        cessationOffshoreFacilitiesCost,
        setCessationOffshoreFacilitiesCost,
        topside,
        setTopside,
        topsideCost,
        setTopsideCost,
        surf,
        setSurf,
        surfCost,
        setSurfCost,
        substructure,
        setSubstructure,
        substructureCost,
        setSubstructureCost,
        transport,
        setTransport,
        transportCost,
        setTransportCost,
        startYear,
        setStartYear,
        endYear,
        setEndYear,
        tableYears,
        setTableYears,
        totalFeasibilityAndConceptStudies,
        setTotalFeasibilityAndConceptStudies,
        totalFeasibilityAndConceptStudiesOverride,
        setTotalFeasibilityAndConceptStudiesOverride,
        totalFEEDStudies,
        setTotalFEEDStudies,
        totalFEEDStudiesOverride,
        setTotalFEEDStudiesOverride,
        totalOtherStudies,
        setTotalOtherStudies,
        historicCostCostProfile,
        setHistoricCostCostProfile,
        additionalOPEXCostProfile,
        setAdditionalOPEXCostProfile,
        offshoreFacilitiesOperationsCostProfile,
        setOffshoreFacilitiesOperationsCostProfile,
        wellInterventionCostProfile,
        setWellInterventionCostProfile,
        productionAndSalesVolume,
        setProductionAndSalesVolume,
        oilCondensateProduction,
        setOilCondensateProduction,
        nglProduction,
        setNGLProduction,
        netSalesGas,
        setNetSalesGas,
        cO2Emissions,
        setCO2Emissions,
        importedElectricity,
        setImportedElectricity,
        exploration,
        setExploration,
        totalExplorationCost,
        setTotalExplorationCost,
        explorationWellCostProfile,
        setExplorationWellCostProfile,
        gAndGAdminCost,
        setGAndGAdminCost,
        seismicAcqAndProcCost,
        setSeismicAcqAndProcCost,
        explorationSidetrackCost,
        setExplorationSidetrackCost,
        explorationAppraisalWellCost,
        setExplorationAppraisalWellCost,
        countryOfficeCost,
        setCountryOfficeCost,
        wellProjectOilProducerCost,
        setWellProjectOilProducerCost,
    }), [
        projectCase,
        setProjectCase,
        renameProjectCase,
        setRenameProjectCase,
        projectCaseEdited,
        setProjectCaseEdited,
        saveProjectCase,
        setSaveProjectCase,
        projectCaseNew,
        setProjectCaseNew,
        activeTabCase,
        setActiveTabCase,
        totalStudyCost,
        opexSum,
        cessationOffshoreFacilitiesCost,
        topside,
        topsideCost,
        surf,
        surfCost,
        substructure,
        substructureCost,
        transport,
        transportCost,
        tableYears,
        totalFeasibilityAndConceptStudies,
        totalFeasibilityAndConceptStudiesOverride,
        totalFEEDStudies,
        totalFEEDStudiesOverride,
        totalOtherStudies,
        additionalOPEXCostProfile,
        offshoreFacilitiesOperationsCostProfile,
        wellInterventionCostProfile,
        historicCostCostProfile,
        productionAndSalesVolume,
        oilCondensateProduction,
        nglProduction,
        netSalesGas,
        cO2Emissions,
        importedElectricity,
        exploration,
        totalExplorationCost,
        explorationWellCostProfile,
        gAndGAdminCost,
        countryOfficeCost,
        explorationAppraisalWellCost,
        explorationSidetrackCost,
        seismicAcqAndProcCost,
        wellProjectOilProducerCost,
    ])

    useEffect(() => {
        if (editMode && projectCase && !projectCaseEdited) {
            setProjectCaseEdited(projectCase)
            setRenameProjectCase(editMode)
        }
    }, [editMode, projectCaseEdited])

    return (
        <CaseContext.Provider value={value}>
            {children}
        </CaseContext.Provider>
    )
}

export const useCaseContext = (): CaseContextType => {
    const context = useContext(CaseContext)
    if (context === undefined) {
        throw new Error("useCaseContext must be used within an CaseContextProvider")
    }
    return context
}

export { CaseContextProvider }
