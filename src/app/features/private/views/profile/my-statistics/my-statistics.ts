import { Component, inject, signal } from '@angular/core';
import { Header } from "../../../components/shared/header/header";
import { AgentStats } from "../../../components/agents/agent-stats/agent-stats";
import { environment } from '@environments/environment';
import { BreadcrumbService } from '../../../services/breadcrumb-service';
import { ProfileService } from '../../../services/profile-service';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { AgentsService } from '../../../services/agents-service';
import { StatisticsService } from '../../../services/statistics-service';
import { Statistics } from '../../../interfaces/statistics/statistics.interface';
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-my-statistics',
  imports: [Header, AgentStats, Loader],
  templateUrl: './my-statistics.html',
  styles: ``,
})
export default class MyStatistics {
  profileService = inject(ProfileService);
  authService = inject(AuthService);
  agentsService = inject(AgentsService);

  statistics = this.profileService.statistics;
  isLoading = this.profileService.isStatisticsLoading;
  slug = signal<string>("");

  storageUrl = environment.storageUrl;

  perfil = this.profileService.profile;

  ngOnInit() {
    this.profileService.getProfile().subscribe();
    this.profileService.getStatistics().subscribe();
  }
}
