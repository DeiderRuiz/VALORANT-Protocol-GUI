import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, output } from '@angular/core';
import { environment } from '@environments/environment';
import { Agent } from 'src/app/features/private/interfaces/agents/agents.interface';
import { SecondaryIconButton } from "src/app/shared/components/secondary-icon-button/secondary-icon-button";
import { TertiaryIconButton } from "src/app/shared/components/tertiary-icon-button/tertiary-icon-button";

@Component({
  selector: 'app-selected-agent-banner',
  imports: [SecondaryIconButton, TertiaryIconButton],
  templateUrl: './selected-agent-banner.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectedAgentBanner {
  @Input() agente: Agent | null = null;
  @Input() isLeader: boolean = false;
  @Input() index = 0;

  lider = output<Agent>();
  removeAgent = output<Agent>();

  // Ruta par amostrar imagenes que viene del backend
  storageUrl = environment.storageUrl;

  // Emitir al padre el agente seleccionado como lider
  elegirLider(agente: Agent){
    let agenteLider = agente;
    this.lider.emit(agenteLider);
  }

  // Emitir al padre el agente removido dela lista de seleccionados
  onRemoveAgent(agente: Agent){
    this.removeAgent.emit(agente);
  }
}
