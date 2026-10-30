export interface Statistics {
    general: GeneralStatistics;
    mapStatistics: StatisticsItem[];
    missionTypeStatistics: StatisticsItem[];
    agentStats: StatisticsItem[]
}

export interface GeneralStatistics {
    missionsCreated: number;
    missionsAsLeader?: number;
    missionsCompleted: number;
    missionsAborted: number;
    victories: number;
    defeats: number;
    victoryRate: number;
}

// Estadisticas según el mapa, tipo de misión, o agente
export interface StatisticsItem {
    itemName: string;
    missionsCompleted: number;
    missionsAborted: number;
    victories: number;
    defeats: number;
    victoryRate: number;
}