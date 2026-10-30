import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { MissionsService } from 'src/app/features/private/services/missions-service';
import { Header } from "src/app/features/private/components/shared/header/header";
import { DatePipe } from '@angular/common';
import { ReportsService } from 'src/app/features/private/services/reports-service';
import { interval, Subscription } from 'rxjs';
import { MissionAbortRequest } from 'src/app/features/private/interfaces/missions/abort/mission-abort.interface';
import { AbortMissionService } from 'src/app/features/private/services/abort-mission-service';
import { UpdateMissionStatusRequest } from 'src/app/features/private/interfaces/missions/status/mission-status-update.interface';
import { ReportRequest } from 'src/app/features/private/interfaces/missions/reports/mission-report-request.interface';
import { MissionOutcomeRequest } from 'src/app/features/private/interfaces/missions/outcomes/mission-outcomes.interface';
import { MissionSidebar } from "src/app/features/private/components/missions/mission-sidebar/mission-sidebar";
import { StatusLabelPipe } from 'src/app/features/private/pipes/status-label-pipe';
import { MissionPrimaryActions } from "../components/mission-primary-actions/mission-primary-actions";
import { MissionAbortRequestActions } from "../components/mission-abort-request-actions/mission-abort-request-actions";
import { MissionReportActions } from "../components/mission-report-actions/mission-report-actions";
import { ToastsService } from 'src/app/features/private/services/toasts-service';
import { Loader } from "src/app/features/private/components/shared/loader/loader";

@Component({
  selector: 'app-mission-datail',
  imports: [
    Header, DatePipe, StatusLabelPipe, MissionSidebar, MissionPrimaryActions,
    MissionAbortRequestActions, MissionReportActions,
    Loader
],
  templateUrl: './mission-datail.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class MissionDatail {
  route = inject(ActivatedRoute);
  ruta = inject(Router);
  missionService = inject(MissionsService);
  authService = inject(AuthService);
  reportService = inject(ReportsService);
  abortMissionService = inject(AbortMissionService);
  toastsService = inject(ToastsService);

  // Ruta para mostrar imagenes que viene del backend
  storageUrl = environment.storageUrl;
  private refreshInterval?: Subscription;

  mision = this.missionService.missionDetails;
  isLoading = this.missionService.isLoadingMissionDetails;

  code = signal<string>("");
  reportSent = signal<boolean>(false);
  responseSent = signal<boolean>(false);
  abortRequestSent = signal<boolean>(false);

  redirectTo = signal<string>("");

  successMessage = signal("");
  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  abortEvents = computed(() =>
    this.mision()?.events
      ?.filter(event =>
        [
          'abort_request',
          'abort_approved',
          'abort_rejected',
          'abort'
        ].includes(event.type)
      ).reverse() ?? []
  );

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.redirectTo.set(data['redirectTo'] as string)
    });

    this.route.paramMap.subscribe(params => {
      this.code.set(params.get('mission')!);
      this.missionService.getMission(this.code()).subscribe({
        error : () => {
          this.ruta.navigateByUrl(this.redirectTo());
        }
      });
    })

    // Recargar cada 15 segundos para mantener la misión actualizada
    this.refreshInterval = interval(15000).subscribe(() => {
      this.missionService.getMission(this.code(), true).subscribe({
        error : () => {
          this.ruta.navigateByUrl(this.redirectTo());
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
  }

  isAdminOrAssistant = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin' || role === 'assistant';
  });

  isLeader = computed(() => {
    const userId = this.authService.userid();
    return userId === this.mision()?.leader_id;
  });

  // Para mostrar el bloque que contiene la solicitud de aborto 
  // si hay un evento de solicitud de aborto
  hasAbortRequest = computed(() => {
    const abortRequest = this.mision()?.events?.some(request => request.type === 'abort_request');
    return abortRequest;
  });

  // Recibe eventos para solicitar inicio de misión e iniciar la misión
  onUpdateMissionStatus(request: UpdateMissionStatusRequest){
    this.missionService.changeMissionStatus(request).subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
        this.mision.set(response.mission);
      },
      error: (err) => {        
        this.toastsService.showErrorMsg(err.error?.message);
      }
    })
  }

  // Recibe el reporte de misión que hace el lider
  onSendReportMission(request: ReportRequest){
    // Mandar los datos del formulario en formato multipart/form-data (obligatorio si mandas archivos)
    const formData = new FormData();
    formData.append('description', request.description);
    if (request.photo) {
      formData.append('photo', request.photo);
    }

    this.reportService.newReportMission(request.mission, formData).subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
        this.mision.set(response.mission);
        this.reportSent.set(true);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors ?? {});
      }
    })
  }

  // Recibe la respuesta al reporte de misión de parte del admin
  onSendResolveMission(request: MissionOutcomeRequest){
    this.missionService.resolveMission(request.mission, request.outcome).subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
        this.mision.set(response.mission);
        this.responseSent.set(true);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors ?? {});
      }
    })
  }

  // Recibe todos los eventos relacionados a abortar misiones
  onAbortMissionRequest(request: MissionAbortRequest){
    let request$;
    // Solicitud de aborto
    if (request.body.type === 'abort_request') {
      request$ = this.abortMissionService.requestAbort(
        request.mission,
        request.body
      );
    }

    // Aprobar solicitud de aborto
    if (request.body.type === 'abort_approved') {
      request$ = this.abortMissionService.approveAbort(
        request.mission,
        request.body
      );
    }

    // Rechzar solicitud de aborto
    if (request.body.type === 'abort_rejected') {
      request$ = this.abortMissionService.rejectAbort(
        request.mission,
        request.body
      );
    }

    // Abortar directamente
    if (request.body.type === 'abort') {
      request$ = this.abortMissionService.abortMissionDirectly(
        request.mission,
        request.body
      );
    }
    
    request$?.subscribe({
      next: (response) => {
        this.toastsService.showSuccessMsg(response.message);
        this.mision.set(response.mission);
        this.abortRequestSent.set(true);
      },
      error: (err) => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors ?? {});
      }
    });
  }
}
