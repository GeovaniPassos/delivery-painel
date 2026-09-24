import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Notification } from './shared/components/notification/notification';

@Component({
  imports: [RouterOutlet, Notification],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('delivery-painel');
}
