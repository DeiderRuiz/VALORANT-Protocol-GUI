import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MissionsService } from './features/private/services/missions-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('valorant-agents-gui');
  router = inject(Router);
  missionsService = inject(MissionsService);

  constructor(){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(()=>{
      this.keepSearch();
    });
  }
  
  keepSearch(){
    if (this.router.url.startsWith('/misiones/nueva-mision')) {
      this.missionsService.clearSearch();
      return;
    }

    if (!this.router.url.startsWith('/misiones')) {
      this.missionsService.clearSearch();
    }
  }
}
