import {Component, OnInit, Input, OnDestroy, inject} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { switchMap, EMPTY, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, PostFormComponent, RouterOutlet, CommentComponent, AsyncPipe],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {
  @Input() forumId!: number;
  threads: Thread[] = []; // Store filtered threads for the forum
  thread: Thread | undefined;
  comments: Comment[] = [];

  isLoadingThreads = true;
  isLoadingThread = true;
  errorMessage: string | null = null;

  private route = inject(ActivatedRoute);
  private threadsService = inject(ThreadService);
  private commentService = inject(CommentService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.threadsService.getByForum(this.forumId).subscribe({
      next: (threads) => {
        this.threads = threads;
        this.isLoadingThreads = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching threads. Please try again later.';
        console.error('Error fetching threads:', error);
        this.isLoadingThreads = false;
      }
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        // @ts-ignore
        const threadId = +params.get('threadId');
        if (threadId) {
          this.isLoadingThread = true;
          return this.threadsService.get(threadId);
        } else {
          this.thread = undefined;
          this.comments = [];
          this.isLoadingThread = false;
          return of(undefined);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (thread) => {
        this.thread = thread;
        if (thread) {
          this.commentService.getByThread(thread.id).subscribe(comments => {
            this.comments = comments;
            this.isLoadingThread = false;
          });
        }
      },
      error: (error) => {
        this.errorMessage = 'Error fetching thread details. Please try again later.';
        this.isLoadingThread = false;
        console.error('Error fetching thread:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



