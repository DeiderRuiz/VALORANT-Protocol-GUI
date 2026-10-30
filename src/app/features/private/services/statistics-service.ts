import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Statistics } from '../interfaces/statistics/statistics.interface';
import { environment } from '@environments/environment';
import { of, tap } from 'rxjs';
import { Agent } from '../interfaces/agents/agents.interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  http = inject(HttpClient);

  private _statistics = signal<Statistics | null>(null);
  private _isLoading = signal<boolean>(true);

  data = this._statistics;
  loading = this._isLoading

  // Estadisticas generales
  getStatistics(forceRefresh = false){
    if (this._statistics() !== null && !forceRefresh) {
      return of(this._statistics()!);
    }    
    // SOLO mostrar loading si no hay datos
    if (this._statistics() === null) {
      this.loading.set(true);
    }

    return this.http.get<Statistics>(`${environment.apiUrl}/statistics`).pipe(
      tap(data => {
        // Se guardan los datos obtenidos
        this._statistics.set(data);
        this._isLoading.set(false);
      })
    );
  }

  // EStadisticas del agente solicitado
  getAgentStatistics(slug: string){
    return this.http.get<Statistics>(`${environment.apiUrl}/agents/${slug}/statistics`);
  }
}
