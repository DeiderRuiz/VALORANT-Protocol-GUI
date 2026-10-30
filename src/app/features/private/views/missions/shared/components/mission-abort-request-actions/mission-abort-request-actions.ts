import { Component, computed, inject, Input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { Modal } from "src/app/shared/components/modal/modal";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { MissionAbortRequest } from 'src/app/features/private/interfaces/missions/abort/mission-abort.interface';

@Component({
  selector: 'app-mission-abort-request-actions',
  imports: [PrimaryButton, ReactiveFormsModule, SecondaryButton, Modal, TextareaComponent],
  templateUrl: './mission-abort-request-actions.html',
  styles: ``,
})
/* COMPONENTE PARA RESPONDER SOLICITUDES DE ABORTO */
export class MissionAbortRequestActions {
  fb = inject(FormBuilder);

  @Input() mision: Mission | null = null;
  @Input() isAbortRequestSent: boolean = false;
  @Input() backendErrors: Record<string, string[]> = {};

  reportAbortMissionRequest = output<MissionAbortRequest>();

  modalOpened = signal<boolean>(false);
  selectedValue = signal<string | number | boolean | null>(null);
  

  // Titulo del modal segun como se quiera responder la solicitud de aborto
  modalTitle = computed(() => {
    const type = this.abortRequestForm.get('type')?.value;

    switch (type) {
      case 'abort_approved':
        return 'Aprobar Solicitud de Aborto';

       case 'abort_rejected':
        return 'Rechazar Solicitud de Aborto';

      default:
        return 'Responder Solicitud de Aborto';
    }
  });

  modalButton = computed(() => {
    const type = this.abortRequestForm.get('type')?.value;

    switch (type) {
      case 'abort_approved':
        return 'Aprobar Solicitud';

       case 'abort_rejected':
        return 'Rechazar Solicitud';

      default:
        return 'Responder Solicitud';
    }
  });

  abortRequestForm: FormGroup = this.fb.group({
    type: [null, [Validators.required]],
    details: ['', [Validators.required, Validators.maxLength(3000)]],
  });

  // Abrir modal con text area para detalles adicionales 
  // una vez se haya seleccionaod una respuesta
  openModal(abortResponse: string){
    this.abortRequestForm.patchValue({
      type: abortResponse
    });
    this.modalOpened.set(true);
  }

  // Enviar solicitud de aborto de misión
  respondAbortRequest(mission: Mission) {
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.abortRequestForm.invalid) {
      this.abortRequestForm.markAllAsTouched();
      return;
    }
    // Emitir los datos para enviar el reporte de misión
    this.reportAbortMissionRequest.emit({
      mission: mission,
      body: {
        type: this.abortRequestForm.value.type,
        details: this.abortRequestForm.value.details,
      }
    })
  }

  //Detecta cambios (Si el reporte se envía, cierra el modal)
  ngOnChanges() {
    if (this.isAbortRequestSent) {
      this.modalOpened.set(false);
      this.abortRequestForm.reset();
    }
  }

  // Obtener errores de vaidación desde el backend
  getBackendError(field: string): string | null {
    return this.backendErrors[field]?.[0] ?? null;
  }
}
