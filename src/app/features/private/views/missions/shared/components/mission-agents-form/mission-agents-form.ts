import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { Agent, AgentAndStats } from 'src/app/features/private/interfaces/agents/agents.interface';
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { MissionsService } from 'src/app/features/private/services/missions-service';
import { AgentSelectorButton } from "../../../new-mission/components/agent-selector-button/agent-selector-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { SelectedAgentBanner } from "../../../new-mission/components/selected-agent-banner/selected-agent-banner";
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { MissionAgents } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";

@Component({
  selector: 'app-mission-agents-form',
  imports: [ReactiveFormsModule, PrimaryButton, SelectedAgentBanner, AgentSelectorButton, SecondaryButton, RouterLink],
  templateUrl: './mission-agents-form.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// COMPONENTE PARA ASIGNAR AGENTES AL CREAR O EDITAR UNA MISIÓN
export class MissionAgentsForm {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  agentsService = inject(AgentsService);
  missionService = inject(MissionsService);

  @Input() mission: Mission | null = null;
  @Input() agents: AgentAndStats[] = [];
  @Input() submitText: string = "Crear Misión";
  @Input() cancelText: string = "Atras";
  @Input() cancelURL: string = "/misiones/nueva-mision";

  // Emitir los agentes seleccionados
  setAgentsMission = output<MissionAgents>();

  storageUrl = environment.storageUrl;

  errorMessage = signal("");
  // Visualiza un agente y sus estadisticas
  agentePreseleccionado = signal<AgentAndStats | null>(null);
  // Lista de 5 agentes que serán asignados a la misión
  agentesSeleccionados = signal<(Agent | null)[]>([ null, null, null, null, null ]);

  // Form Group que valida la selección de agentes (5 exactos)
  selectAgentsForm: FormGroup = this.fb.group({
    agents: this.fb.control<number[]>([], [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5)
    ]),
    leader_id: this.fb.control<number | null>(null, [
      Validators.required
    ])
  });

  ngOnInit() {
    // Cuando se edita una misión, rellena la lista de agentes seleccionados, 
    // con los agentes que fueron asignados al momento de crearse la misión
    if (this.mission?.agents.length === 5) {
      this.selectAgentsForm.patchValue({
        agents: this.mission.agents.map(agent => agent.id),
        leader_id: this.mission.leader_id
      });

      this.agentesSeleccionados.set([...this.mission.agents]);
    }
  }

  // Agregar el nuevo agente al array agentesSeleccionados()
  seleccionarAgente(agente: Agent){
    const current = this.agentesSeleccionados();
    // Omite agentes que ya están en el array
     const agentExists = current.some(agent => agent?.id === agente.id);
     if (agentExists) {
      return;
    }
    
    // Buscar el primer null en el array
    const emptyIndex = current.findIndex(agent => agent === null);

    if (emptyIndex !== -1) {
      // Agregar el agente preseleccionado a la lista de seleccionados
      current[emptyIndex] = agente;
      this.agentesSeleccionados.set([...current]);
      // Establecer como null el agente preseleccionado
      this.agentePreseleccionado.set(null);

      // ACTUALIZAR FORM GROUP
      const ids = this.agentesSeleccionados()
        .filter(agente => agente !== null)
        .map(agente => agente!.id);

      this.selectAgentsForm.patchValue({
        agents: ids
      });
    }
  }

  removerAgente(agente: Agent){
    const current = this.agentesSeleccionados();
    
    // Omite agentes que no están en el array
    const agentExists = current.some(agent => agent?.id === agente.id);
    if (!agentExists) {
      return;
    }

    // Rellenar con null los espacios que dejan los 
    // agentes removidos hasta llegar a 5 items
    const agentes = current.filter(agent => agent?.id !== agente.id);
    while (agentes.length < 5) {
      agentes.push(null);
    }      
    this.agentesSeleccionados.set(agentes);

    // ACTUALIZAR FORM GROUP
    const ids = this.agentesSeleccionados()
      .filter(agente => agente !== null)
      .map(agente => agente!.id);

    this.selectAgentsForm.patchValue({
      agents: ids
    });

    // Si el agente lider fue removido de los agentes eleccionados, 
    // se borra si Id del formGroup
    if (agente.id === this.selectAgentsForm.value.leader_id) {
      this.selectAgentsForm.patchValue({
        leader_id: null
      });
    }
  }

  // PARA LOS ESTILOS DE TARGETAS DE AGENTES
  // Valida si un agente ya ha sido agregado al array agentesSeleccionados()
  isSelected(id: number):boolean {
    return this.agentesSeleccionados().some(agente => agente?.id === id);
  }

  // Valida si un agente se puede seleccionar
  isSelectable(agent: Agent): boolean {
    // Si estamos creando, los no disponibles no se pueden seleccionar
    if (!this.mission) {
      return false;
    }

    // En edición, permitir los agentes ya asignados a esta misión
    return this.mission.agents.some(
      missionAgent => missionAgent.id === agent.id
    );
  }

  // Valida que ya no hayan objetos null en el array agentesSeleccionados()
  isSpaceAvailable() {
    return this.agentesSeleccionados().some(
      agente => agente === null
    );
  }
  
  // Para el componente SelectedAgentBanner
  isLeader(agente: Agent | null): boolean {
    return this.selectAgentsForm.value.leader_id === agente?.id;
  }

  // Establecer como lider un agente del array agentesSeleccionados()
  seleccionarLeader(agente: Agent) {
    this.selectAgentsForm.patchValue({
      leader_id: agente.id
    });
  }

  // Guardar los agetes seleccionados y el lider en SessionStorage
  setMissionAgents() {
    if (this.selectAgentsForm.invalid) {
      this.selectAgentsForm.markAllAsTouched();
      return;
    }
    this.setAgentsMission.emit(this.selectAgentsForm.value);
  }
}
