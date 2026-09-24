import { inject, Injectable } from "@angular/core";
import { Category } from "./model/category.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { CreateCategoryDto } from "./model/create-category.dto";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = `${environment.apiUrl}/categories`;

    findAll(): Observable<Category[]> {
      return this.http.get<Category[]>(this.apiUrl);
    }

    delete(categoryId: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${categoryId}`);
    }

    create(category: CreateCategoryDto): Observable<Category> {
      return this.http.post<Category>(this.apiUrl, category);
    }

    toggleStatus(id: Number): Observable<any> {
      return this.http.patch(`${this.apiUrl}/${id}/toggleStatus`, {});
    }
}
