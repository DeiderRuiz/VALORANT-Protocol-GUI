import { Agent } from "../../agents/agents.interface";

export interface MissionEvent {
    id: number;
    type: string;
    description: string;
    details: string;
    agent: Agent;
    created_at: Date
}