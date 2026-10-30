export interface MissionDetails {
    title: string;
    objective: string;
    description: string;
    deadline: string;
    type_id: number;
    priority: string;
    map_id: number;
}

export interface MissionAgents {
    agents: number[];
    leader_id: number;
}