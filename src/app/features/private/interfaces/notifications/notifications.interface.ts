import { Mission } from "../missions/missions.interface";

export interface Notification {
  id: number;
  mission_id: number;
  details: string;
  type: string;
  created_at: string;
  updated_at: string;
  mission: Mission
  pivot: NotificationPivot;
}

export interface NotificationPivot {
  id: number
  agent_id: number;
  notification_id: number;
  read: 1 | 0;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}