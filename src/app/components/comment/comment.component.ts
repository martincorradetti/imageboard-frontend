import { Component, Input, inject } from '@angular/core';
import { Comment } from '../../models/comment';
import { CommentService } from '../../services/comment.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment!: Comment;

  showActions: boolean = false;
  isEditing: boolean = false;
  editedContent: string = '';

  private commentService = inject(CommentService);

  ngOnInit() {
    this.showActions = this.canEdit();
  }

  onEdit() {
    this.isEditing = true;
    this.editedContent = this.comment.content;
  }

  onSaveEdit() {
    if (this.editedContent !== this.comment.content) {
      // Create a new comment object with the updated content
      const updatedComment: Comment = { ...this.comment, content: this.editedContent };

      this.commentService.update(updatedComment).subscribe({
        next: () => {  // Update the local comment object on success
          this.comment.content = this.editedContent;
          this.isEditing = false;
        },
        error: error => {
          console.error("Error updating comment:", error);
        }
      });
    } else {
      this.isEditing = false;
    }
  }

  onCancelEdit() {
    this.isEditing = false;
  }

  private canEdit(): boolean {
    return true; // Replace with your actual authorization logic
  }
}





