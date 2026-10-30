import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DashboardService } from '../../services/dashboard-service';
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { environment } from '@environments/environment';
import { DashboardCard } from "../../components/dashboard-card/dashboard-card";
import { StatusLabelPipe } from '../../pipes/status-label-pipe';
import { DashboardData } from '../../interfaces/dashboard/dashboard-data.interface';
import { interval, Subscription } from 'rxjs';
import { Loader } from "../../components/shared/loader/loader";

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, StatusLabelPipe, DashboardCard, Loader],
  templateUrl: './dashboard.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Dashboard {
  authService = inject(AuthService);
  dashboardService = inject(DashboardService);

  private refreshInterval?: Subscription;

  // Para obtener ruta de imagenes en la API
  storageUrl = environment.storageUrl;
  // Slug para la ruta hacia el perfil
  slug = this.authService.user().slug

  isLoading = this.dashboardService.loading;
  dashboardData = this.dashboardService.data;
  error = this.dashboardService.error;

  // Determinar si el rol del usuario esAdmin o Assistant
  isAdminOrAssistant = computed(() => {
    const role = this.authService.userRole();
    return role === 'admin' || role === 'assistant';
  });

  ngOnInit() {
    // Obtener los datos del dashboard
    this.loadDashboardData();

    // Refrescar la info cada segundos
    this.refreshInterval = interval(15000).subscribe(() => {
      this.refreshDashboardData();
    });
  }

  // Detener la actualización periódica al destruir el componente
  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
  }

  loadDashboardData(){
    this.dashboardService.getDashboardData().subscribe();
  }

  refreshDashboardData(){
    this.dashboardService.getDashboardData(true).subscribe();
  }
}
