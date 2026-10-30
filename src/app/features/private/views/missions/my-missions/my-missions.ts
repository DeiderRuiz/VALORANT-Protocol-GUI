import { Component, inject, signal } from '@angular/core';
import { MissionsService } from '../../../services/missions-service';
import { Mission } from '../../../interfaces/missions/missions.interface';
import { MissionTable } from '../../../components/missions/mission-table/mission-table';
import { Header } from '../../../components/shared/header/header';
import { interval, Subscription } from 'rxjs';
import { Loader } from "../../../components/shared/loader/loader";
import { Pagination } from '../../../components/shared/pagination/pagination';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-my-missions',
  imports: [MissionTable, Header, Loader, Pagination],
  templateUrl: './my-missions.html',
  styles: ``,
})
export default class MyMissions {
  missionService = inject(MissionsService);
  router = inject(Router);
  private route = inject(ActivatedRoute);

  private refreshInterval?: Subscription;

  missions = this.missionService.myMissions;
  pagination = this.missionService.myMissionsPaginated;
  isLoading = this.missionService.isLoadingMyMissions;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const page = Number(params['page'] ?? 1);
      this.missionService.getMyMissions(true, page).subscribe();
    });

    this.refreshInterval = interval(15000).subscribe(() => {
      this.missionService.getMyMissions(true, this.pagination().currentPage).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
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
