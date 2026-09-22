import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-form-modal',
  styleUrl: './form-modal.scss',
  templateUrl: './form-modal.html',
})
export class FormModal {
  title = input<string>();

  close = output<void>();

  onClose() {
    this.close.emit();
  }
}
