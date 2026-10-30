import { Mission } from "../missions.interface";

export interface ReportRequest{
    mission: Mission
    description: string;
    photo?: File;
}