import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ForumComponent } from './components/forum/forum.component';
import { ThreadComponent } from './components/thread/thread.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default Route
  {
    path: 'forums/:forumId',
    component: ForumComponent,
    children: [
      { path: '', component: ThreadComponent },
      { path: ':threadId', component: ThreadComponent }
    ]
  }
];



