import { inject, Injectable } from "@angular/core";
import { Category } from "../model/category.model";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);

    private readonly apiUrl = 'http://localhost:3000/categories';

    findAll(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
}