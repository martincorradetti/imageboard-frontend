import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ForumComponent } from './pages/forum/forum.component';
import { ThreadListComponent } from './components/thread-list/thread-list.component';
import { ThreadComponent } from './pages/thread/thread.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default Route
  {
    path: 'f/:forumId',
    component: ForumComponent,
    children: [
      { path: '', component: ThreadListComponent },
      { path: ':threadId', component: ThreadComponent }
    ]
  }
];



