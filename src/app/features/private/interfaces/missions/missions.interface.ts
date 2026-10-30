import { Agent } from '../agents/agents.interface';
import { GameMap } from "../maps/maps.interface";
import { MissionEvent } from './events/mission-event.interface';
import { MissionType } from './mission-type.interface';
import { Report } from './reports/mission-report.interface';

export interface Mission {
    id: number;
    title: string;
    description: string;
    objective: string;
    deadline: string
    type_id: number;
    priority: string;
    leader_id: number;
    map_id: number;
    statement: string;
    result: string;
    code: string;
    created_at: Date;
    updated_at: Date;
    agents: Agent[];
    map: GameMap;
    events?: MissionEvent[]
    report?: Report;
    leader: Agent;
    type: MissionType;
}