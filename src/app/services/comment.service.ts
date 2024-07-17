import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private forumsApiUrl = '/api/forums/';

  constructor(private http: HttpClient) {}

  getAll(forumId: number, threadId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.forumsApiUrl}${forumId}/threads/${threadId}/comments`);
  }

  getCommentsForThread(threadId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.forumsApiUrl}/threads/${threadId}/comments`);
  }

  create(forumId: number, threadId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.forumsApiUrl}/forums/${forumId}/threads/${threadId}/comments`, comment);
  }

  update(forumId: number, threadId: number, commentId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.forumsApiUrl}/forums/${forumId}/threads/${threadId}/comments/${commentId}`, comment);
  }

  delete(forumId: number, threadId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.forumsApiUrl}/forums/${forumId}/threads/${threadId}/comments/${commentId}`);
  }
}
