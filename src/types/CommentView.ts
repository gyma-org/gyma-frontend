// In CommentView.ts
export interface Comment {
  id: string;
  text: string;
  writer_username: string;
  writer: string;
  created_at: string;
  content: string;
  avatar_url: string;
  rate: string;
  gym_name: string;
}

export interface CommentData {
  comment: Comment;
  replies: CommentData[];
  writer_username: string;
  writer: string;
  created_at: string;
  content: string;
  avatar_url: string;
  id: string;
  rate: string;
  gym_name: string;
}

export interface CommentView {
  comments: CommentData[];
}
