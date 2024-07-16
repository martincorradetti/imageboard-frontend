import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private commentsApiUrl = '/api/comments/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsApiUrl).pipe(
      catchError(this.handleError<Comment[]>('getAll', []))
    );
  }

  getById(id: number): Observable<Comment> {
    const url = `${this.commentsApiUrl}${id}`;
    return this.http.get<Comment>(url).pipe(
      catchError(this.handleError<Comment>(`getById id=${id}`))
    );
  }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentsApiUrl, comment).pipe(
      catchError(this.handleError<Comment>('create'))
    );
  }

  update(comment: Comment): Observable<Comment> {
    const url = `${this.commentsApiUrl}${comment.id}`;
    return this.http.put<Comment>(url, comment).pipe(
      catchError(this.handleError<Comment>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.commentsApiUrl}${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError<any>('delete'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

