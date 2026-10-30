import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Auth, AuthResponse, ResetPasswordRequest, User } from '../interfaces/auth.interfaces';
import { environment } from '@environments/environment';
import { DashboardService } from '../../private/services/dashboard-service';
import { MissionsService } from '../../private/services/missions-service';
import { Router } from '@angular/router';
import { NotificationsService } from '../../private/services/notifications-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  ruta = inject(Router);
  dashboardService = inject(DashboardService);
  missionService = inject(MissionsService);
  notificationsService = inject(NotificationsService);

  // Señal con los datos del usuario logeado
  user = signal<User>({
    uuid: "",
    email: "",
    id: -1,
    name: "",
    slug: "",
    role: ""
  });

  userRole = computed(() => this.user()?.role);
  username = computed(() => this.user()?.slug);
  userid = computed(() => this.user()?.id);

  login(email:string, password:string){
    let credenciales: Auth = {
      email: email,
      password: password
    }
    // Retornar los datos del usuario logeado
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        if (res.ok === true) {
          // Guardar en localStorage el token de la sesión
          localStorage.setItem('token', res.token!);
          this.user.set(res.user!);
        }
      })
    );
  }

  // Renovar el token y obtener los datos de la sesión
  renew(): Observable<boolean>{
    return this.http.post<AuthResponse>(`${environment.apiUrl}/renew`, null).pipe(
      tap(res => {
        if (res.ok) {
          // Guardar en localStorage el token de la sesión
          localStorage.setItem('token', res.token!);
          this.user.set(res.user!);
        }
      }),
      map(res => res.ok),
      catchError(() => of(false))
    );
  }

  logout(){
    return this.http.post<boolean>(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Limpiar los datos de la sesión (token, usuario y otros datos sensibles)
        localStorage.removeItem('token');
        this.ruta.navigateByUrl('/');
        this.user.set({
          uuid: "",
          email: "",
          id: -1,
          name: "",
          slug: "",
          role: ""
        });
        this.dashboardService.clearDashboard();
        this.missionService.clearMissions();
        this.notificationsService.clearNotifications();
      }),
      catchError(() => {
        // Limpiar los datos de la sesión (token, usuario y otros datos sensibles)
        localStorage.removeItem('token');
        this.ruta.navigateByUrl('/');
        this.user.set({
          uuid: "",
          email: "",
          id: -1,
          name: "",
          slug: "",
          role: ""
        });
        this.dashboardService.clearDashboard();
        this.missionService.clearMissions();
        this.notificationsService.clearNotifications();
        return of(false);
      })
    );
  }

  // Solicitar token para cambio de contraseña
  forgotPassword (email:string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/forgot-password`, {email});
  }

  // Restablecer contraseña
  resetPassword (data: ResetPasswordRequest) {
    return this.http.patch<{ message: string }>(`${environment.apiUrl}/reset-password`, data);
  }
}
