import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Thread } from '../models/thread'; // Your Thread model/interface

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private apiUrl = '/api/threads';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Thread[]> {
    return this.http.get<Thread[]>(this.apiUrl).pipe(
      catchError(this.handleError<Thread[]>('getAll', []))
    );
  }

  get(id: number): Observable<Thread> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Thread>(url).pipe(
      catchError(this.handleError<Thread>(`get id=${id}`))
    );
  }

  getByForum(forumId: number): Observable<Thread[]> {
    const url = `${this.apiUrl}/forum/${forumId}`;
    return this.http.get<Thread[]>(url).pipe(
      catchError(this.handleError<Thread[]>(`getByForum forumId=${forumId}`, []))
    );
  }

  create(thread: Thread): Observable<Thread> {
    return this.http.post<Thread>(this.apiUrl, thread).pipe(
      catchError(this.handleError<Thread>('create'))
    );
  }

  update(thread: Thread): Observable<Thread> {
    const url = `${this.apiUrl}/${thread.id}`;
    return this.http.put<Thread>(url, thread).pipe(
      catchError(this.handleError<Thread>('update'))
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
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

