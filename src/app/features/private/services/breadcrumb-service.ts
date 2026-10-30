import { Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Breadcrumb } from '../interfaces/breadcrumbs.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(private router: Router, private activatedRoute: ActivatedRoute){
    this.breadcrumbs.set(
      this.createBreadcrumbs(this.router.routerState.root)
    );
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbs.set(this.createBreadcrumbs(this.activatedRoute.root));
    } )
  }

  /* Crear breadcrumbs a partir de la ruta activa */
  createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    for (const child of route.children) {
      // Obtener datos de las rutas hijas
      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      const label = child.snapshot.data['breadcrumb'];
      const params = child.snapshot.params;
      const paramValue = Object.values(params)[0] as string;
      const useParam = child.snapshot.data['breadcrumbFromParam'];
      if (routeURL) {
        url += `/${routeURL}`;
        if (label) {
          /* 
              Cuando data['breadcrumbFromParam'] de una ruta sea true, 
              usa como texto del breadcrumb el valor del primer parametro, 
              si es false, usa el valor establecido en data['breadcrumb']
           */
          if (useParam) {
            breadcrumbs.push({ label: paramValue, url: url });
          }else{
            breadcrumbs.push({ label, url });
          }
        }
      }
      /* Vuelve a ejecutarse para recorrer todo el arbol de rutas */
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    /* 
        Cuando llega al final del arbol de rutas retorna un breadcrumb 
        con las etiquetas y urls correspondientes
     */
    return breadcrumbs;
  }
}
