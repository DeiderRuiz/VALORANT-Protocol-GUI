import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Mission } from '../../../interfaces/missions/missions.interface';
import { StatusLabelPipe } from '../../../pipes/status-label-pipe';

@Component({
  selector: 'app-mission-table',
  imports: [DatePipe, StatusLabelPipe, RouterLink],
  templateUrl: './mission-table.html',
  styles: ``,
})
export class MissionTable {
  @Input() misiones: Mission[] | null  = null;
  @Input() misionURL: string = "";
}
