export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  message: string,
  type: NotificationType;
}
