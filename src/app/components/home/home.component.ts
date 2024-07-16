import { Component } from '@angular/core';
import {ForumComponent} from "../forum/forum.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    ForumComponent
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
}

