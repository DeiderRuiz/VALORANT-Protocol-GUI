import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { MissionsService } from 'src/app/features/private/services/missions-service';
import { MapsService } from 'src/app/features/private/services/maps-service';
import { GameMap } from 'src/app/features/private/interfaces/maps/maps.interface';
import { Header } from 'src/app/features/private/components/shared/header/header';
import { MissionDraft } from 'src/app/features/private/interfaces/missions/mission-draft.interface';
import { AgentsService } from 'src/app/features/private/services/agents-service';
import { MissionDetailsForm } from "../../shared/components/mission-details-form/mission-details-form";
import { MissionDetails } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { Modal } from "src/app/shared/components/modal/modal";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { ToastsService } from 'src/app/features/private/services/toasts-service';
import { Loader } from "src/app/features/private/components/shared/loader/loader";

@Component({
  selector: 'app-new-mission',
  imports: [ReactiveFormsModule, Header, MissionDetailsForm, Modal, SecondaryButton, PrimaryButton, Loader],
  templateUrl: './new-mission.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class NewMission {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  missionService = inject(MissionsService);
  mapService = inject(MapsService);
  agentsService = inject(AgentsService);
  toastsService = inject(ToastsService);

  // Tipos de Mision
  missionTypes = this.missionService.tiposMisiones;
  isLoadingMissionTypes = this.missionService.isLoadingTypes;

  // Mapas
  mapas = this.mapService.mapas;
  isLoadingMaps = this.mapService.loadingMaps;
  mapaSeleccionado = signal<GameMap | null>(null);

  missioDetails = signal<MissionDetails | null>(null);

  // Erroes
  errorMessage = signal("");
  validationErrors = signal<Record<string, string[]>>({});

  // Modal
  modalOpened = signal<boolean>(false);

  ngOnInit() {
    // Cargar los mapas y los tipos de misiones
    this.missionService.getMissionTypes().subscribe();
    this.mapService.getMaps().subscribe();
    // Precargar los agentes
    if (this.agentsService.agentes === null) {
      this.agentsService.getAgents().subscribe();
    } else {
      this.agentsService.getAgents(true).subscribe();
    }

    const savedData = sessionStorage.getItem("mission_builder");
    if (savedData) {
      this.missioDetails.set(JSON.parse(savedData) as MissionDetails);
    }
  }

  // Obtener errores de vaidación desde el backend
  getValidationError(field: string): string | null {
    return this.validationErrors()[field]?.[0] ?? null;
  }

  setMission(data: MissionDetails) {
    this.missionService.validateMissionStepOne(data).subscribe({
      next: (response) => {
        // Redirigir para seleccionar los agentes que harán la misión
        this.ruta.navigateByUrl('/misiones/nueva-mision/seleccionar-agentes');
      },
      error: err => {
        this.toastsService.showErrorMsg(err.error?.message);
        this.validationErrors.set(err.error?.errors ?? {});
      }
    });
  }
  
  // Mostrar dropdown para guardar información del formulario si algun campo 
  // tiene datos guardados o solo redirigir a "/misiones"
  hasDataToSave(hasData: boolean){
    if (hasData) {
      this.modalOpened.set(true);
    } else {
      this.ruta.navigateByUrl('/misiones');
    }
  }
  
  clearData(){
    sessionStorage.removeItem("mission_builder");
    this.ruta.navigateByUrl('/misiones');
  }
}
