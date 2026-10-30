import { Component, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { forkJoin, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Agent } from 'src/app/features/private/interfaces/agents/agents.interface';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { MissionsService } from 'src/app/features/private/services/missions-service';
import { Header } from "src/app/features/private/components/shared/header/header";
import { MissionAgents } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { MissionAgentsForm } from "../../shared/components/mission-agents-form/mission-agents-form";
import { Loader } from "src/app/features/private/components/shared/loader/loader";
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-update-mission-agents',
  imports: [Header, MissionAgentsForm, Loader],
  templateUrl: './update-mission-agents.html',
  styles: ``,
})
export default class UpdateMissionAgents {
  ruta = inject(Router);
  route = inject(ActivatedRoute);
  missionService = inject(MissionsService);
  authService = inject(AuthService);
  agentsService = inject(AgentsService);
  toastsService = inject(ToastsService);

  agentes = this.agentsService.agentsAndStats;
  isLoading = this.agentsService.isLoadingAgentsAndStats;

  mision = signal<Mission | null>(null);
  isLoadingMission = signal(true);

  code = signal<string>("");
  isLeader = signal<boolean>(false);

  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.code.set(params.get('mission')!);
    });

    this.missionService.getMission(this.code()).pipe(
      tap(mission => {
        this.mision.set(mission);
        
        if (mission.leader_id === this.authService.userid()) {
          this.isLeader.set(true);
        }

        this.isLoadingMission.set(false);
      }),
      switchMap(mission =>
        this.agentsService.getAgentsWithStats(
          mission.map_id,
          mission.type_id,
          true
        )
      )
    ).subscribe();
  }

  updateAgents(mission: Mission, agents: MissionAgents){
    this.missionService.updateMissionAgents(mission, agents).subscribe({
      next: (response) => {
        this.ruta.navigateByUrl('/misiones/'+response.mission.code);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      },
    });
  }

  // Obtener errores de vaidación desde el backend
  getValidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }
}
