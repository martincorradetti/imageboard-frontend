import { Comment } from './comment';

export interface Thread {
  id: number;
  title: string;
  forumId: number;
  name: string;
  content: string;
  comments?: Comment[];
}
