import { Component, inject, signal } from '@angular/core';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../../components/shared/header/header';
import { AgentsService } from '../../../services/agents-service';
import { AgentDetails } from "../../../components/agents/agent-details/agent-details";
import { CountriesService } from '../../../services/countries-service';
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-agent',
  imports: [Header, AgentDetails, Loader],
  templateUrl: './agent.html',
  styles: ``,
})
export default class AgentComponent  {
  agentsService = inject(AgentsService);
  countriesService= inject(CountriesService);
  route = inject(ActivatedRoute);
  ruta = inject(Router);

  agente = this.agentsService.agent;
  isLoading = this.agentsService.isAgentLoading;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.agentsService.getAgent(params.get('agente')!).subscribe({
        error: () => {
          this.ruta.navigateByUrl('/agentes');
        }
      });
  
      // Precargar datos necesarios para el formulario edición de agentes
      this.countriesService.getCountries().subscribe();
      this.agentsService.getAgentClasses().subscribe();
    });
  }
}
