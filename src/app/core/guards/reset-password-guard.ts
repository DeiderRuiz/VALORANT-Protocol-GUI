import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// PARA LA RUTA "reset-password": Comprueba que haya un parametro "token"
export const resetPasswordGuard: CanActivateFn = (route, state) => {
  let ruta = inject(Router);

  const token = route.queryParamMap.get('token');

  if (!token) {
    return ruta.parseUrl('/');
  } else {
    return true;
  }
};
