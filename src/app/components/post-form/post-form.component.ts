import { Component, Input, OnInit } from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  @Input() forumId!: number;
  @Input() threadId!: number;

  error: string | null = null;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const formData = form.value;

    if (!this.threadId) {
      console.error('Invalid threadId:', this.threadId);
      return;
    }

    const newComment: Comment = {
      id: 0,
      name: '',
      threadId: this.threadId,
      content: formData.content,
      imageUrl: formData.imageUrl || ''
    };

    this.commentService.create(this.forumId, this.threadId, newComment).subscribe({
      next: (createdComment) => {
        console.log('Comment created:', createdComment);
        form.resetForm();
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        this.error = 'Failed to create comment. Please try again.';
      }
    });
  }
}
