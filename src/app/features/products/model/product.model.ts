import { Category } from '../../categories/model/category.model';
export interface CreateProductDto {
  name: string;
  description: string;
  photo: string | null;
  price: number;
  promotionalPrice: number | null;
  categoryId: number;
  available: boolean;
}
export type UpdateProductDto = Partial<CreateProductDto>;
export interface Product extends CreateProductDto {
  id: number;
  category: Category;
}
