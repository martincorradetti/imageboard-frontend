import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Thread } from '../models/thread';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private forumsApiUrl = '/api/forums/'; // API URL for forums

  constructor(private http: HttpClient) {}

  getAll(): Observable<Thread[]> {
    return this.http.get<Thread[]>('/api/threads/')
      .pipe(catchError(this.handleError<Thread[]>('getAll')));
  }

  getById(id: number): Observable<Thread> {
    const url = `/api/threads/${id}`;
    return this.http.get<Thread>(url)
      .pipe(catchError(this.handleError<Thread>(`getById id=${id}`)));
  }

  getByForum(forumId: number): Observable<Thread[]> {
    const url = `${this.forumsApiUrl}${forumId}/threads`;
    return this.http.get<Thread[]>(url)
      .pipe(catchError(this.handleError<Thread[]>('getByForum')));
  }

  create(thread: Thread): Observable<Thread> {
    return this.http.post<Thread>('/api/threads/', thread)
      .pipe(catchError(this.handleError<Thread>('create')));
  }

  update(id: number, thread: Thread): Observable<Thread> {
    const url = `/api/threads/${id}`;
    return this.http.put<Thread>(url, thread)
      .pipe(catchError(this.handleError<Thread>('update')));
  }

  delete(id: number): Observable<void> {
    const url = `/api/threads/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError<void>('delete')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(error);
    };
  }
}
