import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MissionsService } from '../../../services/missions-service';
import { MissionTable } from '../../../components/missions/mission-table/mission-table';
import { Header } from '../../../components/shared/header/header';
import { interval, Subscription } from 'rxjs';
import { MapsService } from '../../../services/maps-service';
import { AgentsService } from '../../../services/agents-service';
import { MissionSearch } from '../../../interfaces/missions/mission-search.interface';
import { Loader } from "../../../components/shared/loader/loader";
import { Pagination } from '../../../components/shared/pagination/pagination';
import { MissionSearchBar } from '../../../components/missions/mission-search-bar/mission-search-bar';

@Component({
  selector: 'app-missions',
  imports: [MissionTable, ReactiveFormsModule, Header, Loader, Pagination, MissionSearchBar],
  templateUrl: './missions.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Missions {
  missionService = inject(MissionsService);
  mapService = inject(MapsService);
  agentsService = inject(AgentsService);
  fb = inject(FormBuilder);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  private refreshInterval?: Subscription;

  missions = this.missionService.missions;
  pagination = this.missionService.pagination;
  isLoading = this.missionService.isLoadingMissions;
  missionTypes = this.missionService.tiposMisiones;

  searchParams = signal<MissionSearch | null>(null);

  ngOnInit() {
    // Obtener los datos de las misiones según los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      const page = Number(params['page'] ?? 1);
  
      // Comprobar si hay parámetros relacionados con la búsqueda
      const hasSearchParams = [
        'term',
        'priority',
        'statement',
        'result',
        'type_id'
      ].some(param => params[param] !== undefined && params[param] !== '');

      if (hasSearchParams) {
        // Obtener datos de búsqueda desde los parámetros
        const data: MissionSearch = {
          term: params['term'],
          priority: this.toArray(params['priority']),
          statement: this.toArray(params['statement']),
          result: this.toArray(params['result']),
          type_id: this.toArrayNumber(params['type_id'])
        };
        // Cargar misiones usando los parámetros de búsqueda       
        this.missionService.searchMissions(data, page).subscribe(() => {
          this.searchParams.set(data);
        });
      } else {
        this.missionService.getMissions(true, page).subscribe();
      }
    });
  
    // Precargar datos necesarios para el formulario de crear misión
    this.missionService.getMissionTypes().subscribe();
    this.mapService.getMaps().subscribe();
    this.agentsService.getAgents().subscribe();
  
    this.refreshInterval = interval(15000).subscribe(() => {
      this.missionService.getMissions(true, this.pagination().currentPage).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
  }

  // Poner en array de strings los parametros de busqueda tipo strings obtenidos
  toArray(value: string | string[] | null | undefined): string[] {
    if (!value) { return []; }
    return Array.isArray(value) ? value : [value];
  }

  // Poner en array de numbers los parametros de busqueda tipo number obtenidos 
  // cada parametro de type_id viene como number
  toArrayNumber(value: string | string[] | undefined): number[] {
    if (!value) return [];
    const values = Array.isArray(value) ? value : [value];
    return values.map(Number);
}

  //Buscar misiones
  onSearchMission(data: MissionSearch){
    // Agregar los filtros de busqueda como parametros en la URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        term: data.term || null,
        priority: data.priority?.length ? data.priority : null,
        statement: data.statement?.length ? data.statement : null,
        result: data.result?.length ? data.result : null,
        type_id: data.type_id?.length ? data.type_id : null
      }
    });
    
    this.missionService.searchMissions(data).subscribe({
      error: (err) => {
        console.log(err);
      }
    });
  }

  onChangePage(page: number){
    if (page < 1 || page > this.pagination().lastPage) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }
}
