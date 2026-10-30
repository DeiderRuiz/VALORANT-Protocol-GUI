import { Mission } from "../missions.interface";

export interface MissionAbortRequest {
    mission: Mission,
    body: MissionAbort
}

export interface MissionAbort {
    type: string,
    details: string
}