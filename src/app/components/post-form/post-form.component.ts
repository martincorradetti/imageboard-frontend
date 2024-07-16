// post-form.component.ts
import { Component, Input, inject, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Forum } from '../../models/forum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { SubmitOnValidDirective } from '../../shared/submit-on-valid.directive';
import {Subject} from "rxjs";

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
    SubmitOnValidDirective
  ],
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {
  @Input({ transform: numberAttribute }) threadId!: number; // For replies
  @Input() forum!: Forum;

  postForm!: FormGroup;
  error: string | null = null; // Keep error property for display

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
      name: ['']
    });

    if (this.threadId) {
      this.postForm.removeControl('title');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


