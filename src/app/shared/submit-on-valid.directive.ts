import { Directive, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ThreadService } from  '../services/thread.service';
import { CommentService } from '../services/comment.service';
import {Forum} from "../models/forum";

@Directive({
  standalone: true,
  selector: '[appSubmitOnValid]'
})
export class SubmitOnValidDirective {
  @Input() forumId!: number;
  @Input() threadId!: number;
  @Input() form!: NgForm; // Reference to the NgForm instance

  constructor(private commentService: CommentService) {}

  @HostListener('ngSubmit')
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.value;
    const newComment = {
      id: 0,
      name: '',
      threadId: this.threadId,
      content: formData.content
      // Add other fields as needed
    };

    this.commentService.create(this.forumId, this.threadId, newComment).subscribe({
      next: (createdComment) => {
        console.log('Comment created:', createdComment);
        // Handle success, e.g., show success message, clear form, etc.
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        // Handle error, e.g., show error message
      }
    });
  }
}
