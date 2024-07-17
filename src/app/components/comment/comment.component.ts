import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() forumId: number | undefined;
  @Input() threadId: number | undefined;
  comments: Comment[] = [];
  isEditing: boolean = false;
  editedContent: string = '';
  editedCommentId: number | undefined;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.forumId && this.threadId) {
      this.loadComments();
    } else {
      console.error('Forum ID and Thread ID must be provided.');
    }
  }

  loadComments(): void {
    this.commentService.getAll(this.forumId!, this.threadId!).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      },
      (error: any) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  createComment(content: string): void {
    if (!content.trim()) {
      return;
    }

    const newComment: Comment = {
      id: 0,
      name: '',
      threadId: this.threadId!,
      content: content
    };

    this.commentService.create(this.forumId!, this.threadId!, newComment).subscribe(
      (createdComment: Comment) => {
        console.log('Comment created:', createdComment);
        this.comments.push(createdComment);
      },
      (error: any) => {
        console.error('Error creating comment:', error);
      }
    );
  }

  updateComment(comment: Comment): void {
    if (!comment.id) {
      console.error('Comment ID is required for updating.');
      return;
    }

    this.commentService.update(this.forumId!, this.threadId!, comment.id, comment).subscribe(
      (updatedComment: Comment) => {
        console.log('Comment updated:', updatedComment);
      },
      (error: any) => {
        console.error('Error updating comment:', error);
      }
    );
  }

  deleteComment(commentId: number): void {
    this.commentService.delete(this.forumId!, this.threadId!, commentId).subscribe(
      () => {
        console.log('Comment deleted:', commentId);
        this.comments = this.comments.filter(c => c.id !== commentId);
      },
      (error: any) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  toggleEdit(comment: Comment): void {
    this.isEditing = true;
    this.editedCommentId = comment.id;
    this.editedContent = comment.content;
  }

  onSaveEdit(): void {
    if (!this.editedCommentId) {
      console.error('Comment ID is required for updating.');
      return;
    }

    const updatedComment: Comment = {
      id: this.editedCommentId,
      name: '',
      threadId: this.threadId!,
      content: this.editedContent
    };

    this.commentService.update(this.forumId!, this.threadId!, this.editedCommentId, updatedComment).subscribe(
      (updatedComment: Comment) => {
        console.log('Comment updated:', updatedComment);
        this.cancelEdit();
      },
      (error: any) => {
        console.error('Error updating comment:', error);
      }
    );
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.editedCommentId = undefined;
    this.editedContent = '';
  }

  private cancelEdit() {

  }
}
