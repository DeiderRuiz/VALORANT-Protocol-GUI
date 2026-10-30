import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { of, tap } from 'rxjs';
import { GameMap, MapResponse } from '../interfaces/maps/maps.interface';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  http = inject(HttpClient);

  // Guardar mapas (Temporalmente)
  private _mapas = signal<GameMap[] | null>(null);
  private _isLoading = signal<boolean>(true);
  mapas = this._mapas;
  loadingMaps = this._isLoading;

  //Solicitar los mapas
  getMaps(forceRefresh = false){
    if (this._mapas() !== null && !forceRefresh) {
      return of(this._mapas()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._mapas() === null) {
      this._isLoading.set(true);
    }

    return this.http.get<GameMap[]>(`${environment.apiUrl}/maps`).pipe(
      tap(
        mapas => {
          // Guardar lo obtenido
          this._mapas.set(mapas),
          this._isLoading.set(false)
        }
      )
    );
  }

  // Borrar los mapas del almacemaniento temporal
  clearMaps(){
    this._mapas.set([]);
  }

  // Nuevo mapa
  newMap(mapData: FormData){
    return this.http.post<MapResponse>(`${environment.apiUrl}/maps`, mapData)
  }

  updateMap(mapData: FormData, mapa: GameMap){
    return this.http.post<MapResponse>(`${environment.apiUrl}/maps/${mapa.id}`, mapData);
  }
}
