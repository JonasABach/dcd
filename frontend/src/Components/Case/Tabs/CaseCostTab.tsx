import {
    ChangeEventHandler, Dispatch, SetStateAction, useEffect, useRef, useState,
} from "react"
import styled from "styled-components"

import {
    Button, NativeSelect, Typography,
} from "@equinor/eds-core-react"
import CaseNumberInput from "../../Input/CaseNumberInput"
import CaseTabTable from "../Components/CaseTabTable"
import { SetTableYearsFromProfiles } from "../Components/CaseTabTableHelper"
import { ITimeSeries } from "../../../Models/ITimeSeries"
import { ITimeSeriesCostOverride } from "../../../Models/ITimeSeriesCostOverride"
import { ITimeSeriesCost } from "../../../Models/ITimeSeriesCost"
import FilterContainer from "../../Input/Containers/TableFilterContainer"
import InputContainer from "../../Input/Containers/InputContainer"
import InputSwitcher from "../../Input/InputSwitcher"
import { useAppContext } from "../../../Context/AppContext"
const TopWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    margin-bottom: 20px;
`
const PageTitle = styled(Typography)`
    flex-grow: 1;
`

const TableWrapper = styled.div`
    margin-bottom: 50px;
`
const CaseCostTab = (): React.ReactElement | null => {
    const {
        project,
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
        historicCostCostProfile, setHistoricCostCostProfile,
        additionalOPEXCostProfile, setAdditionalOPEXCostProfile,
        activeTab, setActiveTab,
        exploration, setExploration,
        drillingCost, setDrillingCost,
        totalStudyCost, setTotalStudyCost,
        productionAndSalesVolume, setProductionAndSalesVolume,
        oilCondensateProduction, setOilCondensateProduction,
        nglProduction, setNGLProduction,
        NetSalesGas, setNetSalesGas,
        cO2Emissions, setCO2Emissions,
        importedElectricity, setImportedElectricity,
        setStartYear,
        setEndYear,
        tableYears, setTableYears,
        explorationWellCost, setExplorationWellCost
    } = useAppContext();


    const [wellProject, setWellProject] = useState<Components.Schemas.WellProjectDto>();

    const [offshoreFacilitiesOperationsCostProfile, setOffshoreFacilitiesOperationsCostProfile] = useState<Components.Schemas.OffshoreFacilitiesOperationsCostProfileDto>();

    const [wellInterventionCostProfile, setWellInterventionCostProfile] = useState<Components.Schemas.WellInterventionCostProfileDto>();

    const [cessationWellsCost, setCessationWellsCost] = useState<Components.Schemas.CessationWellsCostDto>();

    const [gAndGAdminCost, setGAndGAdminCost] = useState<Components.Schemas.GAndGAdminCostDto>();


    // OPEX
    const [totalFeasibilityAndConceptStudiesOverride,
        setTotalFeasibilityAndConceptStudiesOverride] = useState<Components.Schemas.TotalFeasibilityAndConceptStudiesOverrideDto>()
    const [totalFEEDStudiesOverride, setTotalFEEDStudiesOverride] = useState<Components.Schemas.TotalFEEDStudiesOverrideDto>()

    const [offshoreFacilitiesOperationsCostProfileOverride,
        setOffshoreFacilitiesOperationsCostProfileOverride] = useState<Components.Schemas.OffshoreFacilitiesOperationsCostProfileOverrideDto>()
    const [wellInterventionCostProfileOverride, setWellInterventionCostProfileOverride] = useState<Components.Schemas.WellInterventionCostProfileOverrideDto>()

    const [cessationWellsCostOverride, setCessationWellsCostOverride] = useState<Components.Schemas.CessationWellsCostOverrideDto>()
    const [cessationOffshoreFacilitiesCostOverride,
        setCessationOffshoreFacilitiesCostOverride] = useState<Components.Schemas.CessationOffshoreFacilitiesCostOverrideDto>()

    // CAPEX
    const [topsideCostOverride, setTopsideCostOverride] = useState<Components.Schemas.TopsideCostProfileOverrideDto>()
    const [surfCostOverride, setSurfCostOverride] = useState<Components.Schemas.SurfCostProfileOverrideDto>()
    const [substructureCostOverride, setSubstructureCostOverride] = useState<Components.Schemas.SubstructureCostProfileOverrideDto>()
    const [transportCostOverride, setTransportCostOverride] = useState<Components.Schemas.TransportCostProfileOverrideDto>()

    // Development
    const [wellProjectOilProducerCost, setWellProjectOilProducerCost] = useState<Components.Schemas.OilProducerCostProfileDto>()
    const [wellProjectOilProducerCostOverride,
        setWellProjectOilProducerCostOverride] = useState<Components.Schemas.OilProducerCostProfileOverrideDto>()

    const [wellProjectGasProducerCost, setWellProjectGasProducerCost] = useState<Components.Schemas.GasProducerCostProfileDto>()
    const [wellProjectGasProducerCostOverride,
        setWellProjectGasProducerCostOverride] = useState<Components.Schemas.GasProducerCostProfileOverrideDto>()

    const [wellProjectWaterInjectorCost, setWellProjectWaterInjectorCost] = useState<Components.Schemas.WaterInjectorCostProfileDto>()
    const [wellProjectWaterInjectorCostOverride,
        setWellProjectWaterInjectorCostOverride] = useState<Components.Schemas.WaterInjectorCostProfileOverrideDto>()

    const [wellProjectGasInjectorCost, setWellProjectGasInjectorCost] = useState<Components.Schemas.GasInjectorCostProfileDto>()
    const [wellProjectGasInjectorCostOverride,
        setWellProjectGasInjectorCostOverride] = useState<Components.Schemas.GasInjectorCostProfileOverrideDto>()

    // Exploration
    const [explorationAppraisalWellCost, setExplorationAppraisalWellCost] = useState<Components.Schemas.AppraisalWellCostProfileDto>()
    const [explorationSidetrackCost, setExplorationSidetrackCost] = useState<Components.Schemas.SidetrackCostProfileDto>()
    const [seismicAcqAndProcCost, setSeismicAcqAndProcCost] = useState<Components.Schemas.SeismicAcquisitionAndProcessingDto>()
    const [countryOfficeCost, setCountryOfficeCost] = useState<Components.Schemas.CountryOfficeCostDto>()

    const [startYear] = useState<number>(2020)
    const [endYear] = useState<number>(2030)

    const studyGridRef = useRef<any>(null)
    const opexGridRef = useRef<any>(null)
    const cessationGridRef = useRef<any>(null)
    const capexGridRef = useRef<any>(null)
    const developmentWellsGridRef = useRef<any>(null)
    const explorationWellsGridRef = useRef<any>(null)

    useEffect(() => {
        (async () => {
            try {
                if (caseItem && project && topside && surf && substructure && transport) //test if this work, if not break into smaller ifs
                    if (activeTab === 5) {
                        const totalFeasibility = caseItem.totalFeasibilityAndConceptStudies
                        const totalFEED = caseItem.totalFEEDStudies
                        const totalOtherStudiesLocal = caseItem.totalOtherStudies

                        setTotalFeasibilityAndConceptStudies(totalFeasibility)
                        setTotalFeasibilityAndConceptStudiesOverride(caseItem.totalFeasibilityAndConceptStudiesOverride)
                        setTotalFEEDStudies(totalFEED)
                        setTotalFEEDStudiesOverride(caseItem.totalFEEDStudiesOverride)
                        setTotalOtherStudies(totalOtherStudiesLocal)

                        const wellIntervention = wellInterventionCostProfile
                        const offshoreFacilitiesOperations = caseItem.offshoreFacilitiesOperationsCostProfile
                        const historicCostCostProfileLocal = caseItem.historicCostCostProfile
                        const additionalOPEXCostProfileLocal = caseItem.additionalOPEXCostProfile

                        setWellInterventionCostProfile(wellIntervention)
                        setWellInterventionCostProfileOverride(caseItem.wellInterventionCostProfileOverride)
                        setOffshoreFacilitiesOperationsCostProfile(offshoreFacilitiesOperations)
                        setOffshoreFacilitiesOperationsCostProfileOverride(caseItem.offshoreFacilitiesOperationsCostProfileOverride)
                        setHistoricCostCostProfile(historicCostCostProfileLocal)
                        setAdditionalOPEXCostProfile(additionalOPEXCostProfileLocal)

                        const cessationWells = caseItem.cessationWellsCost
                        const cessationOffshoreFacilities = caseItem.cessationOffshoreFacilitiesCost

                        setCessationWellsCost(cessationWells)
                        setCessationWellsCostOverride(caseItem.cessationWellsCostOverride)
                        setCessationOffshoreFacilitiesCost(cessationOffshoreFacilities)
                        setCessationOffshoreFacilitiesCostOverride(caseItem.cessationOffshoreFacilitiesCostOverride)

                        // CAPEX
                        const topsideCostProfile = topside.costProfile
                        setTopsideCost(topsideCostProfile)
                        const topsideCostProfileOverride = topside.costProfileOverride
                        setTopsideCostOverride(topsideCostProfileOverride)

                        const surfCostProfile = surf.costProfile
                        setSurfCost(surfCostProfile)
                        const surfCostProfileOverride = surf.costProfileOverride
                        setSurfCostOverride(surfCostProfileOverride)

                        const substructureCostProfile = substructure.costProfile
                        setSubstructureCost(substructureCostProfile)
                        const substructureCostProfileOverride = substructure.costProfileOverride
                        setSubstructureCostOverride(substructureCostProfileOverride)

                        const transportCostProfile = transport.costProfile
                        setTransportCost(transportCostProfile)
                        const transportCostProfileOverride = transport.costProfileOverride
                        setTransportCostOverride(transportCostProfileOverride)

                        // Development
                        if (wellProject) {
                            const {
                                oilProducerCostProfile, gasProducerCostProfile,
                                waterInjectorCostProfile, gasInjectorCostProfile,
                                oilProducerCostProfileOverride, gasProducerCostProfileOverride,
                                waterInjectorCostProfileOverride, gasInjectorCostProfileOverride,
                            } = wellProject
                            setWellProjectOilProducerCost(oilProducerCostProfile)
                            setWellProjectOilProducerCostOverride(oilProducerCostProfileOverride)
                            setWellProjectGasProducerCost(gasProducerCostProfile)
                            setWellProjectGasProducerCostOverride(gasProducerCostProfileOverride)
                            setWellProjectWaterInjectorCost(waterInjectorCostProfile)
                            setWellProjectWaterInjectorCostOverride(waterInjectorCostProfileOverride)
                            setWellProjectGasInjectorCost(gasInjectorCostProfile)
                            setWellProjectGasInjectorCostOverride(gasInjectorCostProfileOverride)

                            // Exploration
                            if (exploration) {
                                const {
                                    explorationWellCostProfile, appraisalWellCostProfile, sidetrackCostProfile,
                                    seismicAcquisitionAndProcessing,
                                } = exploration;
                                setExplorationWellCost(explorationWellCostProfile)
                                setExplorationAppraisalWellCost(appraisalWellCostProfile)
                                setExplorationSidetrackCost(sidetrackCostProfile)
                                setSeismicAcqAndProcCost(seismicAcquisitionAndProcessing)
                                const countryOffice = exploration.countryOfficeCost
                                setCountryOfficeCost(countryOffice)

                                setGAndGAdminCost(exploration.gAndGAdminCost)
                                
                                SetTableYearsFromProfiles([caseItem.totalFeasibilityAndConceptStudies, caseItem.totalFEEDStudies,
                                caseItem.wellInterventionCostProfile, caseItem.offshoreFacilitiesOperationsCostProfile,
                                caseItem.cessationWellsCost, caseItem.cessationOffshoreFacilitiesCost,
                                caseItem.totalFeasibilityAndConceptStudiesOverride, caseItem.totalFEEDStudiesOverride,
                                caseItem.wellInterventionCostProfileOverride, caseItem.offshoreFacilitiesOperationsCostProfileOverride,
                                caseItem.cessationWellsCostOverride, caseItem.cessationOffshoreFacilitiesCostOverride,
                                    surfCostProfile, topsideCostProfile, substructureCostProfile, transportCostProfile,
                                    surfCostOverride, topsideCostOverride, substructureCostOverride, transportCostOverride,
                                    oilProducerCostProfile, gasProducerCostProfile,
                                    waterInjectorCostProfile, gasInjectorCostProfile,
                                    oilProducerCostProfileOverride, gasProducerCostProfileOverride,
                                    waterInjectorCostProfileOverride, gasInjectorCostProfileOverride,
                                    explorationWellCostProfile, appraisalWellCostProfile, sidetrackCostProfile,
                                    seismicAcquisitionAndProcessing, countryOffice, exploration.gAndGAdminCost,
                                ], caseItem.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030, setStartYear, setEndYear, setTableYears)
                            }
                        }
                    }
            } catch (error) {
                console.error("[CaseView] Error while generating cost profile", error)
            }
        })()
    }, [activeTab])

    useEffect(() => {
        if (exploration) {
            const {
                explorationWellCostProfile, appraisalWellCostProfile, sidetrackCostProfile,
                seismicAcquisitionAndProcessing,
            } = exploration;
            setExplorationWellCost(explorationWellCostProfile)
            setExplorationAppraisalWellCost(appraisalWellCostProfile)
            setExplorationSidetrackCost(sidetrackCostProfile)
            setSeismicAcqAndProcCost(seismicAcquisitionAndProcessing)
            const countryOffice = exploration.countryOfficeCost
            setCountryOfficeCost(countryOffice)
        }
    }, [exploration])

    useEffect(() => {
        if (studyGridRef.current && studyGridRef.current.api && studyGridRef.current.api.refreshCells) {
            studyGridRef.current.api.refreshCells()
        }
    }, [totalFeasibilityAndConceptStudies, totalFEEDStudies, totalOtherStudies])

    useEffect(() => {
        if (opexGridRef.current && opexGridRef.current.api && opexGridRef.current.api.refreshCells) {
            opexGridRef.current.api.refreshCells()
        }
    }, [offshoreFacilitiesOperationsCostProfile, wellInterventionCostProfile, historicCostCostProfile, additionalOPEXCostProfile])

    useEffect(() => {
        if (cessationGridRef.current && cessationGridRef.current.api && cessationGridRef.current.api.refreshCells) {
            cessationGridRef.current.api.refreshCells()
        }
    }, [cessationWellsCost, cessationOffshoreFacilitiesCost])

    useEffect(() => {
        if (explorationWellsGridRef.current && explorationWellsGridRef.current.api && explorationWellsGridRef.current.api.refreshCells) {
            explorationWellsGridRef.current.api.refreshCells()
        }
    }, [gAndGAdminCost])

    const updatedAndSetSurf = (surfItem: Components.Schemas.SurfDto) => {
        const newSurf: Components.Schemas.SurfDto = { ...surfItem }
        if (surfCost) {
            newSurf.costProfile = surfCost
        }
        setSurf(newSurf)
    }

    const handleCaseFeasibilityChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newCase = { ...caseItem }
        const newCapexFactorFeasibilityStudies = e.currentTarget.value.length > 0
            ? Math.min(Math.max(Number(e.currentTarget.value), 0), 100) : undefined
        if (newCapexFactorFeasibilityStudies !== undefined) {
            newCase.capexFactorFeasibilityStudies = newCapexFactorFeasibilityStudies / 100
        } else { newCase.capexFactorFeasibilityStudies = 0 }
        setCase(newCase as Components.Schemas.CaseDto)
    }

    const handleCaseFEEDChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newCase = { ...caseItem }
        const newCapexFactorFEEDStudies = e.currentTarget.value.length > 0
            ? Math.min(Math.max(Number(e.currentTarget.value), 0), 100) : undefined
        if (newCapexFactorFEEDStudies !== undefined) {
            newCase.capexFactorFEEDStudies = newCapexFactorFEEDStudies / 100
        } else { newCase.capexFactorFEEDStudies = 0 }
        setCase(newCase as Components.Schemas.CaseDto)
    }

    const handleSurfMaturityChange: ChangeEventHandler<HTMLSelectElement> = async (e) => {
        if ([0, 1, 2, 3].indexOf(Number(e.currentTarget.value)) !== -1) {
            const newMaturity: Components.Schemas.Maturity = Number(e.currentTarget.value) as Components.Schemas.Maturity
            const newSurf = { ...surf }
            newSurf.maturity = newMaturity
            updatedAndSetSurf(newSurf as Components.Schemas.SurfDto)
        }
    }

    const handleStartYearChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newStartYear = Number(e.currentTarget.value)
        if (newStartYear < 2010) {
            setStartYear(2010)
            return
        }
        setStartYear(newStartYear)
    }

    const handleEndYearChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const newEndYear = Number(e.currentTarget.value)
        if (newEndYear > 2100) {
            setEndYear(2100)
            return
        }
        setEndYear(newEndYear)
    }

    interface ITimeSeriesData {
        profileName: string
        unit: string,
        set?: Dispatch<SetStateAction<ITimeSeriesCost | undefined>>,
        overrideProfileSet?: Dispatch<SetStateAction<ITimeSeriesCostOverride | undefined>>,
        profile: ITimeSeries | undefined
        overrideProfile?: ITimeSeries | undefined
        overridable?: boolean
    }

    const studyTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Feasibility & conceptual stud.",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalFeasibilityAndConceptStudies,
            overridable: true,
            overrideProfile: totalFeasibilityAndConceptStudiesOverride,
            overrideProfileSet: setTotalFeasibilityAndConceptStudiesOverride,
        },
        {
            profileName: "FEED studies (DG2-DG3)",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalFEEDStudies,
            overridable: true,
            overrideProfile: totalFEEDStudiesOverride,
            overrideProfileSet: setTotalFEEDStudiesOverride,
        },
        {
            profileName: "Other studies",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: totalOtherStudies,
            set: setTotalOtherStudies,
        },
    ]

    const opexTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Historic Cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: historicCostCostProfile,
            set: setHistoricCostCostProfile,
        },
        {
            profileName: "Well intervention",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellInterventionCostProfile,
            overridable: true,
            overrideProfile: wellInterventionCostProfileOverride,
            overrideProfileSet: setWellInterventionCostProfileOverride,
        },
        {
            profileName: "Offshore facilities operations",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: offshoreFacilitiesOperationsCostProfile,
            overridable: true,
            overrideProfile: offshoreFacilitiesOperationsCostProfileOverride,
            overrideProfileSet: setOffshoreFacilitiesOperationsCostProfileOverride,
        },
        {
            profileName: "Additional OPEX (input req.)",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: additionalOPEXCostProfile,
            set: setAdditionalOPEXCostProfile,
        },
    ]

    const cessationTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Cessation - Development wells",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: cessationWellsCost,
            overridable: true,
            overrideProfile: cessationWellsCostOverride,
            overrideProfileSet: setCessationWellsCostOverride,
        },
        {
            profileName: "Cessation - Offshore facilities",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: cessationOffshoreFacilitiesCost,
            overridable: true,
            overrideProfile: cessationOffshoreFacilitiesCostOverride,
            overrideProfileSet: setCessationOffshoreFacilitiesCostOverride,
        },
    ]

    const capexTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Subsea production system",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: surfCost,
            overridable: true,
            overrideProfile: surfCostOverride,
            overrideProfileSet: setSurfCostOverride,
        },
        {
            profileName: "Topside",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: topsideCost,
            overridable: true,
            overrideProfile: topsideCostOverride,
            overrideProfileSet: setTopsideCostOverride,
        },
        {
            profileName: "Substructure",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: substructureCost,
            overridable: true,
            overrideProfile: substructureCostOverride,
            overrideProfileSet: setSubstructureCostOverride,
        },
        {
            profileName: "Transport system",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: transportCost,
            overridable: true,
            overrideProfile: transportCostOverride,
            overrideProfileSet: setTransportCostOverride,
        },
    ]

    const developmentTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "Oil producer cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectOilProducerCost,
            overridable: true,
            overrideProfile: wellProjectOilProducerCostOverride,
            overrideProfileSet: setWellProjectOilProducerCostOverride,
        },
        {
            profileName: "Gas producer cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectGasProducerCost,
            overridable: true,
            overrideProfile: wellProjectGasProducerCostOverride,
            overrideProfileSet: setWellProjectGasProducerCostOverride,
        },
        {
            profileName: "Water injector cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectWaterInjectorCost,
            overridable: true,
            overrideProfile: wellProjectWaterInjectorCostOverride,
            overrideProfileSet: setWellProjectWaterInjectorCostOverride,
        },
        {
            profileName: "Gas injector cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: wellProjectGasInjectorCost,
            overridable: true,
            overrideProfile: wellProjectGasInjectorCostOverride,
            overrideProfileSet: setWellProjectGasInjectorCostOverride,
        },
    ]

    const explorationTimeSeriesData: ITimeSeriesData[] = [
        {
            profileName: "G&G and admin costs",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: gAndGAdminCost,
        },
        {
            profileName: "Seismic acquisition and processing",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: seismicAcqAndProcCost,
            set: setSeismicAcqAndProcCost,
        },
        {
            profileName: "Country office cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: countryOfficeCost,
            set: setCountryOfficeCost,
        },
        {
            profileName: "Exploration well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationWellCost,
            set: setExplorationWellCost,
        },
        {
            profileName: "Appraisal well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationAppraisalWellCost,
            set: setExplorationAppraisalWellCost,
        },
        {
            profileName: "Sidetrack well cost",
            unit: `${project?.currency === 1 ? "MNOK" : "MUSD"}`,
            profile: explorationSidetrackCost,
            set: setExplorationSidetrackCost,
        },
    ]

    const handleTableYearsClick = () => {
        setTableYears([startYear, endYear])
    }

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!totalFeasibilityAndConceptStudiesOverride) { return }
        newCase.totalFeasibilityAndConceptStudiesOverride = totalFeasibilityAndConceptStudiesOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [totalFeasibilityAndConceptStudiesOverride])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!totalFEEDStudiesOverride) { return }
        newCase.totalFEEDStudiesOverride = totalFEEDStudiesOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [totalFEEDStudiesOverride])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!totalOtherStudies) { return }
        newCase.totalOtherStudies = totalOtherStudies
        setCase(newCase as Components.Schemas.CaseDto)
    }, [totalOtherStudies])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!wellInterventionCostProfileOverride) { return }
        newCase.wellInterventionCostProfileOverride = wellInterventionCostProfileOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [wellInterventionCostProfileOverride])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!offshoreFacilitiesOperationsCostProfileOverride) { return }
        newCase.offshoreFacilitiesOperationsCostProfileOverride = offshoreFacilitiesOperationsCostProfileOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [offshoreFacilitiesOperationsCostProfileOverride])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!historicCostCostProfile) { return }
        newCase.historicCostCostProfile = historicCostCostProfile
        setCase(newCase as Components.Schemas.CaseDto)
    }, [historicCostCostProfile])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!additionalOPEXCostProfile) { return }
        newCase.additionalOPEXCostProfile = additionalOPEXCostProfile
        setCase(newCase as Components.Schemas.CaseDto)
    }, [additionalOPEXCostProfile])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!cessationWellsCostOverride) { return }
        newCase.cessationWellsCostOverride = cessationWellsCostOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [cessationWellsCostOverride])

    useEffect(() => {
        const newCase = { ...caseItem }
        if (!cessationOffshoreFacilitiesCostOverride) { return }
        newCase.cessationOffshoreFacilitiesCostOverride = cessationOffshoreFacilitiesCostOverride
        setCase(newCase as Components.Schemas.CaseDto)
    }, [cessationOffshoreFacilitiesCostOverride])

    useEffect(() => {
        const newSurf = { ...surf }
        if (!surfCost) { return }
        newSurf.costProfile = surfCost
        setSurf(newSurf as Components.Schemas.SurfDto)
    }, [surfCost])

    useEffect(() => {
        const newTopside = { ...topside }
        if (!topsideCost) { return }
        newTopside.costProfile = topsideCost
        setTopside(newTopside as Components.Schemas.TopsideDto)
    }, [topsideCost])

    useEffect(() => {
        const newSubstructure = { ...substructure }
        if (!substructureCost) { return }
        newSubstructure.costProfile = substructureCost
        setSubstructure(newSubstructure as Components.Schemas.SubstructureDto)
    }, [substructureCost])

    useEffect(() => {
        const newTransport = { ...transport }
        if (!transportCost) { return }
        newTransport.costProfile = transportCost
        setTransport(newTransport as Components.Schemas.TransportDto)
    }, [transportCost])

    useEffect(() => {
        const newSurf = { ...surf }
        if (!surfCostOverride) { return }
        newSurf.costProfileOverride = surfCostOverride
        setSurf(newSurf as Components.Schemas.SurfDto)
    }, [surfCostOverride])

    useEffect(() => {
        const newTopside = { ...topside }
        if (!topsideCostOverride) { return }
        newTopside.costProfileOverride = topsideCostOverride
        setTopside(newTopside as Components.Schemas.TopsideDto)
    }, [topsideCostOverride])

    useEffect(() => {
        const newSubstructure = { ...substructure }
        if (!substructureCostOverride) { return }
        newSubstructure.costProfileOverride = substructureCostOverride
        setSubstructure(newSubstructure as Components.Schemas.SubstructureDto)
    }, [substructureCostOverride])

    useEffect(() => {
        const newTransport = { ...transport }
        if (!transportCostOverride) { return }
        newTransport.costProfileOverride = transportCostOverride
        setTransport(newTransport as Components.Schemas.TransportDto)
    }, [transportCostOverride])

    useEffect(() => {
        const newWellProject= { ...wellProject }
        if (!wellProjectOilProducerCost) { return }
        newWellProject.oilProducerCostProfile = wellProjectOilProducerCost
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectOilProducerCost])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectOilProducerCostOverride) { return }
        newWellProject.oilProducerCostProfileOverride = wellProjectOilProducerCostOverride
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectOilProducerCostOverride])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectGasProducerCost) { return }
        newWellProject.gasProducerCostProfile = wellProjectGasProducerCost
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectGasProducerCost])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectGasProducerCostOverride) { return }
        newWellProject.gasProducerCostProfileOverride = wellProjectGasProducerCostOverride
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectGasProducerCostOverride])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectWaterInjectorCost) { return }
        newWellProject.waterInjectorCostProfile = wellProjectWaterInjectorCost
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectWaterInjectorCost])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectWaterInjectorCostOverride) { return }
        newWellProject.waterInjectorCostProfileOverride = wellProjectWaterInjectorCostOverride
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectWaterInjectorCostOverride])

    useEffect(() => {
        const newWellProject = { ...wellProject }
        if (!wellProjectGasInjectorCost) { return }
        newWellProject.gasInjectorCostProfile = wellProjectGasInjectorCost
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectGasInjectorCost])

    useEffect(() => {
        const newWellProject= { ...wellProject }
        if (!wellProjectGasInjectorCostOverride) { return }
        newWellProject.gasInjectorCostProfileOverride = wellProjectGasInjectorCostOverride
        setWellProject(newWellProject as Components.Schemas.WellProjectDto)
    }, [wellProjectGasInjectorCostOverride])

    useEffect(() => {
        const newExploration = { ...exploration }
        if (!explorationWellCost) { return }
        newExploration.explorationWellCostProfile = explorationWellCost
        setExploration(newExploration as Components.Schemas.ExplorationDto)
    }, [explorationWellCost])

    useEffect(() => {
        const newExploration = { ...exploration }
        if (!explorationAppraisalWellCost) { return }
        newExploration.appraisalWellCostProfile = explorationAppraisalWellCost
        setExploration(newExploration as Components.Schemas.ExplorationDto)
    }, [explorationAppraisalWellCost])

    useEffect(() => {
        const newExploration = { ...exploration }
        if (!explorationSidetrackCost) { return }
        newExploration.sidetrackCostProfile = explorationSidetrackCost
        setExploration(newExploration as Components.Schemas.ExplorationDto)
    }, [explorationSidetrackCost])

    useEffect(() => {
        const newExploration = { ...exploration }
        if (!seismicAcqAndProcCost) { return }
        newExploration.seismicAcquisitionAndProcessing = seismicAcqAndProcCost
        setExploration(newExploration as Components.Schemas.ExplorationDto)
    }, [seismicAcqAndProcCost])

    useEffect(() => {
        const newExploration = { ...exploration }
        if (!countryOfficeCost) { return }
        newExploration.countryOfficeCost = countryOfficeCost
        setExploration(newExploration as Components.Schemas.ExplorationDto)
    }, [countryOfficeCost])

    if (activeTab !== 5) { return null }

    const maturityOptions: { [key: string]: string } = {
        0: "A",
        1: "B",
        2: "C",
        3: "D",
    }
    return (
        <>
            <TopWrapper>
                <PageTitle variant="h3">Cost</PageTitle>
            </TopWrapper>
            <InputContainer mobileColumns={1} desktopColumns={3} breakPoint={850}>
                <InputSwitcher
                    value={`${caseItem?.capexFactorFeasibilityStudies !== undefined ? (caseItem.capexFactorFeasibilityStudies * 100).toFixed(2) : ""}%`}
                    label="CAPEX factor feasibility studies"
                >
                    <CaseNumberInput
                        onChange={handleCaseFeasibilityChange}
                        defaultValue={caseItem?.capexFactorFeasibilityStudies !== undefined ? caseItem.capexFactorFeasibilityStudies * 100 : undefined}
                        integer={false}
                        label="CAPEX factor feasibility studies"
                        unit="%"
                    />
                </InputSwitcher>

                <InputSwitcher
                    value={`${caseItem?.capexFactorFEEDStudies !== undefined ? (caseItem.capexFactorFEEDStudies * 100).toFixed(2) : ""}%`}
                    label="CAPEX factor FEED studies"
                >
                    <CaseNumberInput
                        onChange={handleCaseFEEDChange}
                        defaultValue={caseItem?.capexFactorFEEDStudies !== undefined ? caseItem.capexFactorFEEDStudies * 100 : undefined}
                        integer={false}
                        label="CAPEX factor FEED studies"
                        unit="%"
                    />
                </InputSwitcher>
                <InputSwitcher value={maturityOptions[surf?.maturity ?? 'defaultKey']} label="Maturity">
                    <NativeSelect
                        id="maturity"
                        label="Maturity"
                        onChange={handleSurfMaturityChange}
                        value={surf?.maturity ?? ''}
                    >
                        {Object.keys(maturityOptions).map((key) => (
                            <option key={key} value={key}>{maturityOptions[key]}</option>
                        ))}
                    </NativeSelect>
                </InputSwitcher>


            </InputContainer>
            <FilterContainer>
                <NativeSelect
                    id="currency"
                    label="Currency"
                    onChange={() => { }}
                    value={project?.currency}
                    disabled
                >
                    <option key="1" value={1}>MNOK</option>
                    <option key="2" value={2}>MUSD</option>
                </NativeSelect>
                <CaseNumberInput
                    onChange={handleStartYearChange}
                    defaultValue={startYear}
                    integer
                    label="Start year"
                />

                <CaseNumberInput
                    onChange={handleEndYearChange}
                    defaultValue={endYear}
                    integer
                    label="End year"
                />
                <Button onClick={handleTableYearsClick}>
                    Apply
                </Button>
            </FilterContainer>
            <TableWrapper>
                <CaseTabTable
                    timeSeriesData={studyTimeSeriesData}
                    dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Total study costs"
                    gridRef={studyGridRef}
                    alignedGridsRef={[opexGridRef, cessationGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total study costs"
                />
            </TableWrapper>
            <TableWrapper>
                <CaseTabTable
                    timeSeriesData={opexTimeSeriesData}
                    dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="OPEX"
                    gridRef={opexGridRef}
                    alignedGridsRef={[studyGridRef, cessationGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total OPEX cost"
                />
            </TableWrapper>
            <TableWrapper>
                <CaseTabTable
                    timeSeriesData={cessationTimeSeriesData}
                    dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Cessation costs"
                    gridRef={cessationGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, capexGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total cessation cost"
                />
            </TableWrapper>
            <TableWrapper>
                <CaseTabTable
                    timeSeriesData={capexTimeSeriesData}
                    dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Offshore facilitiy costs"
                    gridRef={capexGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef,
                        developmentWellsGridRef, explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total offshore facility cost"
                />
            </TableWrapper>
            <TableWrapper>
                <CaseTabTable
                    timeSeriesData={developmentTimeSeriesData}
                    dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                    tableYears={tableYears}
                    tableName="Development well costs"
                    gridRef={developmentWellsGridRef}
                    alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef, capexGridRef,
                        explorationWellsGridRef]}
                    includeFooter
                    totalRowName="Total development well cost"
                />
            </TableWrapper>
            <CaseTabTable
                timeSeriesData={explorationTimeSeriesData}
                dg4Year={caseItem?.dG4Date ? new Date(caseItem.dG4Date).getFullYear() : 2030}
                tableYears={tableYears}
                tableName="Exploration well costs"
                gridRef={explorationWellsGridRef}
                alignedGridsRef={[studyGridRef, opexGridRef, cessationGridRef, capexGridRef,
                    developmentWellsGridRef]}
                includeFooter
                totalRowName="Total exploration cost"
            />
        </>
    )
}

export default CaseCostTab
