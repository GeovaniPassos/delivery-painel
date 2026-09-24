import { Component, inject } from '@angular/core';
import { NotificationService } from './NotificationService';

@Component({
  imports: [],
  selector: 'app-notification',
  styleUrl: './notification.scss',
  templateUrl: './notification.html',
})
export class Notification {

  notificationService = inject(NotificationService);

}
