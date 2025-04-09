import { CommentAdd } from "../types/CommentAdd";
import { API_USER_URL } from "../config";

export const addComment = async (
  commentData: CommentAdd,
  token: string,
  logoutUser: () => void
): Promise<void> => {
  const url = `${API_USER_URL}/comments/add/`;

  const formData = new FormData();
  formData.append("content", commentData.content);
  formData.append("gym", commentData.gym_id);
  formData.append("booking", commentData.id);
  formData.append("rate", commentData.rate.toString());

  if (commentData.image) {
    formData.append("image", commentData.image);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Include token in headers
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser(); // Handle unauthorized access
    } else {
      throw new Error("Failed to submit comment");
    }
  }
};
