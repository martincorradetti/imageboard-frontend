import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet} from '@angular/router';
import { Forum } from '../../models/forum';
import { ForumsService } from '../../services/forums.service';
import {ThreadListComponent} from "../../components/thread-list/thread-list.component";
import {NgIf} from "@angular/common";
import {PostFormComponent} from "../../components/post-form/post-form.component";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  standalone: true,
  imports: [
    ThreadListComponent,
    RouterOutlet,
    NgIf,
    PostFormComponent
  ],
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  forum: Forum | undefined;
  forumId!: number;

  constructor(
    private route: ActivatedRoute,
    private forumsService: ForumsService
  ) { }

  ngOnInit() {
    // Get the forum ID from the route parameters
    this.route.params.subscribe(params => {
      this.forumId = +params['forumId'];
      // Fetch the forum details using the forumService
      this.forumsService.get(this.forumId).subscribe(
        forum => this.forum = forum,
        error => console.error(error)
      );
    });
  }
}

