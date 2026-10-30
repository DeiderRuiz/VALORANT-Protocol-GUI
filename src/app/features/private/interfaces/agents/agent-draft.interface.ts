import { User } from "src/app/features/auth/interfaces/auth.interfaces";
import { AgentClass } from "./classes/agent-class.interface";
import { Nationality } from "./nationalities/agent-nationalities.interface";

export interface AgentDraft {
    id:number;
    name: string;
    slug: string;
    bio:string;
    profile_photo: string;
    agent_photo: string;
    nationality_id?: number;
    class_id: number;
    available: number
    nationality?: Nationality;
    class: AgentClass;
    user: {
        id: number;
        email: string;
    };
}