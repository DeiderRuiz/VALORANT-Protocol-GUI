import { NgClass } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-agent-selector-button',
  imports: [NgClass],
  templateUrl: './agent-selector-button.html',
  styles: ``,
})
export class AgentSelectorButton {
  @Input() urlImage: string = "";
  @Input() agentName: string = "";
  // Indica si el agente está disponible según su estado actual en la base de datos
  // Un agente no disponible está asignado a una misión que aún no ha finalizado
  @Input() isAgentAvailable: boolean = true;
  // Indica un agente seleccionado para ser asignado a la misión actual
  @Input() isSelected: boolean = false;
  // Indica si hay espacio disponible para seleccionar otro agente en la misión
  @Input() isSpaceAvailable: boolean = true;
  // Indica si el agente está asignado a la misión que se está mostrando
  @Input() isAssigned: boolean = false;

  seleccionar = output<void>();

  /* Bloquear agentes no disponibles que no hayan sido asignados 
  a la misión actual es decir, agentes que fueron asignados 
  a otras misiones que no han finalizado */
  get isBlocked(): boolean {
    return !this.isAgentAvailable && !this.isAssigned;
  }

  /* Bloquear agentes disponibles cuando se alcanzó el numero 
  maximo de agentes asignables a una misión */
  get isLockedByCapacity(): boolean {
    return !this.isSelected && !this.isSpaceAvailable;
  }

  /* Para clases interactivas en agentes que pueden 
  ser selecconados a la misión actual */
  get isInteractive(): boolean {
    return !this.isSelected && (this.isAgentAvailable || this.isAssigned);
  }

  // Emitir al padre el agente preseleccionado (si no ha sido sleccionado antes o está disponible)
  selectAgent() {
    if (!this.isSelected && this.isSpaceAvailable) {
      this.seleccionar.emit();
    }
  }
}
