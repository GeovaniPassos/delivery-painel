import { Component, signal } from '@angular/core';
import { Layout } from './layout/layout/layout';

@Component({
  imports: [Layout],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('delivery-painel');
}
