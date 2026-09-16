import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Categories } from './categories/categories';

@Component({
  imports: [RouterOutlet, Categories],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('delivery-painel');
}
