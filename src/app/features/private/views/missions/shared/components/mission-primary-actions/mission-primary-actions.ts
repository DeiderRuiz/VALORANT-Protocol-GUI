import { Component, inject, Input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MissionAbortRequest } from 'src/app/features/private/interfaces/missions/abort/mission-abort.interface';
import { Mission } from 'src/app/features/private/interfaces/missions/missions.interface';
import { ReportRequest } from 'src/app/features/private/interfaces/missions/reports/mission-report-request.interface';
import { UpdateMissionStatusRequest } from 'src/app/features/private/interfaces/missions/status/mission-status-update.interface';
import { PrimaryButton } from "src/app/shared/components/primary-button/primary-button";
import { SecondaryButton } from "src/app/shared/components/secondary-button/secondary-button";
import { TextareaComponent } from "src/app/shared/components/textarea-component/textarea-component";
import { InputImageComponent } from "src/app/shared/components/input-image-component/input-image-component";
import { Modal } from "src/app/shared/components/modal/modal";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mission-primary-actions',
  imports: [PrimaryButton, ReactiveFormsModule, SecondaryButton, TextareaComponent, InputImageComponent, Modal, RouterLink],
  templateUrl: './mission-primary-actions.html',
  styles: ``,
})
/* TODAS LAS ACCIONES QUE SE PUEDEN REALIZAR SOBRE LAS MISIONES
Y SE UBICAN EN EL CUERPO DE LA MISIÓN

Acciones que realiza el lider: Solicitar inicio de misión, 
solicitar aborto, abortar misión directamente, reporte de misión

Acciones administrativas: Iniciar misión, abortar misión, editar misión */
export class MissionPrimaryActions {
  fb = inject(FormBuilder);

  @Input() mision: Mission | null = null;
  @Input() isLeader: boolean = false;
  @Input() isAdminOrAssistant: boolean = false;
  @Input() isReportSent: boolean = false; // Validar si el reporte fue enviado
  @Input() isAbortRequestSent: boolean = false; // Validar si la solicitud de aborto fue enviada
  @Input() isAbortSent: boolean = false; // Validar si la misión fue abortada
  @Input() backendErrors: Record<string, string[]> = {}; // Obtener errores de validación del backend

  // Emitir actualización de estado de misión
  updateMissionStatus = output<UpdateMissionStatusRequest>();
  // Emitir petición de reporte de misión
  sendReportMission = output<ReportRequest>();
  abortMissionRequest = output<MissionAbortRequest>();

  // Abrir y cerrar modal
  reportModalOpened = signal<boolean>(false);
  abortRequestModalOpened = signal<boolean>(false);
  abortModalOpened = signal<boolean>(false);

  reportForm: FormGroup = this.fb.group({
    description: ['', [Validators.required]],
    photo: [null],
  });

  abortRequestForm: FormGroup = this.fb.group({
    details: ['', [Validators.required]],
  });

  // Solicitar inicio de misión
  startMissionRequest(mission: Mission){
    // Datos de la solicitud
    let requestData: UpdateMissionStatusRequest = {
      mission: mission,
      statement: "waiting_start",
    }
    // Emitir datos de la solicitud
    this.updateMissionStatus.emit(requestData);
  }

  // Iniciar misión
  startMission(mission: Mission){
    const requestData: UpdateMissionStatusRequest = {
      mission: mission,
      statement: "in_progress",
    }
    this.updateMissionStatus.emit(requestData);
  }

  // Enviar reorte de misión
  sendReport(mission: Mission){
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }
    // Emitir los datos para enviar el reporte de misión
    this.sendReportMission.emit({
      mission: mission,
      description: this.reportForm.value.description,
      photo: this.reportForm.value.photo
    })
  }

  // Enviar solicitud de aborto de misión
  sendAbortRequest(mission: Mission) {
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.abortRequestForm.invalid) {
      this.abortRequestForm.markAllAsTouched();
      return;
    }
    // Emitir los datos para enviar el reporte de misión
    this.abortMissionRequest.emit({
      mission: mission,
      body: {
        type: "abort_request",
        details: this.abortRequestForm.value.details,
      }
    })
  }

  // Abortar misión directamente
  abortMission(mission: Mission) {
    // Marcar como tocados todos los campos si alguna regla de validación falla
    if (this.abortRequestForm.invalid) {
      this.abortRequestForm.markAllAsTouched();
      return;
    }
    // Emitir los datos para enviar el reporte de misión
    this.abortMissionRequest.emit({
      mission: mission,
      body: {
        type: "abort",
        details: this.abortRequestForm.value.details,
      }
    })
  }

  // Si alguna petición se envía con exito detecta, el cambio, 
  // cierra el modal y reestablece los valores del formulario correspondiente
  ngOnChanges() {
    if (this.isReportSent) {
      this.reportModalOpened.set(false);
      this.reportForm.reset();
    }

    if (this.isAbortRequestSent) {
      this.abortRequestModalOpened.set(false);
      this.abortRequestForm.reset();
    }

    if (this.isAbortSent) {
      this.abortModalOpened.set(false);
      this.abortRequestForm.reset();
    }
  }

  // Obtener errores de vaidación desde el backend
  getBackendError(field: string): string | null {
    return this.backendErrors[field]?.[0] ?? null;
  }
}
