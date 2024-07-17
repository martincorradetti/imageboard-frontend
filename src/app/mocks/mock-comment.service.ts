import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mockComments } from './mock-data';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class MockCommentService {
  getCommentsForThread(threadId: number) {
    return of(mockComments.filter(comment => comment.threadId === threadId));
  }

  create(forumId: number, threadId: number, comment: Comment) {
    mockComments.push(comment);
    return of(comment);
  }
}
