import { Component, input, output } from '@angular/core';
import { ModalType } from '../../../enums/modal-type.enum';
import { NgClass } from '@angular/common';

@Component({
  imports: [NgClass],
  selector: 'app-generic-modal',
  styleUrl: './generic-modal.scss',
  templateUrl: './generic-modal.html',
})
export class GenericModal {
  type = input.required<ModalType>();
  title = input<string>();
  isOpen = input<boolean>(false);

  confirm = output<void>();
  cancel = output<void>();

  protected readonly ModalType = ModalType;

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
