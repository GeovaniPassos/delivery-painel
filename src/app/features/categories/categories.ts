import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from './service/category.service';
import { Category } from './model/category.model';
import { ModalType } from '../../shared/enums/modal-type.enum';
import { GenericModal } from '../../shared/components/modal/generic-modal/generic-modal';
import { firstValueFrom } from 'rxjs';

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

  protected readonly ModalType = ModalType;
  
  protected isModalOpen = signal(false);
  protected categoryToDelete = signal<number | null>(null);

  protected modalConfig = signal({ 
    type: ModalType.CONFIRMATION, 
    title: '',
    message: '',
    showCancelButton: true
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
        this.error.set('Failed to load categories');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  onAddCategory(): void {
  }

  onClickDeleteCategory(categoryId: number): void {
    this.categoryToDelete.set(categoryId);
    
    this.modalConfig.set({
      type: this.ModalType.DANGER,
      title: 'Atenção',
      message: 'Tem certeza que deseja excluir esta categoria?',
      showCancelButton: true
    });

    this.isModalOpen.set(true);
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
        message: 'Categoria excluída com sucesso!',
        showCancelButton: false
      });

      if (this.modalConfig().type === ModalType.SUCCESS) {
      this.loadCategories();
  }

    } catch (error) {
      this.modalConfig.set({
        type: this.ModalType.DANGER,
        title: 'Erro',
        message: 'Erro ao excluir categoria!',
        showCancelButton: false
      });
    }

  }

  deletarCategory(categoryId: number): void {
    this.categoryService.delete(categoryId);
    this.isModalOpen.set(false);
  }
}
