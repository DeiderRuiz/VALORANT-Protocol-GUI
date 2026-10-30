import { Component, Input } from '@angular/core';
import { Statistics } from '../../../interfaces/statistics/statistics.interface';
import { StatisticsTable } from "../statistics-table/statistics-table";

@Component({
  selector: 'app-agent-stats',
  imports: [StatisticsTable],
  templateUrl: './agent-stats.html',
  styles: ``,
})
export class AgentStats {
  @Input() statistics: Statistics | null = null;
}
