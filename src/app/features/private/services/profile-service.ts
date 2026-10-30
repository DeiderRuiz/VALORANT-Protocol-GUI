import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Agent } from '../interfaces/agents/agents.interface';
import { Statistics } from '../interfaces/statistics/statistics.interface';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);

  // Perfil del logeado
  private _profile = signal<Agent | null>(null);
  private _isProfileLoading = signal(true);
  profile = this._profile;
  isProfileLoading = this._isProfileLoading;

  // Perfil del logeado
  private _statistics = signal<Statistics | null>(null);
  private _isStatisticsLoading = signal(true);
  statistics = this._statistics;
  isStatisticsLoading = this._isStatisticsLoading;

  getProfile(forceRefresh = false){
    // Usar datos cacheados si existen y no se está forzando refresh
    if (this._profile() !== null && !forceRefresh) {
      return of(this._profile()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._profile() === null) {
      this._isProfileLoading.set(true);
    }

    return this.http.get<Agent>(`${environment.apiUrl}/profile`).pipe(
      tap(agente => {
        // Actualiza el estado de agentes y desactiva el loading
        this._profile.set(agente);
        this._isProfileLoading.set(false);
      })
    );
  }

  getStatistics(forceRefresh = false){
    if (this._statistics() !== null && !forceRefresh) {
      return of(this._statistics()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._statistics() === null) {
      this._isStatisticsLoading.set(true);
    }

    return this.http.get<Statistics>(`${environment.apiUrl}/profile/statistics`).pipe(
      tap(stats => {
        // Actualiza el estado de agentes y desactiva el loading
        this._statistics.set(stats);
        this._isStatisticsLoading.set(false);
      })
    );
  }
}
