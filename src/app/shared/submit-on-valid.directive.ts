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
  @Input() threadId: number | null = null;
  @Input() forum: Forum | null = null;

  constructor(
    private threadsService: ThreadService,
    private commentsService: CommentService
  ) {}

  @HostListener('ngSubmit')
  onSubmit(form: NgForm) {
    if (form.valid && this.forum) { // Check if form and forum are valid
      const formData = form.value;

      if (this.threadId) {
        this.commentsService.create({ ...formData, threadId: this.threadId })
          .subscribe(
            _ => form.resetForm(), // Reset form on success
            error => console.error('Error creating comment:', error) // Handle errors
          );
      } else {
        this.threadsService.create({ ...formData, forumId: this.forum.id })
          .subscribe(
            _ => form.resetForm(), // Reset form on success
            error => console.error('Error creating thread:', error) // Handle errors
          );
      }
    }
  }
}
