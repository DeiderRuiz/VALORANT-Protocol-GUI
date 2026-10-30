import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AgentsService } from 'src/app/features/private/services/agents-service';

/* Para el formulario que agrega habilidades a agentes en borrador. 
Busca si existe un agente en borrador con slug igual al parametrode la ruta */
export const agentDraftExistsGuard: CanActivateFn = (route, state) => {
  const agentsService = inject(AgentsService);
  const router = inject(Router);

  const slug = route.paramMap.get('agente');

  if (!slug) {
    return router.createUrlTree(['/agentes/nuevo-agente']);
  }

  // Redirigir a /agentes si no encuentra un agente con el slug del parametro
  return agentsService.agentDraftExists(slug).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/agentes/nuevo-agente'])))
  );
};
