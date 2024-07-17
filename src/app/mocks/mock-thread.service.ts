import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mockThreads } from './mock-data';
import { Thread } from '../models/thread';

@Injectable({
  providedIn: 'root'
})
export class MockThreadService {
  getByForum(forumId: number) {
    return of(mockThreads.filter(thread => thread.forumId === forumId));
  }

  create(forumId: number, thread: Thread) {
    mockThreads.push(thread);
    return of(thread);
  }
}
