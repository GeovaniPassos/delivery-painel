import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CreateProductDto, Product, UpdateProductDto } from './model/product.model';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;
  findAll() {
    return this.http.get<Product[]>(this.apiUrl);
  }
  create(dto: CreateProductDto) {
    return this.http.post<Product>(this.apiUrl, dto);
  }
  update(id: number, dto: UpdateProductDto) {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, dto);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  toggleStatus(id: number) {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/toggleStatus`, {});
  }
}
