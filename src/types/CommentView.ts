// In CommentView.ts
export interface Comment {
  id: string;
  text: string;
  user_name: string;
  writer: string;
  created_at: string;
  content: string;
  avatar_url: string;
  rate: string;
}

export interface CommentData {
  comment: Comment;
  replies: CommentData[];
  writer: string;
  created_at: string;
  content: string;
  avatar_url: string;
  id: string;
  rate: string;
}

export interface CommentView {
  comments: CommentData[];
}
