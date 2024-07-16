import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Thread } from '../models/thread';

interface ThreadFilters {
  forumId?: number;
  [key: string]: any; // Allow for future filters
}

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private apiUrl = '/api/threads/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Thread[]> {
    return this.http.get<Thread[]>(this.apiUrl).pipe(
      catchError(this.handleError<Thread[]>('getAll', []))
    );
  }

  getById(id: number): Observable<Thread> {
    const url = `${this.apiUrl}${id}`;
    return this.http.get<Thread>(url).pipe(
      catchError(this.handleError<Thread>(`getById id=${id}`))
    );
  }

  getByForum(forumId: number, filters?: ThreadFilters): Observable<Thread[]> {
    let params = new HttpParams();
    if (filters) {
      for (const key in filters) {
        params = params.append(key, filters[key]);
      }
    }
    return this.http.get<Thread[]>(`${this.apiUrl}forum/${forumId}`, { params }).pipe(
      catchError(this.handleError<Thread[]>('getByForum', []))
    );
  }

  create(thread: Thread): Observable<Thread> {
    return this.http.post<Thread>(this.apiUrl, thread).pipe(
      catchError(this.handleError<Thread>('create'))
    );
  }

  update(id: number, thread: Thread): Observable<Thread> {
    const url = `${this.apiUrl}${id}`;
    return this.http.put<Thread>(url, thread).pipe(
      catchError(this.handleError<Thread>('update'))
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

