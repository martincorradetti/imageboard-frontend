import { Component, OnInit, inject, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { PostFormComponent } from '../post-form/post-form.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import { Forum } from '../../models/forum';
import { CommentComponent } from '../comment/comment.component';
import {switchMap, EMPTY, Observable, of, Subject, takeUntil, tap} from 'rxjs';
import {catchError} from "rxjs/operators"; // Import RxJS operators

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, PostFormComponent, RouterOutlet, CommentComponent, AsyncPipe],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {
  @Input() forum!: Forum;
  threads$: Observable<Thread[]> = of([]);
  thread$: Observable<Thread | undefined> = of(undefined);
  comments$: Observable<Comment[]> = of([]);

  isLoadingThreads = true;
  isLoadingThread = true;
  errorMessage: string | null = null;

  private route = inject(ActivatedRoute);
  private threadsService = inject(ThreadService);
  private commentService = inject(CommentService);
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const forumId = +params['forumId'];
        const threadId = +params['threadId'];

        this.threads$ = this.threadsService.getByForum(forumId).pipe(
          tap(() => this.isLoadingThreads = false),
          catchError(error => {
            this.errorMessage = 'Error fetching threads. Please try again later.';
            console.error('Error fetching threads:', error);
            return EMPTY; // Return an empty observable on error
          })
        );

        if (threadId) {
          this.thread$ = this.threadsService.get(threadId).pipe(
            tap(thread => {
              if (thread) {
                this.comments$ = this.commentService.getByThread(threadId).pipe(
                  tap(() => this.isLoadingThread = false),
                  catchError(error => {
                    console.error('Error fetching comments:', error);
                    return of([]);
                  })
                );
              } else {
                this.comments$ = of([]);
              }
            }),
            catchError(error => {
              this.errorMessage = 'Error fetching thread details. Please try again later.';
              console.error('Error fetching thread:', error);
              return of(undefined); // Return undefined on error
            })
          );
        } else {
          this.thread$ = of(undefined);
          this.isLoadingThread = false;
        }

        return this.threads$; // Return the observable for further processing (optional)
      }),
      takeUntil(this.destroy$) // Unsubscribe when component is destroyed
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


