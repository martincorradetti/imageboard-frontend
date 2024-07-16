import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { NgForOf, NgIf } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, PostFormComponent, RouterOutlet, CommentComponent],
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

  private routeSubscription: any; // Store the subscription

  constructor(
    private route: ActivatedRoute,
    private threadsService: ThreadService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.loadThreads(); // Start loading threads immediately

    // Observe threadId changes using a subscription
    this.routeSubscription = this.route.params.subscribe(params => {
      const threadId = +params['threadId'];
      if (threadId) {
        this.loadThread(threadId); // Load specific thread if threadId exists
      } else {
        this.thread = undefined;
        this.comments = [];
        this.isLoadingThread = false;
      }
    });
  }

  loadThreads() {
    this.threadsService.getByForum(this.forumId).subscribe(
      (threads) => {
        this.threads = threads;
        this.isLoadingThreads = false;
      },
      (error) => {
        this.handleError('Error fetching threads.', error);
      }
    );
  }

  loadThread(threadId: number) {
    this.isLoadingThread = true;
    this.threadsService.getById(threadId).subscribe(
      (thread) => {
        this.thread = thread;
        if (thread) {
          this.loadComments(thread.id); // Load comments for the thread
        } else {
          this.isLoadingThread = false;
        }
      },
      (error) => {
        this.handleError('Error fetching thread details.', error);
      }
    );
  }

  loadComments(threadId: number) {
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

  private handleError(message: string, error: any) {
    this.errorMessage = message;
    console.error(error);
    this.isLoadingThreads = false;
    this.isLoadingThread = false;
  }

  ngOnDestroy() {
    // Unsubscribe from the route params subscription when the component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}





