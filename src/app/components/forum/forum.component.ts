import { Component, OnInit, inject } from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import { Forum } from '../../models/forum';
import { ForumService } from '../../services/forum.service';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  standalone: true,
  imports: [RouterLink, NgForOf, NgIf, RouterOutlet],
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forums: Forum[] = [];
  forum: Forum | undefined;
  isLoading = true;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private forumsService = inject(ForumService);
  private router = inject(Router);

  ngOnInit() {
    this.forumsService.getAll().subscribe({
      next: forums => {
        this.forums = forums;
        this.route.params.subscribe(params => {
          const forumId = +params['forumId'];
          this.forum = this.forums.find(f => f.id === forumId);
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.error = "An error occurred while fetching forums.";
        this.isLoading = false;
        console.error(error);
      }
    });
  }
}





