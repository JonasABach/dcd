import {
    useState,
    useRef,
    useEffect,
} from "react"
import { NativeSelect } from "@equinor/eds-core-react"
import Grid from "@mui/material/Grid"
import { useQueryClient, useQuery } from "react-query"
import { useParams } from "react-router"
import SwitchableNumberInput from "../../Input/SwitchableNumberInput"
import { AgChartsTimeseries, setValueToCorrespondingYear } from "../../AgGrid/AgChartsTimeseries"
import InputSwitcher from "../../Input/Components/InputSwitcher"
import { useProjectContext } from "../../../Context/ProjectContext"
import { useCaseContext } from "../../../Context/CaseContext"
import DateRangePicker from "../../Input/TableDateRangePicker"
import SwitchableDropdownInput from "../../Input/SwitchableDropdownInput"
import CaseProductionProfilesTabSkeleton from "./LoadingSkeletons/CaseProductionProfilesTabSkeleton"
import CaseProductionProfiles from "./CaseCost/Tables/CaseProductionProfiles"
import { SetTableYearsFromProfiles } from "../Components/CaseTabTableHelper"

const CaseProductionProfilesTab = () => {
    const queryClient = useQueryClient()
    const { caseId } = useParams()
    const { project } = useProjectContext()
    const { activeTabCase } = useCaseContext()
    const projectId = project?.id || null

    const [startYear, setStartYear] = useState<number>(2020)
    const [endYear, setEndYear] = useState<number>(2030)
    const [tableYears, setTableYears] = useState<[number, number]>([2020, 2030])
    const [yearRangeSetFromProfiles, setYearRangeSetFromProfiles] = useState<boolean>(false)
    const productionStrategyOptions = {
        0: "Depletion",
        1: "Water injection",
        2: "Gas injection",
        3: "WAG",
        4: "Mixed",
    }

    const artificialLiftOptions = {
        0: "No lift",
        1: "Gas lift",
        2: "Electrical submerged pumps",
        3: "Subsea booster pumps",
    }

    const gridRef = useRef<any>(null)

    const gasSolutionOptions = {
        0: "Export",
        1: "Injection",
    }

    const { data: apiData } = useQuery<Components.Schemas.CaseWithAssetsDto | undefined>(
        ["apiData", { projectId, caseId }],
        () => queryClient.getQueryData(["apiData", { projectId, caseId }]),
        {
            enabled: !!projectId && !!caseId,
            initialData: () => queryClient.getQueryData(["apiData", { projectId, caseId }]),
        },
    )

    const drainageStrategyData = apiData?.drainageStrategy
    const oilProductionData = apiData?.productionProfileOil
    const additionalOilProductionData = apiData?.additionalProductionProfileOil
    const gasProductionData = apiData?.productionProfileGas
    const additionalGasProductionData = apiData?.additionalProductionProfileGas
    const waterProductionData = apiData?.productionProfileWater
    const waterInjectionData = apiData?.productionProfileWaterInjection
    const fuelFlaringAndLossesData = apiData?.fuelFlaringAndLosses
    const fuelFlaringAndLossesOverrideData = apiData?.fuelFlaringAndLossesOverride
    const netSalesGasData = apiData?.netSalesGas
    const netSalesGasOverrideData = apiData?.netSalesGasOverride
    const importedElectricityData = apiData?.importedElectricity
    const importedElectricityOverrideData = apiData?.importedElectricityOverride
    const deferredOilData = apiData?.deferredOilProduction
    const deferredGasData = apiData?.deferredGasProduction
    const caseData = apiData?.case

    useEffect(() => {
        if (apiData && activeTabCase === 1 && !yearRangeSetFromProfiles) {
            SetTableYearsFromProfiles(
                [
                    drainageStrategyData,
                    oilProductionData,
                    gasProductionData,
                    waterProductionData,
                    waterInjectionData,
                    fuelFlaringAndLossesData,
                    fuelFlaringAndLossesOverrideData,
                    netSalesGasData,
                    netSalesGasOverrideData,
                    importedElectricityData,
                    importedElectricityOverrideData,
                    deferredOilData,
                    deferredGasData,
                ],
                caseData?.dG4Date ? new Date(caseData.dG4Date).getFullYear() : endYear,
                setStartYear,
                setEndYear,
                setTableYears,
            )
            setYearRangeSetFromProfiles(true)
        }
    }, [apiData, activeTabCase])

    if (activeTabCase !== 1) { return null }

    if (!caseData || !drainageStrategyData || !projectId) {
        return (<CaseProductionProfilesTabSkeleton />)
    }
    const handleTableYearsClick = () => {
        setTableYears([startYear, endYear])
    }

    const productionProfilesChartData = () => {
        const dataArray: object[] = []
        if (caseData.dG4Date === undefined) { return dataArray }
        for (let i = startYear; i <= endYear; i += 1) {
            dataArray.push({
                year: i,
                oilProduction: setValueToCorrespondingYear(oilProductionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
                additionalOilProduction: setValueToCorrespondingYear(additionalOilProductionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
                gasProduction: setValueToCorrespondingYear(gasProductionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
                additionalGasProduction: setValueToCorrespondingYear(additionalGasProductionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
                waterProduction: setValueToCorrespondingYear(waterProductionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
            })
        }
        return dataArray
    }

    const injectionProfilesChartData = () => {
        const dataArray: object[] = []
        if (caseData.dG4Date === undefined) { return dataArray }
        for (let i = startYear; i <= endYear; i += 1) {
            dataArray.push({
                year: i,
                waterInjection:
                    setValueToCorrespondingYear(waterInjectionData, i, startYear, new Date(caseData.dG4Date).getFullYear()),
            })
        }
        return dataArray
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
                <SwitchableNumberInput
                    resourceName="case"
                    resourcePropertyKey="facilitiesAvailability"
                    label="Facilities availability"
                    value={caseData.facilitiesAvailability}
                    integer={false}
                    unit="%"
                    min={0}
                    max={100}
                    resourceId={caseData.id}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <SwitchableDropdownInput
                    resourceName="drainageStrategy"
                    resourcePropertyKey="gasSolution"
                    resourceId={drainageStrategyData.id}
                    value={drainageStrategyData.gasSolution}
                    options={gasSolutionOptions}
                    label="Gas solution"
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <InputSwitcher
                    value={productionStrategyOptions[caseData.productionStrategyOverview]}
                    label="Production strategy overview"
                >
                    <NativeSelect
                        id="productionStrategy"
                        label=""
                        disabled
                        value={caseData.productionStrategyOverview}
                    >
                        {Object.entries(productionStrategyOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </NativeSelect>
                </InputSwitcher>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <InputSwitcher
                    value={artificialLiftOptions[caseData.artificialLift]}
                    label="Artificial lift"
                >
                    <NativeSelect
                        id="artificialLift"
                        label=""
                        disabled
                        value={caseData.artificialLift}
                    >
                        {Object.entries(artificialLiftOptions).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </NativeSelect>
                </InputSwitcher>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <SwitchableNumberInput
                    resourceName="case"
                    resourcePropertyKey="producerCount"
                    label="Oil producer wells"
                    value={caseData.producerCount}
                    integer
                    disabled
                    resourceId={caseData.id}

                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <SwitchableNumberInput
                    resourceName="case"
                    resourcePropertyKey="waterInjectorCount"
                    label="Water injector wells"
                    value={caseData.waterInjectorCount}
                    integer
                    disabled
                />
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
                <SwitchableNumberInput
                    resourceName="case"
                    resourcePropertyKey="gasInjectorCount"
                    label="Gas injector wells"
                    value={caseData.gasInjectorCount}
                    integer
                    disabled
                />
            </Grid>
            <DateRangePicker
                setStartYear={setStartYear}
                setEndYear={setEndYear}
                startYear={startYear}
                endYear={endYear}
                handleTableYearsClick={handleTableYearsClick}
            />
            <Grid item xs={12}>
                <AgChartsTimeseries
                    data={productionProfilesChartData()}
                    chartTitle="Production profiles"
                    barColors={["#243746", "#EB0037", "#A8CED1"]}
                    barProfiles={["oilProduction", "gasProduction", "waterProduction"]}
                    barNames={[
                        "Oil production (MSm3)",
                        "Gas production (GSm3)",
                        "Water production (MSm3)",
                    ]}
                />
            </Grid>
            {
                (waterInjectionData?.values && waterInjectionData.values?.length > 0)
                && (
                    <Grid item xs={12}>
                        <AgChartsTimeseries
                            data={injectionProfilesChartData()}
                            chartTitle="Injection profiles"
                            barColors={["#A8CED1"]}
                            barProfiles={["waterInjection"]}
                            barNames={["Water injection"]}
                            unit="MSm3"
                        />
                    </Grid>
                )
            }
            <Grid item xs={12}>
                <CaseProductionProfiles
                    apiData={apiData}
                    tableYears={tableYears}
                    alignedGridsRef={gridRef}
                />
            </Grid>
        </Grid>
    )
}

export default CaseProductionProfilesTab
