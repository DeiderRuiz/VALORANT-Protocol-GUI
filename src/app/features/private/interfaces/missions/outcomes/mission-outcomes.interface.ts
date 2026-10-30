import { Mission } from "../missions.interface";

export interface MissionOutcomeRequest{
    mission: Mission,
    outcome: MissionOutcome
}

export interface MissionOutcome{
    result: string;
    description?: string;
}