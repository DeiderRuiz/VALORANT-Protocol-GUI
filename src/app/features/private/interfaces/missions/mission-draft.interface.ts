import { MissionAgents, MissionDetails } from "./mission-request.interface";

/* export interface MissionDraft {
    title: string;
    objective: string;
    description: string;
    deadline: string;
    type_id: number;
    priority: string;
    map_id: number;
    agents: number[];
    leader_id: number;
} */

export interface MissionDraft extends MissionDetails, MissionAgents {}