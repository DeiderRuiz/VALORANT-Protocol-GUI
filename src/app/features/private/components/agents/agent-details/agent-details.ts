import { Component, computed, inject, Input } from '@angular/core';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { environment } from '@environments/environment';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-agent-details',
  imports: [PrimaryButton, RouterLink],
  templateUrl: './agent-details.html',
  styles: ``,
})
export class AgentDetails {
  authService = inject(AuthService);

  @Input() agent: Agent | null = null;
  @Input() statsRoute: string = "/agentes/";

  // Ruta para imagenes provenientes del backend
  storageUrl = environment.storageUrl;

  isAdmin = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin';
  });

  isAdminOrAssistant = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin' || role === 'assistant';
  });

  isCurrentAgent = computed(() => {
    const currentUser = this.authService.username();
    return currentUser === this.agent?.slug;
  });
}
