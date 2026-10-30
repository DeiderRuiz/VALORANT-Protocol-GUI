import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  imports: [RouterLink],
  templateUrl: './dashboard-card.html',
  styles: ``,
})
export class DashboardCard {
  @Input() titulo:string = "";
  @Input() ruta:string = "";
}
