import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = '/api/comments/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl).pipe(
      catchError(this.handleError<Comment[]>('getAll', []))
    );
  }

  get(id: number): Observable<Comment> {
    const url = this.apiUrl + id;
    return this.http.get<Comment>(url).pipe(
      catchError(this.handleError<Comment>(`get id=${id}`))
    );
  }

  getByThread(threadId: number): Observable<Comment[]> {
    const url = this.apiUrl + threadId;
    return this.http.get<Comment[]>(url).pipe(
      catchError(this.handleError<Comment[]>(`getByThread threadId=${threadId}`, []))
    );
  }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      catchError(this.handleError<Comment>('create'))
    );
  }

  update(comment: Comment): Observable<Comment> {
    const url = this.apiUrl + comment.id;
    return this.http.put<Comment>(url, comment).pipe(
      catchError(this.handleError<Comment>('update'))
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
