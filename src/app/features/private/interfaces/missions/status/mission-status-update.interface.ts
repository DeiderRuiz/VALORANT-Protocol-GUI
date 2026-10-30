import { Mission } from "../missions.interface"

export interface UpdateMissionStatusRequest {
    mission: Mission,
    statement: "waiting_start" | "in_progress",
}