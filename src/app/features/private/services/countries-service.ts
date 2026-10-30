import { inject, Injectable, signal } from '@angular/core';
import { Country } from '../interfaces/external/rest-country.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  http = inject(HttpClient);

  private storageKey = 'agent_builder';

  // Guardar paises en el caché
  _countries = signal<Country[]>([]);
  _isLoadingCountries = signal<boolean>(true);
  countries = this._countries;
  isLoadingCountries = this._isLoadingCountries;

  getCountries(){
    // cargar los paises guardados en caché (si existen)
    if (!this._isLoadingCountries()) {
      return of(this._countries());
    }
    this._isLoadingCountries.set(true);

    return this.http.get<Country[]>(`${environment.apiUrl}/countries`).pipe(
      tap(countries => {
        this._countries.set(countries);
        this._isLoadingCountries.set(false);
      })
    );
  }
}
