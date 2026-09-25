import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Products } from './products';
import { ProductService } from './product.service';
import { CategoryService } from '../categories/category.service';
import { NotificationService } from '../../shared/components/notification/NotificationService';
import { Product } from './model/product.model';

describe('Products', () => {
  const category = { id: 1, name: 'Lanches', active: true };
  const product: Product = {
    id: 1,
    name: 'Hambúrguer',
    description: '',
    photo: null,
    price: 20,
    promotionalPrice: null,
    categoryId: 1,
    category,
    available: true,
  };
  let component: Products;
  let service: {
    findAll: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    toggleStatus: ReturnType<typeof vi.fn>;
  };
  beforeEach(async () => {
    service = {
      findAll: vi.fn(() => of([product])),
      create: vi.fn(() => of(product)),
      update: vi.fn(() => of(product)),
      delete: vi.fn(() => of(undefined)),
      toggleStatus: vi.fn(() => of({ ...product, available: false })),
    };
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        { provide: ProductService, useValue: service },
        { provide: CategoryService, useValue: { findAll: () => of([category]) } },
        { provide: NotificationService, useValue: { success: vi.fn(), error: vi.fn() } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('loads products and categories', () => {
    expect(component.products()).toEqual([product]);
    expect(component.categories()).toEqual([category]);
  });
  it('requires category and valid promotional price', () => {
    component.openProductModal();
    component.saveProduct();
    expect(service.create).not.toHaveBeenCalled();
    component.productForm.patchValue({
      name: 'Produto',
      price: 20,
      promotionalPrice: 25,
      categoryId: 1,
    });
    component.saveProduct();
    expect(service.create).not.toHaveBeenCalled();
  });
  it('sends all fields including unavailable status', () => {
    component.openProductModal();
    component.productForm.patchValue({
      name: ' Produto ',
      price: 20,
      categoryId: 1,
      available: false,
    });
    component.saveProduct();
    expect(service.create).toHaveBeenCalledWith({
      name: 'Produto',
      description: '',
      photo: null,
      price: 20,
      promotionalPrice: null,
      categoryId: 1,
      available: false,
    });
    expect(component.modalOpen()).toBe(false);
  });
  it('edits and clears the optional fields', () => {
    component.openProductModal({
      ...product,
      photo: 'https://example.com/a.jpg',
      promotionalPrice: 10,
    });
    component.productForm.patchValue({ photo: '', promotionalPrice: null });
    component.saveProduct();
    expect(service.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ photo: null, promotionalPrice: null }),
    );
  });
  it('updates availability from the API and preserves state on error', () => {
    component.toggleStatus(product);
    expect(component.products()[0].available).toBe(false);
    service.toggleStatus.mockReturnValue(throwError(() => new Error('offline')));
    component.toggleStatus(component.products()[0]);
    expect(component.products()[0].available).toBe(false);
    expect(component.busyId()).toBe(null);
  });
  it('deletes only after confirmation', () => {
    component.productToDelete.set(product);
    expect(service.delete).not.toHaveBeenCalled();
    component.deleteProduct();
    expect(service.delete).toHaveBeenCalledWith(1);
    expect(component.products()).toEqual([]);
  });
});
