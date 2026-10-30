import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, Input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { MissionOutcomeRequest } from 'src/app/features/private/interfaces/missions/outcomes/mission-outcomes.interface';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";

@Component({
  selector: 'app-mission-report-actions',
  imports: [PrimaryButton, ReactiveFormsModule, SecondaryButton, TextareaComponent],
  templateUrl: './mission-report-actions.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
/* COMPONENTE PARA RESPONDER AL REPORTE Y CONCLUIR LA MISIÓN */
export class MissionReportActions {
  fb = inject(FormBuilder);

  @Input() mision: Mission | null = null;
  @Input() isResponseSent: boolean = false; // Validar que la respuesta al reporte fue enviada
  @Input() backendErrors: Record<string, string[]> = {};

  sendResolveMission = output<MissionOutcomeRequest>();

  resolveMissionForm: FormGroup = this.fb.group({
    result: [null, [Validators.required]],
    description: ['', [Validators.maxLength(3000)]],
  });

  selectedResult = signal<string>("");

  setResultMission(resultado: string){
    this.resolveMissionForm.patchValue({
      result: resultado
    });
    this.selectedResult.set(this.resolveMissionForm.value.result);
  }

  resolveMission(mission: Mission){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.resolveMissionForm.invalid) {
      this.resolveMissionForm.markAllAsTouched();
      return;
    }

    this.sendResolveMission.emit({
      mission: mission,
      outcome: {
        result: this.resolveMissionForm.value.result,
        description: this.resolveMissionForm.value.description
      }
    })
  }

  // Obtener errores de vaidación desde el backend
  getBackendError(field: string): string | null {
    return this.backendErrors[field]?.[0] ?? null;
  }
}
