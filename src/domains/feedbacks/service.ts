import api from "@/lib/axios";
import { Feedback, FeedbackCreate } from "./type";

export const getFeedbacks = async (productId: string): Promise<Feedback[]> => {
  const { data } = await api.get<Feedback[]>(`/feedbacks/${productId}`);
  return data;
};

export const getLatestFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const { data } = await api.get<Feedback[]>("/feedbacks/latest");
    return data;
  } catch (err) {
    console.error("Failed to fetch latest feedbacks:", err);
    return [];
  }
};

export const createFeedback = async (
  feedback: FeedbackCreate,
  token: string,
): Promise<Feedback> => {
  const { data } = await api.post<Feedback>("/feedbacks", feedback, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
