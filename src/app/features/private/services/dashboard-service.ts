import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { DashboardData } from '../interfaces/dashboard/dashboard-data.interface';
import { environment } from '@environments/environment';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);
  // Guardar los datos del usuario (Temporalmente)
  private _dashboard = signal<DashboardData | null>(null);
  private _isLoading = signal<boolean>(true);

  data = this._dashboard;
  loading = this._isLoading
  error = signal<string | null>(null);

  // Solicitar los datos del dashboard
  getDashboardData(forceRefresh = false) {
    if (this._dashboard() !== null && !forceRefresh) {
      return of(this._dashboard()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._dashboard() === null) {
      this.loading.set(true);
    }

    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`).pipe(
      tap(data => {
        // Se guardan los datos obtenidos
        this._dashboard.set(data);
        this._isLoading.set(false);
      })
    );
  }

  // Limpiar los datos del dashboard
  clearDashboard() {
    this._dashboard.set(null);
  }
}
