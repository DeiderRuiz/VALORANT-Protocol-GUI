import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
})

/* Pipe para convertir los identificadores de estado de la API 
en etiquetas legibles para la interfaz */
export class StatusLabelPipe implements PipeTransform {

  transform(value: string): string {
    const labels: Record<string, string> = {

      // Estados de misión
      created: 'Creada',
      waiting_start: 'Esperando Inicio',
      in_progress: 'En Progreso',
      aborted: 'Abortada',
      waiting_validation: 'Esperando Validación',
      completed: 'Completada',

      // Resultados de misión
      success: 'Exitosa',
      failed: 'Fallida',

      // Eventos
      mission_created: 'Misión Creada',
      start_check: 'Solicitud de Inicio',
      mission_started: 'Misión Iniciada',
      abort_request: 'Solicitud de Aborto',
      abort_approved: 'Aborto Aprobado',
      abort_rejected: 'Solicitud de Aborto Rechazada',
      abort: 'Misión Abortada',
      report_submitted: 'Reporte Enviado',
      mission_completed: 'Misión Completada',

      // Notificaciones
      mission_created_deadline_warning: 'Fecha Límite Próxima',
      mission_waiting_start_deadline_warning: 'Inicio Pendiente',
      mission_validation_warning: 'Validación Pendiente',
      mission_aborted: 'Misión Abortada',
      mission_assigned: 'Misión Asignada',
      mission_unassigned: 'Misión Desasignada',
      mission_updated: 'Misión Actualizada',
    };

    return labels[value] || value;
  }

}
