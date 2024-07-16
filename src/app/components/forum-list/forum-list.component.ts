import { Component, OnInit } from '@angular/core';
import { Forum } from '../../models/forum';
import { ForumsService } from '../../services/forums.service';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {
  forums: Forum[] = [];

  constructor(private forumsService: ForumsService) { }

  ngOnInit() {
    this.forumsService.getAll().subscribe(
      forums => this.forums = forums,
      error => console.error(error)
    );
  }
}

