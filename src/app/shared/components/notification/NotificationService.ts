import { Injectable, signal } from "@angular/core";
import { Notification, NotificationType } from "./notification.model.ts";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly _notification = signal<Notification | null>(null);

  readonly Notification = this._notification.asReadonly();

  private timeoutId?: ReturnType<typeof setTimeout>;

  show(
    message: string,
    type: NotificationType,
    duration = 2000
  ) {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this._notification.set({
      message,
      type
    });

    this.timeoutId = setTimeout(() => {
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
    this._notification.set(null);

    if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
    }
  }
}
