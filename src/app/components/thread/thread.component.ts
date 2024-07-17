import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { NgIf, NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [NgIf, NgForOf],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {
  forumId: number | undefined;
  threads: Thread[] = [];
  isLoadingThreads = true;
  errorMessage: string | null = null;
  selectedThread: Thread | undefined;
  comments: Comment[] = [];
  isLoadingComments = false;
  commentError: string | null = null;

  private routeSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      this.loadThreads();
    });
  }

  loadThreads(): void {
    if (this.forumId) {
      this.threadService.getByForum(this.forumId).subscribe(
        (threads: Thread[]) => {
          this.threads = threads;
          this.isLoadingThreads = false;
        },
        (error: any) => {
          this.handleError('Error fetching threads.', error);
        }
      );
    } else {
      this.isLoadingThreads = false;
      this.errorMessage = 'Forum ID not provided.';
    }
  }

  onSelectThread(thread: Thread): void {
    this.selectedThread = thread;
    this.loadComments(thread.id);
  }

  loadComments(threadId: number): void {
    this.isLoadingComments = true;
    this.commentError = null;
    this.commentService.getCommentsForThread(threadId).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
        this.isLoadingComments = false;
      },
      (error: any) => {
        this.commentError = 'Error fetching comments.';
        console.error('Error fetching comments:', error);
        this.isLoadingComments = false;
      }
    );
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error(error);
    this.isLoadingThreads = false;
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
