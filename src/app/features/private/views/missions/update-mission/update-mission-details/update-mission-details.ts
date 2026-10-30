import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { MissionsService } from 'src/app/features/private/services/missions-service';
import { Header } from "src/app/features/private/components/shared/header/header";
import { MapsService } from 'src/app/features/private/services/maps-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameMap } from 'src/app/features/private/interfaces/maps/maps.interface';
import { MissionDraft } from 'src/app/features/private/interfaces/missions/mission-draft.interface';
import { forkJoin } from 'rxjs';
import { MissionDetailsForm } from "../../shared/components/mission-details-form/mission-details-form";
import { MissionDetails } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { Loader } from "src/app/features/private/components/shared/loader/loader";
import { ToastsService } from 'src/app/features/private/services/toasts-service';

@Component({
  selector: 'app-update-mission-details',
  imports: [Header, ReactiveFormsModule, MissionDetailsForm, Loader],
  templateUrl: './update-mission-details.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class UpdateMissionDetails {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  route = inject(ActivatedRoute);
  missionService = inject(MissionsService);
  authService = inject(AuthService);
  mapService = inject(MapsService);
  toastsService = inject(ToastsService);

  mision = signal<Mission | null>(null);
  isLoading = signal(true);
  code = signal<string>("");
  isLeader = signal<boolean>(false);

  // Tipos de Mision
  missionTypes = this.missionService.tiposMisiones;
  isLoadingMissionTypes = this.missionService.isLoadingTypes;

  // Mapas
  mapas = this.mapService.mapas;
  isLoadingMaps = this.mapService.loadingMaps;
  mapaSeleccionado = signal<GameMap | null>(null);

  // Erroes
  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  // Modal
  modalOpened = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.code.set(params.get('mission')!);
    });

    forkJoin({
      mission: this.missionService.getMission(this.code()),
      missionTypes: this.missionService.getMissionTypes(),
      maps: this.mapService.getMaps()
    }).subscribe({
      next: ({mission, missionTypes, maps}) => {
        this.mision.set(mission);
        this.isLoading.set(false);

        if ( this.mision()?.leader_id === this.authService.userid() ) {
          this.isLeader.set(true)
        }
      }
    });
  }

  // Obtener errores de vaidación desde el backend
  getBackendError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }


  setMission(mission: Mission, data: MissionDetails) {
    this.missionService.updateMissionDetails(mission, data).subscribe({
      next: (response) => {
        this.ruta.navigateByUrl('/misiones/'+response.mission.code);
        this.toastsService.showSuccessMsg(response.message);
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors || {});
      }
    });
  }

  onCancel(){
    this.ruta.navigateByUrl('/misiones/'+this.mision()?.code);
  }
}
