import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Comment } from '../models/comment';

interface CommentFilters {
  threadId?: number;
  [key: string]: any; // Allow for future filters
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = '/api/comments/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl).pipe(
      catchError(this.handleError<Comment[]>('getAll', []))
    );
  }

  getById(id: number): Observable<Comment> {
    const url = `${this.apiUrl}${id}`;
    return this.http.get<Comment>(url).pipe(
      catchError(this.handleError<Comment>(`getById id=${id}`))
    );
  }

  getByThread(threadId: number, filters?: CommentFilters): Observable<Comment[]> {
    let params = new HttpParams();
    if (filters) {
      for (const key in filters) {
        params = params.append(key, filters[key]);
      }
    }
    return this.http.get<Comment[]>(`${this.apiUrl}thread/${threadId}`, { params }).pipe(
      catchError(this.handleError<Comment[]>('getByThread', []))
    );
  }

  create(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment).pipe(
      catchError(this.handleError<Comment>('create'))
    );
  }

  update(id: number, comment: Comment): Observable<Comment> {
    const url = `${this.apiUrl}${id}`;
    return this.http.put<Comment>(url, comment).pipe(
      catchError(this.handleError<Comment>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError<any>('delete'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // log to console instead
      return of(result as T); // let the app keep running by returning an empty result
    };
  }
}



