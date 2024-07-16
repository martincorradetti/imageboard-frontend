import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Forum } from '../../models/forum';
import { Thread } from '../../models/thread';
import { ForumService } from '../../services/forum.service';
import { ThreadService } from '../../services/thread.service';
import { NgIf, NgForOf } from '@angular/common';
import { ThreadComponent } from '../thread/thread.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  templateUrl: './forum.component.html', // Remove backticks (`) around templateUrl
  imports: [NgIf, NgForOf, RouterLink, ThreadComponent, RouterOutlet],
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forums: Forum[] = [];
  allThreads: Thread[] = [];
  selectedForum: Forum | undefined;
  filteredThreads: Thread[] = [];
  isLoading = true;
  error: string | null = null;

  // Injected Services
  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);
  private threadService = inject(ThreadService);

  ngOnInit() {
    // Fetch forums
    this.forumService.getAll().subscribe(
      forums => this.forums = forums,
      error => {
        this.error = "An error occurred while fetching forums.";
        this.isLoading = false;
        console.error(error);
      }
    );

    // Fetch all threads
    this.threadService.getAll().subscribe(
      threads => this.allThreads = threads,
      error => {
        this.error = "An error occurred while fetching threads.";
        this.isLoading = false;
        console.error(error);
      }
    );

    // Observe route changes
    this.route.params.subscribe(params => {
      const forumId = +params['forumId'];
      if (forumId) {
        this.selectedForum = this.forums.find(f => f.id === +forumId);
      } else {
        this.selectedForum = undefined;
      }
      this.isLoading = false;
    });
  }

  updateSelectedForumAndThreads(forumId: number | null) {
    if (forumId) {
      this.selectedForum = this.forums.find(f => f.id === +forumId);
      this.filteredThreads = this.allThreads.filter(t => t.forumId === +forumId);
    } else {
      this.selectedForum = undefined;
      this.filteredThreads = [];
    }
    this.isLoading = false; // Data is loaded, remove loading state
  }
}





