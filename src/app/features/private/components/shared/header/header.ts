import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input } from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb-service';
import { Agent } from '../../../interfaces/agents/agents.interface';
import { RouterLink } from "@angular/router";
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Header {
  breadcrumbService = inject(BreadcrumbService);

  storageUrl = environment.storageUrl;

  @Input() agente: Agent | null = null;
  @Input() titulo: string = "";

  breadcrumbs = this.breadcrumbService.breadcrumbs;
}
