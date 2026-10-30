import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, signal, output, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameMap } from 'src/app/features/private/interfaces/maps/maps.interface';
import { MissionType } from 'src/app/features/private/interfaces/missions/mission-type.interface';
import { MissionsService } from 'src/app/features/private/services/missions-service';
import { InputComponent } from "src/app/shared/components/input-component/input-component";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { InputDatetimeComponent } from "src/app/shared/components/input-datetime-component/input-datetime-component";
import { SelectComponent } from "src/app/shared/components/select-component/select-component";
import { MapSelectorButton } from "../../../new-mission/components/map-selector-button/map-selector-button";
import { MissionDetails } from 'src/app/features/private/interfaces/missions/mission-request.interface';
import { Mission } from '../../../../../interfaces/missions/missions.interface';
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";

@Component({
  selector: 'app-mission-details-form',
  imports: [ReactiveFormsModule, InputComponent, TextareaComponent, InputDatetimeComponent, SelectComponent, MapSelectorButton, SecondaryButton, PrimaryButton],
  templateUrl: './mission-details-form.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// COMPONENTE PARA CREAR O ACTUALIZAR UNA MISIÓN
export class MissionDetailsForm {
  fb = inject(FormBuilder);
  ruta = inject(Router);
  missionService = inject(MissionsService);

  @Input() misionDetails: Mission | MissionDetails | null = null;
  @Input() missionTypes: MissionType[] = [];
  @Input() maps: GameMap[] = [];
  @Input() isUpdating: boolean = false;
  @Input() backendErrors: Record<string, string[]> = {};

  setMissionDetails = output<MissionDetails>();
  cancel = output<boolean>();

  // Erroes
  errorMessage = signal("");

  // Modal
  modalOpened = signal<boolean>(false);

  // Reglas de validación para el formulario
  missionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    objective: ['', [Validators.required, Validators.maxLength(1000)]],
    description: ['', [Validators.required, Validators.maxLength(3000)]],
    deadline: ['', [Validators.required]],
    type_id: [null, [Validators.required]],
    priority: [null, [Validators.required]],
    map_id: [null, [Validators.required]],
  });

  ngOnInit(): void {
    // Rellena los campos del formulario con los datos de la misión a actualizar
    const savedData = sessionStorage.getItem("mission_builder");
    if (savedData && this.isUpdating === false) {
      this.missionForm.patchValue(JSON.parse(savedData));
      console.log(JSON.parse(savedData));
    }

    if (this.misionDetails !== null && this.isUpdating === true) {
      this.missionForm.patchValue(this.misionDetails);
    }
  }

  // Obtener errores de vaidación desde el backend
    getBackendError(field: string): string | null {
      return this.backendErrors[field]?.[0] ?? null;
    }
  
    // Asignar el valor de un mapa seleccionado para el formulario
    seleccionarMapa(mapa: GameMap) {
      this.missionForm.patchValue({
        map_id: mapa.id
      });
    }
    // Retorna Booleano si el mapa fue seleccionado (Para estilos de mapa seleccionado)
    isSelected(nombre: string):boolean {
      return this.missionForm.value.map_id === this.maps?.find(mapa => mapa.name === nombre)?.id;
    }
  
    onCancel() {
      this.cancel.emit(this.missionForm.dirty);
    }
  
    setMission() {
      // Marcar como tocados todos los campos si alguna regla de validación falla
      if (this.missionForm.invalid) {
        this.missionForm.markAllAsTouched();
        return;
      }

      this.setMissionDetails.emit({
        title: this.missionForm.value.title,
        objective: this.missionForm.value.objective,
        description: this.missionForm.value.description,
        deadline: this.missionForm.value.deadline,
        type_id: this.missionForm.value.type_id,
        priority: this.missionForm.value.priority,
        map_id: this.missionForm.value.map_id,
      })
    }
}
