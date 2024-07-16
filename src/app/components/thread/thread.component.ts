import {Component, OnInit, inject, Input} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadService } from '../../services/thread.service';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { PostFormComponent } from "../post-form/post-form.component";
import { NgForOf, NgIf } from "@angular/common";
import {Forum} from "../../models/forum";
import {CommentComponent} from "../comment/comment.component";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [NgForOf, RouterLink, NgIf, PostFormComponent, RouterOutlet, CommentComponent],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  @Input() forum!: Forum;
  threads: Thread[] = [];
  thread: Thread | undefined;
  comments: Comment[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private route = inject(ActivatedRoute);
  private threadsService = inject(ThreadService);
  private commentsService = inject(CommentService);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const forumId = +params['forumId'];
      const threadId = +params['threadId'];

      if (!isNaN(forumId) && !isNaN(threadId)) {
        this.loadThreads(forumId);
        this.loadThread(threadId);
      } else {
        this.errorMessage = 'Invalid forum or thread ID';
      }
    });
  }

  loadThreads(forumId: number) {
    this.threadsService.getByForum(forumId).subscribe({
      next: threads => {
        this.threads = threads;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching threads. Please try again later.';
        console.error('Error fetching threads:', error);
      }
    });
  }

  private loadThread(threadId: number): void {
    if (threadId) {
      this.threadsService.get(threadId).subscribe({
        next: thread => {
          this.thread = thread;
         // this.loadComments(threadId); // Load comments after getting the thread
        },
        error: error => console.error('Error fetching thread:', error)
      });
    } else {
      this.thread = undefined;
    }
  }

  protected readonly name = name;
}

