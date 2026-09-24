import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from './model/category.model';
import { ModalType } from '../../shared/enums/modal-type.enum';
import { GenericModal } from '../../shared/components/modal/confirmation-modal/generic-modal';
import { firstValueFrom } from 'rxjs';
import { FormModal } from '../../shared/components/modal/form-modal/form-modal';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCategoryDto } from './model/create-category.dto';
import { NonNullAssert } from '@angular/compiler';
import { NotificationService } from '../../shared/components/notification/NotificationService';
import { SystemMessages } from '../../shared/constants/system-message';
import { ResourceName } from '../../shared/enums/resource-name';
import { UpdateCategoryDto } from './model/update-category.dto';

@Component({
  imports: [GenericModal,
    FormModal,
    ReactiveFormsModule,
  ],
  selector: 'app-categories',
  styleUrl: './categories.scss',
  templateUrl: './categories.html',
})
export class Categories implements OnInit{
  private readonly categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  editingCategory = signal<Category | null>(null);

  protected categoryModalOpen = signal(false);

  protected readonly ModalType = ModalType;

  protected isModalOpen = signal(false);
  protected categoryToDelete = signal<number | null>(null);

  protected modalConfig = signal({
    type: ModalType.CONFIRMATION,
    title: '',
    message: '',
    showCancelButton: true
  });

  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
      Validators.required
      ]
    }),

    active: new FormControl(true, {
      nonNullable: true
    })
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err) => {
        this.notificationService.error(SystemMessages.loadError('a lista de categorias'));

        this.loading.set(false);
      },
    });
  }

  onAddCategory(): void {
    this.openCategoryModal();
  }

  openCategoryModal() {

    this.editingCategory.set(null);

    this.categoryForm.reset({
      name: '',
      active: true
    });

    this.categoryModalOpen.set(true);
  }

  openEditCategoryModal(category: Category) {
    this .editingCategory.set(category);

    this.categoryForm.setValue({
      name: category.name,
      active: category.active
    });

    this.categoryModalOpen.set(true);
  }

  closeCategoryModal() {
    this.categoryForm.reset();
    this.categoryModalOpen.set(false);
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (this.editingCategory()) {
      this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  updateCategory() {

    const category = this.editingCategory();

    if (!category) {
      return;
    }

    const dto: UpdateCategoryDto = {
      name: this.categoryForm.controls.name.value,
      active: this.categoryForm.controls.active.value
    };

    this.categoryService.update(category.id, dto)
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update(categories =>
            categories.map(category =>
              category.id === updatedCategory.id
              ? updatedCategory
              : category
            )
          );

          this.closeCategoryModal();

          this.notificationService.success(SystemMessages.updateSuccess('categoria'));
        },
        error: () => {
          this.notificationService.error(SystemMessages.updateError('a categoria'));
        }

      })

  }

  createCategory() {

    const formValue = this.categoryForm.getRawValue();

    const category: CreateCategoryDto = {
      name: formValue.name
    };

    this.categoryService.create(category)
      .subscribe({
        next: (response) => {
          this.categories.update(categories => [
            ...categories,
            response
          ]);

          this.closeCategoryModal();

          this.notificationService.success(SystemMessages.createSuccess('categoria'));

        },
        error: (error) => {
          this.notificationService.error(SystemMessages.createError('a categoria'));
        }
      });

  }

  onClickDeleteCategory(categoryId: number): void {
    this.categoryToDelete.set(categoryId);

    this.modalConfig.set({
      type: this.ModalType.DANGER,
      title: 'Atenção',
      message: SystemMessages.confirmationDelete('categoria'),
      showCancelButton: true
    });

    this.isModalOpen.set(true);
  }

  toggleCategoryStatus(id: number) {
    this.categoryService.toggleStatus(id)
      .subscribe({
      next: (response) => {
        this.notificationService.success(ResourceName.STATUS_SUCESS);
      },
      error: (error) => {
        this.notificationService.error(ResourceName.STATUS_FAILURE);
      }
    });
  }

  async onConfirmeModal() {
    const id = this.categoryToDelete();

    if (this.modalConfig().type === ModalType.SUCCESS) {
      this.isModalOpen.set(false);
      return;
    }

    if (!id) return;

    try {

      await firstValueFrom(this.categoryService.delete(id));

      this.modalConfig.set({
        type: this.ModalType.SUCCESS,
        title: 'Sucesso',
        message: SystemMessages.deleteSuccess('categoria'),
        showCancelButton: false
      });

      if (this.modalConfig().type === ModalType.SUCCESS) {
      this.loadCategories();
  }

    } catch (error) {
      this.modalConfig.set({
        type: this.ModalType.DANGER,
        title: 'Erro',
        message: SystemMessages.deleteError('a categoria'),
        showCancelButton: false
      });
    }
  }

  deletarCategory(categoryId: number): void {
    this.categoryService.delete(categoryId);
    this.isModalOpen.set(false);
  }
}
