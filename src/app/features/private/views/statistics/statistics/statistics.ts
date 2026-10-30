import { Component, inject } from '@angular/core';
import { Header } from "../../../components/shared/header/header";
import { StatisticsService } from '../../../services/statistics-service';
import { interval, Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { StatisticsTable } from "../../../components/agents/statistics-table/statistics-table";
import { Loader } from "../../../components/shared/loader/loader";

@Component({
  selector: 'app-statistics',
  imports: [Header, StatisticsTable, Loader],
  templateUrl: './statistics.html',
  styles: ``,
})
export default class Statistics {
  statisticsService = inject(StatisticsService);
  private refreshInterval?: Subscription;

  statistics = this.statisticsService.data;
  isLoading = this.statisticsService.loading;

  ngOnInit(): void {
    this.statisticsService.getStatistics().subscribe();

    this.refreshInterval = interval(15000).subscribe(() => {
      this.statisticsService.getStatistics(true).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
  }
}
