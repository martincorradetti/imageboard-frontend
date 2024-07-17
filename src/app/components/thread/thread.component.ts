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
  @Input() forumId: number | undefined; // Define forumId as an input property

  threads: Thread[] = [];
  isLoadingThreads = true;
  errorMessage: string | null = null;

  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService
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
        (threads) => {
          this.threads = threads;
          this.isLoadingThreads = false;
        },
        (error) => {
          this.handleError('Error fetching threads.', error);
        }
      );
    } else {
      this.isLoadingThreads = false;
      this.errorMessage = 'Forum ID not provided.';
    }
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



