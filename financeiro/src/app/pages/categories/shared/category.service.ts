import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, observable,  throwError} from "rxjs";
import { map,  catchError, flatMap } from "rxjs/operators";

import { Categoty } from "./category.model"


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "api/categories";

  constructor(private http: HttpClient) { }

  getAll(): Observable<Categoty[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Categoty> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: Categoty): Observable<Categoty> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: Categoty): Observable<Categoty> {
    const url = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  private jsonDataToCategories(jsonData: any[]): Categoty[] {
    const categories: Categoty[] = [];
    jsonData.forEach(element => categories.push(element as Categoty));
    return categories;
  }

  private handleError(error: any): Observable<any>{
    console.log("ERRO NA REQUISIÇÂO => ", error);
    return throwError(error)
  }

  private jsonDataToCategory(jsonData: any): Categoty{
    return jsonData as Categoty;
  }
}
