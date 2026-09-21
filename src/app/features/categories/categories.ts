import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './service/category.service';
import { Category } from './model/category.model';
import { ModalType } from '../../shared/enums/modal-type.enum';
import { GenericModal } from '../../shared/components/modal/generic-modal/generic-modal';

@Component({
  imports: [GenericModal],
  selector: 'app-categories',
  styleUrl: './categories.scss',
  templateUrl: './categories.html',
})
export class Categories implements OnInit{
  private readonly categoryService = inject(CategoryService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly categoryToDelete = signal<Category | null>(null);

  protected readonly ModalType = ModalType;
  
  isModalOpen = signal(false);
  modalConfig = signal({ type: ModalType.CONFIRMATION, title: ''});

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
        this.error.set('Failed to load categories');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onAddCategory(): void {
    
  }

  askDeleteCategory(category: Category): void {
    this.categoryToDelete.set(category);
  }

  cancelDelete(): void {
    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    const category = this.categoryToDelete();

    if (!category) {
      return;
    }

    this.categoryToDelete.set(null);
    this.onDeleteCategory(category.id);
  }

  onDeleteCategory(categoryId: number): void {
    this.categoryService.delete(categoryId).subscribe({
      next: () => {
        // Remove the deleted category from the signal
        const updatedCategories = this.categories().filter(category => category.id !== categoryId);
        this.categories.set(updatedCategories);
      },
      error: (err) => {
        this.error.set('Failed to delete category');
        console.error(err);
      },
    });
  }

  openDeleteModal() {
    this.modalConfig.set({
      type: this.ModalType.DANGER,
      title: 'Atenção'
    });
    this.isModalOpen.set(true);
  }

  deletarCategory() {
    console.log('Categoria deletada');
  }
}
