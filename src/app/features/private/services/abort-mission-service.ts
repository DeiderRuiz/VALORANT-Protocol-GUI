import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Mission } from '../interfaces/missions/missions.interface';
import { MissionAbort } from '../interfaces/missions/abort/mission-abort.interface';
import { environment } from '@environments/environment';
import { MissionResponse } from '../interfaces/missions/mission-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AbortMissionService {
  http = inject(HttpClient);

  // Solicitar aborto
  requestAbort(mission: Mission, request: MissionAbort){
    return this.http.post<MissionResponse>(
      `${environment.apiUrl}/missions/${mission.code}/abort/request`, request
    );
  }

  // Aprobar solicitud de aborto
  approveAbort(mission: Mission, request: MissionAbort){
    return this.http.post<MissionResponse>(
      `${environment.apiUrl}/missions/${mission.code}/abort/approve`, request
    );
  }


  // Rechazar solicitud de aborto
  rejectAbort(mission: Mission, request: MissionAbort){
    return this.http.post<MissionResponse>(
      `${environment.apiUrl}/missions/${mission.code}/abort/reject`, request
    );
  }

  // Abortar misión de forma directa
  abortMissionDirectly(mission: Mission, request: MissionAbort){
    return this.http.post<MissionResponse>(
      `${environment.apiUrl}/missions/${mission.code}/abort`, request
    );
  }
}
