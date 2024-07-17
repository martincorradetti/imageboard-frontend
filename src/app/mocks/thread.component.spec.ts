import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ThreadComponent} from "../components/thread/thread.component";
import { MockThreadService } from './mock-thread.service';
import { MockCommentService } from './mock-comment.service';
import { ThreadService } from '../services/thread.service';
import { CommentService } from '../services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NgIf, NgForOf } from '@angular/common';

describe('ThreadComponent', () => {
  let component: ThreadComponent;
  let fixture: ComponentFixture<ThreadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreadComponent],
      providers: [
        { provide: ThreadService, useClass: MockThreadService },
        { provide: CommentService, useClass: MockCommentService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ forumId: '1' })
          }
        }
      ],
      imports: [NgIf, NgForOf]
    }).compileComponents();

    fixture = TestBed.createComponent(ThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load threads on init', () => {
    component.ngOnInit();
    expect(component.threads.length).toBe(2);
  });

  it('should load comments when a thread is selected', () => {
    component.onSelectThread({name: "name", id: 1, forumId: 1, title: 'Thread 1', content: 'Content of Thread 1' });
    expect(component.comments.length).toBe(2);
  });
});
