import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ForumComponent } from './components/forum/forum.component';
import { ThreadComponent } from './components/thread/thread.component';
import { PostFormComponent } from './components/post-form/post-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'forums', component: ForumComponent }, // Combined forum list and detail component
  {
    path: 'forums/:forumId',
    component: ForumComponent,
    children: [
      { path: '', redirectTo: 'threads', pathMatch: 'full' },
      { path: 'threads', component: ThreadComponent },
      {
        path: 'threads/:threadId',
        component: ThreadComponent,
        children: [
          { path: '', component: ThreadComponent },
          { path: 'comments/:commentId', component: ThreadComponent }
        ]
      },
      { path: 'create-thread', component: PostFormComponent }
    ]
  }
];




