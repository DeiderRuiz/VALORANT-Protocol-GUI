import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth-service';

/* PARA LA RUTA "perfil/:user": Comprueba que el slug en el parametro 
sea igual al del usuario autenticado */
export const userExistsGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  let ruta = inject(Router);

  // Nombre de usuario Autenticado en slug
  let currentUsername = authService.username();
  // Parametro de la ruta en slug
  const usernameParam = route.paramMap.get('user');

  if (!currentUsername) {
    return ruta.parseUrl('/');
  }

  if (usernameParam !== currentUsername) {
    return ruta.parseUrl('/dashboard');
  }

  return true;
};
