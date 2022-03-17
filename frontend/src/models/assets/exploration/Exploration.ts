import { ExplorationCostProfileDto } from "./ExplorationCostProfileDto"
import { ExplorationDrillingScheduleDto } from "./ExplorationDrillingScheduleDto"
import { GAndGAdminCostDto } from "./GAndAdminCostDto"

export class Exploration implements Components.Schemas.ExplorationDto {
    id?: string | undefined
    projectId?: string | undefined
    name?: string | undefined
    wellType?: Components.Schemas.WellType | undefined
    costProfile?: ExplorationCostProfileDto | undefined
    drillingSchedule?: ExplorationDrillingScheduleDto | undefined
    gAndGAdminCost?: GAndGAdminCostDto | undefined
    rigMobDemob?: number | undefined

    constructor(data: Components.Schemas.ExplorationDto) {
        this.id = data.id
        this.projectId = data.projectId
        this.name = data.name ?? ""
        this.wellType = data.wellType
        this.costProfile = ExplorationCostProfileDto.fromJSON(data.costProfile)
        this.drillingSchedule = ExplorationDrillingScheduleDto.fromJSON(data.drillingSchedule)
        this.gAndGAdminCost = GAndGAdminCostDto.fromJSON(data.gAndGAdminCost)
        this.rigMobDemob = data.rigMobDemob
    }

    static fromJSON(data: Components.Schemas.ExplorationDto): Exploration {
        return new Exploration(data)
    }
}