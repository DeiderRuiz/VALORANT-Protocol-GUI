import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Header } from '../../../components/shared/header/header';
import { environment } from '@environments/environment';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { AgentsService } from '../../../services/agents-service';
import { CountriesService } from '../../../services/countries-service';
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-agents',
  imports: [RouterLink, Header, PrimaryButton, Loader],
  templateUrl: './agents.html',
  styles: ``,
})
export default class Agents {
  authService = inject(AuthService);
  agentsService = inject(AgentsService);
  countriesService= inject(CountriesService);

  storageUrl = environment.storageUrl;
  
  isLoading = this.agentsService.isLoading;
  agentes = this.agentsService.agentes;

  isAdmin = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin';
  });

  ngOnInit() {
    if (this.agentes === null) {
      this.agentsService.getAgents().subscribe();
    } else {
      this.agentsService.getAgents(true).subscribe();
    }
    // Precargar datos necesarios para el formulario creación de agentes
      this.countriesService.getCountries().subscribe();
      this.agentsService.getAgentClasses().subscribe();
  }
}
