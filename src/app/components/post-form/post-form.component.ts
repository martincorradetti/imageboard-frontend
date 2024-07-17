import {Component, Input, inject, numberAttribute, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
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
    SubmitOnValidDirective,
    FormsModule
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  forumId: number = 0;
  threadId: number = 0;
  error: string | undefined;

  constructor(
    private threadService: ThreadService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    // Initialize forumId and threadId as needed
  }

  onSubmit(postForm: NgForm): void {
    if (postForm.invalid) {
      return;
    }

    const formData = postForm.value;
    const newComment = {
      id: 0,
      name: '',
      threadId: this.threadId,
      content: formData.content
    };

    this.commentService.create(this.forumId, this.threadId, newComment).subscribe({
      next: (createdComment) => {
        console.log('Comment created:', createdComment);
        // Handle success, e.g., show success message, clear form, etc.
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        this.error = 'Failed to create comment'; // Example of error handling
      }
    });
  }
}
