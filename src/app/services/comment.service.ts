import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsApiUrl = '/api/comments/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentsApiUrl).pipe(
      catchError(this.handleError<Comment[]>('getAll', []))
    );
  }

  getById(id: number): Observable<Comment> {
    const url = `${this.commentsApiUrl}${id}/`; // Include trailing slash for consistency
    return this.http.get<Comment>(url).pipe(
      catchError(this.handleError<Comment>(`getById id=${id}`))
    );
  }

  getByThread(threadId: number): Observable<Comment[]> {
    const url = `${this.commentsApiUrl}?threadId=${threadId}`; // Updated endpoint
    return this.http.get<Comment[]>(url).pipe(
      catchError(this.handleError<Comment[]>(`getByThread threadId=${threadId}`, []))
    );
  }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.commentsApiUrl, comment).pipe(
      catchError(this.handleError<Comment>('create'))
    );
  }

  update(comment: Comment): Observable<Comment> { // Update method now accepts a Comment object
    const url = `${this.commentsApiUrl}${comment.id}/`; // Include trailing slash
    return this.http.put<Comment>(url, comment).pipe(
      catchError(this.handleError<Comment>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.commentsApiUrl}${id}/`; // Include trailing slash
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

