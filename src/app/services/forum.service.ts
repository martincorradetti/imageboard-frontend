import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Forum } from '../models/forum';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private forumsApiUrl = '/api/forums/'; // Base URL for forum API endpoints

  constructor(private http: HttpClient) {}

  getAll(): Observable<Forum[]> {
    return this.http.get<Forum[]>(this.forumsApiUrl).pipe(
      catchError(this.handleError<Forum[]>('getAllForums', []))
    );
  }

  getById(id: number): Observable<Forum> {
    const url = `${this.forumsApiUrl}${id}`;
    return this.http.get<Forum>(url).pipe(
      catchError(this.handleError<Forum>(`getForumById id=${id}`))
    );
  }

  create(forum: Forum): Observable<Forum> {
    return this.http.post<Forum>(this.forumsApiUrl, forum).pipe(
      catchError(this.handleError<Forum>('createForum'))
    );
  }

  update(forum: Forum): Observable<Forum> {
    const url = `${this.forumsApiUrl}${forum.id}`;
    return this.http.put<Forum>(url, forum).pipe(
      catchError(this.handleError<Forum>('updateForum'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.forumsApiUrl}${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError<any>('deleteForum'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

