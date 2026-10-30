import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { Agent } from '../../../../interfaces/agents/agents.interface';
import { MissionsService } from '../../../../services/missions-service';
import { Header } from "src/app/features/private/components/shared/header/header";
import { environment } from '@environments/environment';
import { MissionDraft } from 'src/app/features/private/interfaces/missions/mission-draft.interface';
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { MapsService } from 'src/app/features/private/services/maps-service';
import { MissionAgentsForm } from "../../shared/components/mission-agents-form/mission-agents-form";
import { MissionAgents, MissionDetails } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { ToastsService } from 'src/app/features/private/services/toasts-service';
import { Loader } from "src/app/features/private/components/shared/loader/loader";

@Component({
  selector: 'app-select-agents',
  imports: [ReactiveFormsModule, Header, MissionAgentsForm, Loader],
  templateUrl: './select-agents.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class SelectAgents {
  /* fb = inject(FormBuilder); */
  agentsService = inject(AgentsService);
  mapService = inject(MapsService);
  missionService = inject(MissionsService);
  ruta = inject(Router);
  toastsService = inject(ToastsService);

  /* storageUrl = environment.storageUrl; */

  agentes = this.agentsService.agentsAndStats;
  isLoading = this.agentsService.isLoadingAgentsAndStats;

  errorMessage = signal("");
  agentePreseleccionado = signal<Agent | null>(null);
  agentesSeleccionados = signal<(Agent | null)[]>([ null, null, null, null, null ]);

  missioDetails = signal<MissionDetails | null>(null)

  // Obtener la lista de agentes
  ngOnInit() {
    // Precargar tipos de misión y mapas (para el caso que el usuario regrese al paso anterior)
    this.missionService.getMissionTypes().subscribe();
    this.mapService.getMaps().subscribe();
    // Obtener los datos del primer paso para
    const savedData = sessionStorage.getItem("mission_builder");
    if (savedData) {
      this.missioDetails.set(JSON.parse(savedData) as MissionDetails);
    }
    /* Usar el mapa y el tipo de misión guardados en saveData 
    para traer las estadisticas necesarias
    Nota: cuando no hay datos en el mission_builder el guard 
    MissionDraftExistsGuard te redirige automaticamente al primer paso */
    if (this.agentsService.agentsAndStats === null) {
      this.agentsService.getAgentsWithStats(
        this.missioDetails()!.map_id, this.missioDetails()!.type_id
      ).subscribe();
    } else {
      this.agentsService.getAgentsWithStats(
        this.missioDetails()!.map_id, this.missioDetails()!.type_id, true
      ).subscribe();
    }
  }

  setMissionAgents(agents: MissionAgents) {
    // Guardar los agentes en el session storage y combinaros con lso datos del paso 1
    this.missionService.setMission(agents);
    this.submitMission();
  }

  // Hacer petición http para guardar la misión en DB
  submitMission(){
    this.missionService.newMission().subscribe({
      next: (response) => {
        this.ruta.navigateByUrl('/misiones/'+response.mission.code);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
      }
    })
  }
}
