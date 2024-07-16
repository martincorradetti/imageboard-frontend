import { Component, Input, inject, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ThreadService } from '../../services/thread.service';
import { CommentService } from '../../services/comment.service';
import { Forum } from '../../models/forum';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInputModule,
    MatFormFieldModule,
    MatButton
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Input({ transform: numberAttribute }) threadId!: number; // For replies
  @Input() forum!: Forum;

  postForm!: FormGroup;
  submitting = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  private threadsService = inject(ThreadService);
  private commentsService = inject(CommentService);

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      name: ['']
    });

    // If this is a reply, hide the title field
    if (this.threadId) {
      this.postForm.removeControl('title');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit() {
    if (this.postForm.valid) { // You can add custom validation here
      this.submitting = true;
      this.error = null;

      const formData = this.postForm.value;
      const request$ = this.threadId
        ? this.commentsService.create({ ...formData, threadId: this.threadId })
        : this.threadsService.create({ ...formData, forumId: this.forum.id });

      request$.pipe(
        catchError(error => {
          this.error = "An error occurred while submitting. Please try again.";
          console.error(error);
          this.submitting = false; // Re-enable submit on error
          return of(); // Return empty Observable to complete
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.postForm.reset();
        this.submitting = false;
      });
    } else {
      // Handle invalid form (e.g., show validation errors)
      this.error = "Please fill out all required fields.";
    }
  }

}

