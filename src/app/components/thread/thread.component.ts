import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import {CommentComponent} from "../comment/comment.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [
    RouterLink,
    CommentComponent,
    RouterOutlet,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit, OnDestroy {
  @Input() forumId!: number;
  threads: Thread[] = [];
  thread: Thread | undefined;
  comments: Comment[] = [];

  isLoadingThreads = true;
  isLoadingThread = false;
  errorMessage: string | null = null;

  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.loadThreads();

    this.routeSubscription = this.route.params.subscribe(params => {
      const threadId = +params['threadId'];
      if (threadId) {
        this.loadThread(threadId);
      } else {
        this.thread = undefined;
        this.comments = [];
        this.isLoadingThread = false;
      }
    });
  }

  loadThreads(): void {
    this.isLoadingThreads = true;
    this.threadService.getByForum(this.forumId).subscribe(
      (threads) => {
        this.threads = threads;
        this.isLoadingThreads = false;
      },
      (error) => {
        this.handleError('Error fetching threads.', error);
      }
    );
  }

  loadThread(threadId: number): void {
    this.isLoadingThread = true;
    this.threadService.getById(threadId).subscribe(
      (thread) => {
        this.thread = thread;
        if (thread) {
          this.loadComments(thread.id);
        } else {
          this.isLoadingThread = false;
        }
      },
      (error) => {
        this.handleError('Error fetching thread details.', error);
      }
    );
  }

  loadComments(threadId: number): void {
    this.commentService.getByThread(threadId).subscribe(
      (comments) => {
        this.comments = comments;
        this.isLoadingThread = false;
      },
      (error) => {
        this.handleError('Error fetching comments.', error);
      }
    );
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error(error);
    this.isLoadingThreads = false;
    this.isLoadingThread = false;
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}





