import { Component } from '@angular/core';
import {ForumListComponent} from "../../components/forum-list/forum-list.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    ForumListComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
}

