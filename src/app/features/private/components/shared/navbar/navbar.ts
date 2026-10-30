import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, input, Input, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from 'src/app/features/auth/services/auth-service';
import { Notification, NotificationPivot } from '../../../interfaces/notifications/notifications.interface';
import { DatePipe, NgClass } from '@angular/common';
import { NotificationsService } from '../../../services/notifications-service';
import { StatusLabelPipe } from '../../../pipes/status-label-pipe';

@Component({
  selector: 'app-navbar',
  imports: [DatePipe, RouterLink, StatusLabelPipe, NgClass],
  templateUrl: './navbar.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Navbar {
  ruta = inject(Router);
  authService = inject(AuthService);
  notificationsService = inject(NotificationsService);

  notifications = input<Notification[] | null>(null);

  menuIsDown = signal<boolean>(false);
  notificationIsDown = signal<boolean>(false);

  hasUnreadNotifications = computed(() =>
    this.notifications()?.some(
        notification => !notification.pivot.read
    ) ?? false
  );

  private menu = viewChild<ElementRef>('menu');
  private bell = viewChild<ElementRef>('bell');

  /* Escuchar eventos click para cerrar dorpdown de los filtros 
  cuando se hace click fuera de el */
  @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const menuContainer = this.menu()?.nativeElement;
      if (!menuContainer) return;
      if (!menuContainer.contains(event.target)) {
          this.menuIsDown.set(false);
      }

      const notificationContainer = this.bell()?.nativeElement;
      if (!notificationContainer) return;
      if (!notificationContainer.contains(event.target)) {
          this.notificationIsDown.set(false);
      }
  }

  readNotification(notification: Notification) {
    console.log(notification.mission.code);
    this.ruta.navigateByUrl('/mis-misiones/'+notification.mission.code);
    this.notificationsService.readNotification(notification.pivot).subscribe({
      next: () => {
        console.log("Good");        
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.notificationIsDown.set(false);
  }

  logout(){
    this.authService.logout().subscribe();
  }
}
