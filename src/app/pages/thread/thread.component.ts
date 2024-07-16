import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import { Thread } from '../../models/thread';
import { ThreadsService } from '../../services/threads.service';
import { Comment } from '../../models/comment';
import { CommentsService } from '../../services/comments.service';
import {PostFormComponent} from "../../components/post-form/post-form.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  standalone: true,
  imports: [
    PostFormComponent,
    NgIf,
    NgForOf,
    RouterOutlet
  ],
  styleUrls: ['./thread.component.css']
})
export class ThreadComponent implements OnInit {
  thread: Thread | undefined;
  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private threadsService: ThreadsService,
    private commentsService: CommentsService
  ) { }

  ngOnInit() {
    // Get the thread ID from the route parameters
    this.route.params.subscribe(params => {
      const threadId = +params['threadId'];
      // Fetch the thread details using the threadService
      this.threadsService.get(threadId).subscribe(
        thread => this.thread = thread,
        error => console.error(error)
      );
      // Fetch the comments for the thread using the commentsService
      this.commentsService.getByThread(threadId).subscribe(
        comments => this.comments = comments,
        error => console.error(error)
      );
    });
  }
}




