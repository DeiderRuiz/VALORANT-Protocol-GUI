import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth-service';

// PARA TODAS LAS RUTAS PRIVADAS: Renueva el token y obtiene los datos de la sesión
export const validateTokenMatchGuard: CanMatchFn = (route, segments) => {
  let isAuth = inject(AuthService);
  let routeTo = inject(Router);
  
  return isAuth.renew().pipe(
    map(valid => {
      return valid ? true : routeTo.parseUrl('/');
    }),
    catchError(() => of(routeTo.parseUrl('/')))
  );
};
