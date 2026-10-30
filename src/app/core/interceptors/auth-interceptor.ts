import { HttpInterceptorFn } from '@angular/common/http';

// Intercepta las peticiones HTTP para agregar el token de autenticación en los headers
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token de la sesión que se mandará a la API por headers
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
