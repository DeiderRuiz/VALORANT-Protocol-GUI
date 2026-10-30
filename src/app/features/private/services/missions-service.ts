import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Mission } from '../interfaces/missions/missions.interface';
import { MissionDraft } from '../interfaces/missions/mission-draft.interface';
import { MissionType } from '../interfaces/missions/mission-type.interface';
import { MissionResponse } from '../interfaces/missions/mission-response.interface';
import { MissionOutcome } from '../interfaces/missions/outcomes/mission-outcomes.interface';
import { MissionAgents, MissionDetails } from '../interfaces/missions/mission-request.interface';
import { MissionSearch } from '../interfaces/missions/mission-search.interface';
import { AgentsService } from './agents-service';
import { UpdateMissionStatusRequest } from '../interfaces/missions/status/mission-status-update.interface';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  http = inject(HttpClient);
  agentsService = inject(AgentsService);

  // CACHÉ TEMPORAL EN MEMORIA
  // misiones(general)
  private _missions = signal<PaginatedResponse<Mission> | null>(null);
  private _isLoadingMissions = signal<boolean>(true);
  missions = computed(() => this._missions()?.data ?? []);
  pagination = computed(() => {
    const response = this._missions();
    
    return {
      currentPage: response?.current_page ?? 1,
      lastPage: response?.last_page ?? 1,
      total: response?.total ?? 0,
      perPage: response?.per_page ?? 10,
      from: response?.from ?? 0,
      to: response?.to ?? 0
    };
  });
  isLoadingMissions = this._isLoadingMissions;

  // Mis misiones
  private _myMissions = signal<PaginatedResponse<Mission> | null>(null);
  private _isLoadingMyMissions = signal<boolean>(true);
  myMissions = computed(() => this._myMissions()?.data ?? []);
  myMissionsPaginated = computed(() => {
    const response = this._myMissions();
    
    return {
      currentPage: response?.current_page ?? 1,
      lastPage: response?.last_page ?? 1,
      total: response?.total ?? 0,
      perPage: response?.per_page ?? 10,
      from: response?.from ?? 0,
      to: response?.to ?? 0
    };
  });
  isLoadingMyMissions = this._isLoadingMyMissions;

  // detalles de misión
  private _missionDetails = signal<Mission | null>(null);
  private _isLoadingMissionDetails = signal<boolean>(true);
  missionDetails = this._missionDetails;
  isLoadingMissionDetails = this._isLoadingMissionDetails;

  // Tipos de misiones
  private _tiposMisiones = signal<MissionType[]>([]);
  private _isLoadingTypes = signal<boolean>(true);
  tiposMisiones = this._tiposMisiones;
  isLoadingTypes = this._isLoadingTypes;

  // Busqueda Activa
  private _searchActive = signal<boolean>(false);

  //Key para el SessionStorage
  private storageKey = 'mission_builder';

  // Solicitar las misiones (En General)
  getMissions(forceRefresh = false, page: number = 1): Observable<PaginatedResponse<Mission>> {
    // Usar caché cuando no se solicita refresh
    if ((this._missions() !== null && !forceRefresh && page === this._missions()!.current_page) || this._searchActive() === true) {
      return of(this._missions()!);
    }

    // SOLO mostrar loading si no hay datos en memoria
    if (this._missions() === null) {
      this.isLoadingMissions.set(true);
    }

    return this.http.get<PaginatedResponse<Mission>>(`${environment.apiUrl}/missions?page=${page}`).pipe(
      tap(data => {
        // Se guardan los datos obtenidos
        this._missions.set(data);
        this._isLoadingMissions.set(false);
      })
    );
  }

  // Obtener datos de una misión en especifico
  getMission(code: string, forceRefresh = false){
    if (this._missionDetails()?.code === code && !forceRefresh) {
      return of(this._missionDetails()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._missionDetails() === null || this._missionDetails()?.code !== code) {
      this._isLoadingMissionDetails.set(true);
    }
    
    return this.http.get<Mission>(`${environment.apiUrl}/missions/${code}`).pipe(
      tap(mission => {
        // Actualiza el estado de agentes y desactiva el loading
        this._missionDetails.set(mission);
        this._isLoadingMissionDetails.set(false);
      })
    );
  }

  // Obtener las misiones donde estuvo el agente logeado
  getMyMissions(forceRefresh = false, page: number = 1): Observable<PaginatedResponse<Mission>> {
    /* if (this._myMissions() !== null && !forceRefresh) {
      return of(this._myMissions()!);
    } */
    if (this._myMissions() !== null && !forceRefresh && page === this._myMissions()!.current_page) {
      return of(this._myMissions()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._myMissions() === null) {
      this.isLoadingMyMissions.set(true);
    }
    
    return this.http.get<PaginatedResponse<Mission>>(`${environment.apiUrl}/my-missions?page=${page}`).pipe(
      tap(data => {
        // Se guardan los datos obtenidos
        this._myMissions.set(data);
        this._isLoadingMyMissions.set(false);
      })
    );
  }

  // Buscar misiones
  searchMissions(data: MissionSearch, page: number = 1): Observable<PaginatedResponse<Mission>> {
    let params = new HttpParams()
    if (data.term) {
      params = params.set('term', data.term)
    }
    data.priority?.forEach(priority => {
      params = params.append('priority[]', priority);
    });
    data.statement?.forEach(statement => {
      params = params.append('statement[]', statement);
    });
    data.result?.forEach(result => {
      params = params.append('result[]', result);
    });
    data.type_id?.forEach(type_id => {
      params = params.append('type_id[]', type_id);
    });

    return this.http.get<PaginatedResponse<Mission>>(`${environment.apiUrl}/missions/search?page=${page}`, {params}).pipe(
      tap(data => {
        // Se guardan los datos obtenidos
        this._searchActive.set(true);
        this._missions.set(data);
        this._isLoadingMissions.set(false);
      })
    );
  }

  // Limpiar busqueda
  clearSearch(){
    this._searchActive.set(false);
    this._missions.set(null);
  }

  // Validar los datos del formulario con el backend (antes de guardarlos en session storage)
  validateMissionStepOne(data: MissionDetails){
    return this.http.post(`${environment.apiUrl}/missions/validate`, data).pipe(
      tap(reponse => {
        // Guardar en SesionStorage los datos de la nueva misión
        const missionData: Partial<MissionDraft> = data;
        this.setMission(missionData);
      }),
      switchMap(() => {
        // Cargar los agentes y sus estadisticas para vsualizarlos en la selección de agentes
        return this.agentsService.getAgentsWithStats(data.map_id, data.type_id);
      })
    );
  }

  // Crear una nueva misión
  newMission(){
    // Obtener el borrador de misión y tratarlo como tipo MissionDraft
    let mission = this.getMissionDraft() as MissionDraft;

    return this.http.post<MissionResponse>(`${environment.apiUrl}/missions`, mission).pipe(
      tap(res => {
        if (res) {
          // Eliminar el borrador de misión
          sessionStorage.removeItem(this.storageKey);
        }
      })
    );
  }

  // Cambiar el estado de una misión
  changeMissionStatus(requestData: UpdateMissionStatusRequest){
    return this.http.patch<MissionResponse>(
      `${environment.apiUrl}/missions/${requestData.mission.code}/status`, 
      {statement:requestData.statement}
    );
  }

  // Resolver misión (completarla y marcarla como exitosa o fallida)
  resolveMission(mission: Mission, request: MissionOutcome){
    return this.http.patch<MissionResponse>(`${environment.apiUrl}/missions/${mission.code}/resolve`, request);
  }

  // Solicitar los tipos de misiones
  getMissionTypes(){
    // Cargar los datos guardados (si existen)
    if (!this._isLoadingTypes()) {
      return of(this._tiposMisiones());
    }
    this._isLoadingTypes.set(true);

    return this.http.get<MissionType[]>(`${environment.apiUrl}/missions/types`).pipe(
      tap(tiposMisiones => {
        // Se guarda lo obtenido
        this._tiposMisiones.set(tiposMisiones);
        this._isLoadingTypes.set(false);
      })
    );
  }
  
  // Guardar datos de nueva misión en SessionStorage
  setMission(mission: Partial<MissionDraft>){
    // Obtener borrador de nueva misión
    const current = this.getMissionDraft();
    // Fusionar el borrador ya guardado (Si existe) con los nuevos datos
    const merged = { ...current, ...mission };
    // Guardar todo en SessionStorage
    sessionStorage.setItem(this.storageKey, JSON.stringify(merged));
  }

  // Actualizar detalles de misión
  updateMissionDetails(mission: Mission, details: MissionDetails){
    return this.http.patch<MissionResponse>(`${environment.apiUrl}/missions/${mission.code}/details`, details).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._missionDetails.set(response.mission);
        this._isLoadingMissionDetails.set(false);
      })
    );
  }

  // Reasignar agentes
  updateMissionAgents(mission: Mission, agents: MissionAgents){
    return this.http.patch<MissionResponse>(`${environment.apiUrl}/missions/${mission.code}/agents`, agents).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._missionDetails.set(response.mission);
        this._isLoadingMissionDetails.set(false);
      })
    );
  }

  // Obtener el borrador de nueva misión guardado en SesionStorage
  getMissionDraft(): Partial<MissionDraft>{
    const stored = sessionStorage.getItem(this.storageKey);
    //Retornar los datos, si no hay nada un objeto vacío
    return stored ? JSON.parse(stored) : {};
  }

  // Validar si en SessionStorage hay un borrador (Para el Guard)
  hasMissionDraft(): boolean {
    return !!sessionStorage.getItem(this.storageKey);
  }

  // mission.service.ts
  updateMissionCache(mission: Mission) {
    this._missionDetails.set(mission);
  }

  // Limpiar los datos del misiones y mis misiones
  clearMissions() {
    this._missions.set(null);
    this._myMissions.set(null);
  }
}
