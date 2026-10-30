import { Component, Input } from '@angular/core';
import { Mission } from '../../../interfaces/missions/missions.interface';
import { DatePipe } from '@angular/common';
import { environment } from '@environments/environment';
import { TertiaryIconButton } from "src/app/shared/components/tertiary-icon-button/tertiary-icon-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mission-sidebar',
  imports: [DatePipe, TertiaryIconButton, RouterLink],
  templateUrl: './mission-sidebar.html',
  styles: ``,
})
export class MissionSidebar {
  @Input() mission: Mission | null = null;
  @Input() isAdminOrAssistant: boolean = false;
  @Input() isLeader: boolean = false;

  // Ruta de imagenes provenientes del backend
  storageUrl = environment.storageUrl;
}
