import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Mission } from '../interfaces/missions/missions.interface';
import { MissionResponse } from '../interfaces/missions/mission-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  http = inject(HttpClient);

  newReportMission(mission: Mission, request: FormData){
    return this.http.post<MissionResponse>(`${environment.apiUrl}/missions/${mission.code}/report`, request);
  }
}
