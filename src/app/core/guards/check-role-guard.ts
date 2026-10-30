import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from 'src/app/features/auth/services/auth-service';

// Para proteger rutas del acceso de usuarios con roles no permitidos
export const checkRoleGuard: CanMatchFn = (route, segments) => {
  let authService = inject(AuthService);
  let ruta = inject(Router);
  
  // Rol del usuario
  let userRole = authService.userRole();
  // Roles permitidos
  let allowedRoles: string[] = route.data?.['roles'] as string[];

  if (!allowedRoles.includes(userRole)) {
    return ruta.parseUrl('/dashboard');
  }
  return true;
};
