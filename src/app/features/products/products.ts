import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { ProductService } from './product.service';
import { CreateProductDto, Product } from './model/product.model';
import { CategoryService } from '../categories/category.service';
import { Category } from '../categories/model/category.model';
import { FormModal } from '../../shared/components/modal/form-modal/form-modal';
import { GenericModal } from '../../shared/components/modal/confirmation-modal/generic-modal';
import { ModalType } from '../../shared/enums/modal-type.enum';
import { NotificationService } from '../../shared/components/notification/NotificationService';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, FormModal, GenericModal],
  selector: 'app-products', styleUrl: './products.scss', templateUrl: './products.html',
})
export class Products implements OnInit {
  private readonly service = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly notifications = inject(NotificationService);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly productToDelete = signal<Product | null>(null);
  readonly busyId = signal<number | null>(null);
  readonly ModalType = ModalType;
  readonly productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(120), Validators.pattern(/\S/)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(5000)] }),
    photo: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(2048), Validators.pattern(/^https?:\/\/\S+$/)] }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(99999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    promotionalPrice: new FormControl<number | null>(null, [Validators.min(0.01), Validators.max(99999999.99), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    categoryId: new FormControl<number | null>(null, Validators.required),
    available: new FormControl(true, { nonNullable: true }),
  }, { validators: control => {
    const { price, promotionalPrice } = control.value;
    return promotionalPrice != null && price != null && promotionalPrice >= price ? { promotion: true } : null;
  } });

  ngOnInit() { this.loadProducts(); }
  loadProducts() {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({ products: this.service.findAll(), categories: this.categoryService.findAll() })
      .pipe(finalize(() => this.loading.set(false))).subscribe({
        next: data => { this.products.set(data.products); this.categories.set(data.categories); },
        error: () => this.error.set('Não foi possível carregar os produtos e as categorias.'),
      });
  }
  openProductModal(product: Product | null = null) {
    this.editingProduct.set(product);
    this.productForm.reset(product ? { ...product, photo: product.photo ?? '' } : {
      name: '', description: '', photo: '', price: null, promotionalPrice: null, categoryId: null, available: true,
    });
    this.modalOpen.set(true);
  }
  closeProductModal() { if (!this.saving()) this.modalOpen.set(false); }
  saveProduct() {
    if (this.saving()) return;
    this.productForm.controls.name.setValue(this.productForm.controls.name.value.trim());
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const value = this.productForm.getRawValue();
    const dto: CreateProductDto = { ...value, photo: value.photo.trim() || null, price: value.price!, categoryId: value.categoryId! };
    const product = this.editingProduct();
    this.saving.set(true);
    (product ? this.service.update(product.id, dto) : this.service.create(dto))
      .pipe(finalize(() => this.saving.set(false))).subscribe({
        next: saved => {
          this.products.update(items => product ? items.map(item => item.id === saved.id ? saved : item) : [...items, saved]);
          this.modalOpen.set(false);
          this.notifications.success('Produto salvo com sucesso.');
        },
        error: err => this.showError(err, 'Não foi possível salvar o produto.'),
      });
  }
  toggleStatus(product: Product) {
    if (this.busyId() !== null) return;
    this.busyId.set(product.id);
    this.service.toggleStatus(product.id).pipe(finalize(() => this.busyId.set(null))).subscribe({
      next: saved => this.products.update(items => items.map(item => item.id === saved.id ? saved : item)),
      error: err => this.showError(err, 'Não foi possível alterar a disponibilidade.'),
    });
  }
  deleteProduct() {
    const product = this.productToDelete();
    if (!product || this.busyId() !== null) return;
    this.busyId.set(product.id);
    this.service.delete(product.id).pipe(finalize(() => this.busyId.set(null))).subscribe({
      next: () => {
        this.products.update(items => items.filter(item => item.id !== product.id));
        this.productToDelete.set(null);
        this.notifications.success('Produto excluído com sucesso.');
      },
      error: err => { this.productToDelete.set(null); this.showError(err, 'Não foi possível excluir o produto.'); },
    });
  }
  private showError(err: { error?: { message?: string | string[] } }, fallback: string) {
    const message = err.error?.message;
    this.notifications.error(Array.isArray(message) ? message.join(' ') : message || fallback);
  }
}
