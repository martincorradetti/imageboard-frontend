import { Directive, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommentService } from '../services/comment.service';
import { Comment } from '../models/comment';

@Directive({
  standalone: true,
  selector: '[appSubmitOnValid]'
})
export class SubmitOnValidDirective {
  @Input() forumId: number | undefined;
  @Input() threadId: number | undefined;
  @Input() form: NgForm | undefined;

  constructor(private commentService: CommentService) {}

  @HostListener('submit', ['$event'])
  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.form || this.form.invalid) {
      return;
    }

    const formData = this.form.value;
    const newComment: Comment = {
      id: 0,
      name: '',
      threadId: this.threadId!,
      content: formData.content,
      imageUrl: '' // Provide a default value or use formData.imageUrl if available
    };

    this.commentService.create(this.forumId!, this.threadId!, newComment).subscribe({
      next: (createdComment) => {
        console.log('Comment created:', createdComment);
        this.form?.resetForm();
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }
}
