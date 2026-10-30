import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ability } from '../interfaces/agents/abilities/agent-ability.interface';
import { environment } from '@environments/environment';
import { AgentResponse } from '../interfaces/agents/agent-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AbililtiesService {
  http = inject(HttpClient);

  // Crear habilidades del agente creado
  addAbilities(abilitiesArray: FormData, agentSlug: String){
    return this.http.post<AgentResponse>(
      `${environment.apiUrl}/agents/draft/${agentSlug}/abilities`, abilitiesArray
    );
  }

  updateAbility(ability: Ability, data: FormData){
    return this.http.post<AgentResponse>(
      `${environment.apiUrl}/agents/abilities/${ability.id}`, data
    );
  }
}
