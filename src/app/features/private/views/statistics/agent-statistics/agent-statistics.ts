import { Component, inject, signal } from '@angular/core';
import { AgentsService } from '../../../services/agents-service';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { ActivatedRoute } from '@angular/router';
import { StatisticsService } from '../../../services/statistics-service';
import { Statistics } from '../../../interfaces/statistics/statistics.interface';
import { Header } from "../../../components/shared/header/header";
import { AgentStats } from "../../../components/agents/agent-stats/agent-stats";
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-agent-statistics',
  imports: [Header, AgentStats, Loader],
  templateUrl: './agent-statistics.html',
  styles: ``,
})
export default class AgentStatistics {
  agentsService = inject(AgentsService);
  statisticsService = inject(StatisticsService);
  route = inject(ActivatedRoute);

  agent = signal<Agent | null>(null);

  statistics = signal<Statistics | null>(null);
  isLoading = signal(true);
  slug = signal<string>("");

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.slug.set(params.get('agente')!);
    });

    this.agentsService.getAgent(this.slug()).subscribe(
      response => {
        this.agent.set(response);
      }
    )

    this.statisticsService.getAgentStatistics(this.slug()).subscribe(
      respuesta => {
        this.statistics.set(respuesta);
        this.isLoading.set(false);
      }
    );
  }
}
