import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

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
export class CommentComponent implements OnInit {
  @Input() threadId: number = 0;
  comments: Comment[] = [];
  updatedComment: Comment = {} as Comment;
  updatedCommentId: number = 0;
  @Input() comment!: Comment;
  isEditing: any;
  editedContent: any;
  showActions: boolean | undefined;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.commentService.getByThread(this.threadId).subscribe(
      (comments: Comment[]) => this.comments = comments,
      (error: any) => console.error('Error fetching comments:', error)
    );
  }

  updateComment(): void {
    this.commentService.update(this.updatedCommentId, this.updatedComment).subscribe({
      next: (updatedComment: Comment) => {
        console.log('Comment updated:', updatedComment);
        // Handle the updated comment in the UI as needed
      },
      error: (error: any) => console.error('Error updating comment:', error)
    });
  }

  onSaveEdit() {

  }

  onCancelEdit() {

  }

  onEdit() {

  }
}






