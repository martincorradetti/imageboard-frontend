import { Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import { Forum } from '../../models/forum';
import { Thread } from '../../models/thread';
import { ForumService } from '../../services/forum.service';
import { ThreadService } from '../../services/thread.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {NgForOf, NgIf} from "@angular/common";
import {ThreadComponent} from "../thread/thread.component";

@Component({
  selector: 'app-forum',
  standalone: true,
  templateUrl: `./forum.component.html`,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ThreadComponent,
    RouterOutlet
  ],

  /* ... your component configuration ... */
})
export class ForumComponent implements OnInit {
  forums: Forum[] = [];
  allThreads: Thread[] = [];
  selectedForum: Forum | undefined;
  filteredThreads: Thread[] = []; // Threads for the selected forum
  isLoading = true;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);
  private threadService = inject(ThreadService);

  ngOnInit() {
    // Fetch forums
    this.forumService.getAll().subscribe(
      forums => this.forums = forums
    );

    // Fetch all threads and observe route changes
    this.threadService.getAll().pipe(
      switchMap(threads => {
        this.allThreads = threads;
        return this.route.params;
      })
    ).subscribe(params => {
      const forumId = +params['forumId'];
      if (forumId) {
        this.selectedForum = this.forums.find(f => f.id === forumId);
        this.filteredThreads = this.allThreads.filter(t => t.forumId === forumId);
      } else {
        this.selectedForum = undefined;
        this.filteredThreads = [];
      }
      this.isLoading = false;
    });
  }
}





