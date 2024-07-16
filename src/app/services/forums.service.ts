import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Forum } from '../models/forum';

@Injectable({
  providedIn: 'root'
})
export class ForumsService {
  private apiUrl = '/api/forums/'; // Base URL for forum API endpoints

  constructor(private http: HttpClient) {}

  getAll(): Observable<Forum[]> {
    return this.http.get<Forum[]>(this.apiUrl).pipe(
      catchError(this.handleError<Forum[]>('getAll', []))
    );
  }

  get(id: number): Observable<Forum> {
    const url = this.apiUrl + id;
    return this.http.get<Forum>(url).pipe(
      catchError(this.handleError<Forum>(`get id=${id}`))
    );
  }

  create(forum: Forum): Observable<Forum> {
    return this.http.post<Forum>(this.apiUrl, forum).pipe(
      catchError(this.handleError<Forum>('create'))
    );
  }

  update(forum: Forum): Observable<Forum> {
    const url = this.apiUrl + forum.id;
    return this.http.put<Forum>(url, forum).pipe(
      catchError(this.handleError<Forum>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = this.apiUrl + id;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError<any>('delete'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
