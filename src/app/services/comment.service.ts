import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'https://api.example.com'; // Replace with your actual backend API URL

  constructor(private http: HttpClient) {}

  getCommentsForThread(threadId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/threads/${threadId}/comments`);
  }

  create(forumId: number, threadId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/forums/${forumId}/threads/${threadId}/comments`, comment);
  }

  update(forumId: number, threadId: number, commentId: number, comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/forums/${forumId}/threads/${threadId}/comments/${commentId}`, comment);
  }

  delete(forumId: number, threadId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/forums/${forumId}/threads/${threadId}/comments/${commentId}`);
  }
}
