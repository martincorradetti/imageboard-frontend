import {Component, Input, inject, numberAttribute} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Forum } from '../../models/forum';
import { Thread } from '../../models/thread';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { SubmitOnValidDirective } from '../../shared/submit-on-valid.directive';
import { ThreadService } from '../../services/thread.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatButton,
    SubmitOnValidDirective
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Input({ transform: numberAttribute }) threadId!: number; // For replies
  @Input() forum!: Forum;

  postForm!: FormGroup;
  error: string | null = null;

  // Inject the services
  private threadService = inject(ThreadService);
  private commentService = inject(CommentService);

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      name: ['']
    });

    if (this.threadId) {
      this.postForm.removeControl('title');
    }
  }

  onSubmit() {
    if (this.postForm.valid) {
      if (this.threadId) {
        // Creating a comment
        this.commentService.create(this.postForm.value).subscribe({
          next: () => {
            this.postForm.reset(); // Clear the form after successful submission
            // Optionally, emit an event to notify parent components about the new comment
          },
          error: (error) => {
            this.handleError('Error creating comment.', error);
          }
        });
      } else {
        // Creating a thread
        // Construct the Thread object with forumId
        const newThread: Thread = {
          ...this.postForm.value,
          forumId: this.forum.id,
          // Add any other necessary properties like date, etc.
        };

        this.threadService.create(newThread).subscribe({
          next: () => {
            this.postForm.reset();
            // Optionally, navigate to the newly created thread
          },
          error: (error) => {
            this.handleError('Error creating thread.', error);
          }
        });
      }
    }
  }

  private handleError(message: string, error: any) {
    this.error = message;
    console.error(error);
  }
}





