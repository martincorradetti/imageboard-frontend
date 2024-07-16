import { Comment } from './comment'; // Assuming you'll have a Comment model

export interface Thread {
  id: number;
  title: string;
  content: string;
  forumId: number;
  repliesCount?: number;
  comments?: Comment[]; // Array of comments (optional, if you want to fetch comments eagerly)
  // Add other properties as needed (e.g., creator, timestamp, etc.)
}
