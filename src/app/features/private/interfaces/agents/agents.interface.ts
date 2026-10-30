import { Ability } from "./abilities/agent-ability.interface";
import { AgentClass } from "./classes/agent-class.interface";
import { Nationality } from "./nationalities/agent-nationalities.interface";

export interface AgentAndStats{
    agent: Agent,
    mapName: string
    mapMissionsCompleted: number,
    mapVictories: number,
    mapVictoryAverage: number,
    missionTypeName: string,
    missionTypesCompleted: number,
    missionTypesVictories: number,
    missionTypesVictoryAverage: number
}

export interface Agent {
    id:number;
    name: string;
    slug: string;
    bio:string;
    profile_photo: string;
    agent_photo: string;
    nationality_id?: number;
    class_id: number;
    available: number;
    abilities: Ability[];
    nationality?: Nationality;
    class: AgentClass;
}