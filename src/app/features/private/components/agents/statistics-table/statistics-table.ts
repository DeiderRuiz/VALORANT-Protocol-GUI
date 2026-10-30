import { Component, Input } from '@angular/core';
import { StatisticsItem } from '../../../interfaces/statistics/statistics.interface';

@Component({
  selector: 'app-statistics-table',
  imports: [],
  templateUrl: './statistics-table.html',
  styles: ``,
})
export class StatisticsTable {
  @Input() item: string = "";
  @Input() statistics: StatisticsItem[] = [];
}
