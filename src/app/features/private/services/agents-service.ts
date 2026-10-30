import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Agent, AgentAndStats } from '../interfaces/agents/agents.interface';
import { environment } from '@environments/environment';
import { of, tap } from 'rxjs';
import { AgentClass } from '../interfaces/agents/classes/agent-class.interface';
import { AgentResponse } from '../interfaces/agents/agent-response.interface';
import { AgentProfileRequest } from '../interfaces/agents/agent-request.interface';
import { AgentDraft } from '../interfaces/agents/agent-draft.interface';


@Injectable({
  providedIn: 'root',
})
export class AgentsService {
  http = inject(HttpClient);
  // ESTADOS REACTIVOS

  // Aagentes
  private _agentes = signal<Agent[] | null>(null);
  private _isLoading = signal(true);
  // Exposición pública del estado
  agentes = this._agentes;
  isLoading = this._isLoading;

  // Agentes borrador o preregistrados
  private _agentsDraft = signal<AgentDraft[] | null>(null);
  private _isLoadingAgentsDraft = signal(true);
  // Exposición pública del estado
  agentsDraft = this._agentsDraft;
  isLoadingAgentsDraft = this._isLoadingAgentsDraft;

  // Agente
  private _agent = signal<Agent | null>(null);
  private _isAgentLoading = signal(true);
  agent = this._agent;
  isAgentLoading = this._isAgentLoading;

  // Roles de agente
  _classes = signal<AgentClass[]>([]);
  _isLoadingClasses = signal<boolean>(true);
  classes = this._classes;
  isLoadingClasses = this._isLoadingClasses;

  // Agentes y sus estadisticas (para la selección de agentes de una misión)
  private _agentsAndStats = signal<AgentAndStats[] | null>(null);
  private _isLoadingAgentsAndStats = signal(true);
  agentsAndStats = this._agentsAndStats;
  isLoadingAgentsAndStats = this._isLoadingAgentsAndStats;

  // Obtener todos los agentes, excepto los guardados como borrador
  getAgents(forceRefresh = false){
    // Usar datos cacheados si existen y no se está forzando refresh
    if (this._agentes() !== null && !forceRefresh) {
      return of(this._agentes()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._agentes() === null) {
      this._isLoading.set(true);
    }

    return this.http.get<Agent[]>(`${environment.apiUrl}/agents`).pipe(
      tap(agentes => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agentes.set(agentes);
        this._isLoading.set(false);
      })
    );
  }

  // Obtener un agente
  getAgent(slug: string, forceRefresh = false){
    /* Usar datos cacheados los slug del agente que se pide y del agente 
    cacheado coindciden y no se está forzando refresh */
    if (this._agent()?.slug === slug && !forceRefresh) {
      return of(this._agent()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._agent() === null || this._agent()?.slug !== slug) {
      this._isAgentLoading.set(true);
    }

    return this.http.get<Agent>(`${environment.apiUrl}/agents/${slug}`).pipe(
      tap(agent => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agent.set(agent);
        this._isAgentLoading.set(false);
      })
    );
  }

  // Obtener agentes en borrador
  getAgentsDraft(){
    // cargar los agentes guardados (si existen)
    if (!this._isLoadingAgentsDraft()) {
      return of(this._agentsDraft());
    }
    this._isLoadingAgentsDraft.set(true);
    
    return this.http.get<AgentDraft[]>(`${environment.apiUrl}/agents/draft`).pipe(
      tap(agentsDraft => {
        // Guardar lo obtenido
        this._agentsDraft.set(agentsDraft);
        this._isLoadingAgentsDraft.set(false);
      })
    );
  }

  // Comprobar si un agente existe como borrador
  agentDraftExists(slug: string){
    return this.http.get<AgentDraft>(`${environment.apiUrl}/agents/draft/${slug}`)
  }

  // Obtener agentes y estadisticas
  getAgentsWithStats(map: number, missionType: number, forceRefresh = false){
    if (this._agentsAndStats() !== null && !forceRefresh) {
      return of(this._agentsAndStats()!);
    }

    // SOLO mostrar loading si no hay datos
    if (this._agentsAndStats() === null) {
      this._isLoadingAgentsAndStats.set(true);
    }
    
    return this.http.get<AgentAndStats[]>(`${environment.apiUrl}/agents/statistics/${map}/${missionType}`).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agentsAndStats.set(response);
        this._isLoadingAgentsAndStats.set(false);
      })
    );
  }

  // Crear un nuevo agente
  createDraftAgent(formAgent: FormData){
    return this.http.post<AgentResponse>(`${environment.apiUrl}/agents/draft`, formAgent);
  }

  // Actualizar un agente borrador
  updateDraftAgent(formAgent: FormData, agent: AgentDraft){
    return this.http.post<AgentResponse>(`${environment.apiUrl}/agents/draft/${agent.slug}`, formAgent);
  }

  // Actualizar datos del perfil del agente
  updateAgentProfile(agentSlug: Agent, data: AgentProfileRequest){
    return this.http.patch<AgentResponse>(
      `${environment.apiUrl}/agents/${agentSlug.id}`, data
    ).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agent.set(response.agent as Agent);
      })
    );
  }

  // Actualizar foto de perfil
  updateProfilePhoto(agentSlug: Agent, data: FormData){
    return this.http.post<AgentResponse>(
      `${environment.apiUrl}/agents/${agentSlug.id}/profile-photo`, data
    ).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agent.set(response.agent as Agent);
      })
    );
  }

  // Actualizar imagen del agente
  updateAgentPhoto(agentSlug: Agent, data: FormData){
    return this.http.post<AgentResponse>(
      `${environment.apiUrl}/agents/${agentSlug.id}/agent-photo`, data
    ).pipe(
      tap(response => {
        // Actualiza el estado de agentes y desactiva el loading
        this._agent.set(response.agent as Agent);
      })
    );
  }

  // Limpiar los agentes guardados
  clearAgentes() {
    this._agentes.set([]);
  }

  // Obtener las clases de los agentes (Duelista, Controlador, Centinela e Iniciador)
  getAgentClasses(){
    // cargar los agentes guardados (si existen)
    if (!this._isLoadingClasses()) {
      return of(this._classes());
    }
    this._isLoadingClasses.set(true);
    
    return this.http.get<AgentClass[]>(`${environment.apiUrl}/agents/classes`).pipe(
      tap(classes => {
        // Guardar lo obtenido
        this._classes.set(classes);
        this._isLoadingClasses.set(false);
      })
    );
  }
}
