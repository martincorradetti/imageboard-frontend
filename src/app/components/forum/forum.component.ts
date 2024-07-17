import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Forum } from '../../models/forum';
import { Thread } from '../../models/thread';
import { ForumService } from '../../services/forum.service';
import { ThreadService } from '../../services/thread.service';
import { NgIf, NgForOf } from '@angular/common';
import { ThreadComponent } from '../thread/thread.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  templateUrl: './forum.component.html',
  imports: [NgIf, NgForOf, RouterLink, ThreadComponent, RouterOutlet],
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forums: Forum[] = [];
  selectedForum: Forum | undefined;
  threads: Thread[] = [];
  isLoadingForums = true;
  isLoadingThreads = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private threadService: ThreadService
  ) {}

  ngOnInit(): void {
    this.fetchForums();
    this.route.params.subscribe(params => {
      const forumId = +params['forumId'];
      if (forumId) {
        this.loadForumAndThreads(forumId);
      } else {
        this.selectedForum = undefined;
        this.threads = [];
      }
    });
  }

  fetchForums(): void {
    this.forumService.getAll().subscribe(
      forums => {
        this.forums = forums;
        this.isLoadingForums = false;
      },
      error => {
        this.error = 'An error occurred while fetching forums.';
        this.isLoadingForums = false;
        console.error('Error fetching forums:', error);
      }
    );
  }

  loadForumAndThreads(forumId: number): void {
    this.isLoadingThreads = true;
    this.forumService.getById(forumId).subscribe(
      forum => {
        this.selectedForum = forum;
        this.fetchThreadsByForum(forumId);
      },
      error => {
        this.error = 'An error occurred while fetching forum details.';
        this.isLoadingThreads = false;
        console.error('Error fetching forum details:', error);
      }
    );
  }

  fetchThreadsByForum(forumId: number): void {
    this.threadService.getByForum(forumId).subscribe(
      threads => {
        this.threads = threads;
        this.isLoadingThreads = false;
      },
      error => {
        this.error = 'An error occurred while fetching threads.';
        this.isLoadingThreads = false;
        console.error('Error fetching threads:', error);
      }
    );
  }
}
