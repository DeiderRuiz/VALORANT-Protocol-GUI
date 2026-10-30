import { Agent } from "./agents.interface";

export interface AgentResponse {
  message: string;
  agent: Partial<Agent>;
}