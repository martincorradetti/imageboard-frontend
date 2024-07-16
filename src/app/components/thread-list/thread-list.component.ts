import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router'; // Import ActivatedRoute
import { Thread } from '../../models/thread';
import { ThreadsService } from '../../services/threads.service';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];
  @Input() forumId!: number;

  constructor(
    private route: ActivatedRoute,   // Inject ActivatedRoute
    private threadsService: ThreadsService
  ) {}

  ngOnInit() {
    // Get the forum ID from the route parameters
    this.route.parent!.params.subscribe(params => {
      this.forumId = +params['forumId'];

      // Fetch threads based on the forum ID
      this.threadsService.getByForum(this.forumId).subscribe(
        threads => this.threads = threads,
        error => console.error(error)
      );
    });
  }
}

