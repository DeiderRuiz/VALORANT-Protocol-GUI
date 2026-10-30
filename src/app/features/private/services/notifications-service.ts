import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Notification, NotificationPivot } from '../interfaces/notifications/notifications.interface';
import { environment } from '@environments/environment';
import { of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  http = inject(HttpClient);

  // Guardar los datos del usuario (Temporalmente)
  private _notifications = signal<Notification[] | null>(null);
  private _isLoading = signal<boolean>(true);

  notifications = this._notifications;
  loading = this._isLoading

  // OBtener  las notificaciones
  getNotifications(forceRefresh = false){
    if (this._notifications() !== null && !forceRefresh) {
      return of(this._notifications()!);
    }
    
    // SOLO mostrar loading si no hay datos
    if (this._notifications() === null) {
      this.loading.set(true);
    }

    return this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).pipe(
      tap(notifications => {
        // Se guardan los datos obtenidos
        this._notifications.set(notifications);
        this._isLoading.set(false);
      })
    );
  }

  // Marcar una notificación como leida
  readNotification(notificationPivot: NotificationPivot) {
    return this.http.patch<void>(`${environment.apiUrl}/notifications/${notificationPivot.id}/read`, {}).pipe(
      switchMap(() => this.getNotifications(true))
    );
  }

  // Limpiar notificaciones
  clearNotifications() {
    this._notifications.set(null);
    this._isLoading.set(true);
  }
}
