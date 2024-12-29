import { CommentView } from '../types/CommentView';
import { API_BASE_URL } from '../config';
// export const API_BASE_URL = 'http://127.0.0.1:8000';

// Function to get gym details by gym code and user_id as query parameter
export const getCommentsView = async (user_id: string): Promise<CommentView | null> => {
  const url = new URL(`${API_BASE_URL}/comments/view_comments/`);
  url.searchParams.append('user_id', user_id);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Failed to fetch comment details');
  }

  const data: CommentView = await response.json();
  return data;
};
