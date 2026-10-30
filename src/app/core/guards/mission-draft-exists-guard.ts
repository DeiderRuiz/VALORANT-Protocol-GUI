import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MissionsService } from 'src/app/features/private/services/missions-service';

// PARA LA RUTA "seleccionar-agentes": Comprueba que haya una misión guardad en local storage
export const missionDraftExistsGuard: CanActivateFn = (route, state) => {
  const missionService = inject(MissionsService);
  const router = inject(Router);

  if (missionService.hasMissionDraft()) {
    return true;
  }

  return router.createUrlTree(['/misiones/nueva-mision']);
};
