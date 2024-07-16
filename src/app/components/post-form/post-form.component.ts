import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ThreadsService } from '../../services/threads.service';
import { CommentsService } from '../../services/comments.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatInput,
    MatInputModule,
    MatFormFieldModule,
    MatButton
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  @Input({transform: numberAttribute}) threadId: number | null = null; // Optional input for replies

  postForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private threadsService: ThreadsService,
    private commentsService: CommentsService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: ['', this.threadId ? null : Validators.required], // Title is only required for new threads
      content: ['', Validators.required],
      // Add fields for image upload as needed
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      const formData = this.postForm.value;
      if (this.threadId) {
        // This is a reply
        this.commentsService.create({ ...formData, threadId: this.threadId }).subscribe();
      } else {
        // This is a new thread
        this.threadsService.create(formData).subscribe();
      }
      this.postForm.reset(); // Clear the form after submission
    }
  }
}

