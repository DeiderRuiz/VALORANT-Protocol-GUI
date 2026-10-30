export interface GameMap {
    id?: number;
    name: string;
    photo: string;
    description: string;
}

export interface MapResponse {
    message: string;
    map: GameMap;
}