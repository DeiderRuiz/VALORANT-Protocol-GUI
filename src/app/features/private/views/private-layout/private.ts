import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../components/shared/navbar/navbar';
import { SuccessToast } from "src/app/shared/components/success-toast/success-toast";
import { ErrorToast } from "src/app/shared/components/error-toast/error-toast";
import { NotificationsService } from '../../services/notifications-service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-private',
  imports: [RouterOutlet, Navbar, SuccessToast, ErrorToast],
  templateUrl: './private.html',
  styles: ``,
})
export default class Private {
  notificationsService = inject(NotificationsService);

  private refreshInterval?: Subscription;

  notifications = this.notificationsService.notifications;
  isLoading = this.notificationsService.loading;

  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe();

    this.refreshInterval = interval(15000).subscribe(() => {
      this.notificationsService.getNotifications(true).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.refreshInterval?.unsubscribe();
  }
}
