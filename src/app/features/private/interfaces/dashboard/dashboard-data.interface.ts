/* export interface DashboardData {
    profile:            DashboardProfile;
    missionQuantity:    number;
    missionsSuccessful: number;
    average:            number;
    agents:             number;
    maps:               number;
    myLastMission:      DashboardMission;
    lastMission:        DashboardMission;
    missionsCompleted:  number;
    victories:          number;
    defeats:            number;
    victoryAverage:     number;
}

export interface DashboardMission {
    id:         number;
    title:      string;
    statement:  string;
    result?:    string;
    created_at: Date;
    updated_at: Date;
}

export interface DashboardProfile {
    id:            number;
    name:          string;
    profile_photo: null;
    class:          string;
} */
export interface DashboardData {
    profile: DashboardProfile;
    myStatistics: DashboardMyStatistics;
    agents: number;
    maps: number;
    myLastMission: DashboardMission;
    lastMission: DashboardMission;
    generalStatistics: DashboardGeneralStatistics;
}

export interface DashboardProfile {
    id: number;
    name: string;
    profile_photo: string | null;
    class: string;
}

export interface DashboardMyStatistics {
    missionsCompleted: number;
    victories: number;
    victoryRate: number;
}

export interface DashboardGeneralStatistics {
    missionsCompleted: number;
    victories: number;
    defeats: number;
    victoryRate: number;
}

export interface DashboardMission {
    id: number;
    title: string;
    statement: string;
    result?: string;
    created_at: Date;
    updated_at: Date;
}