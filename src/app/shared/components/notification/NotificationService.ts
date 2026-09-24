import { Injectable, signal } from "@angular/core";
import { Notification, NotificationType } from "./notification.model.ts";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = signal<Notification | null>(null);

  show(message: string, type: NotificationType, duration = 2000) {
    this.notification.set({
      message,
      type
    });

    setTimeout(() => {
    this.hide();
    }, duration);
  }

  success(message: string) {
  this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  hide() {
    this.notification.set(null);
  }
}
