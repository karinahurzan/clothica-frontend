import api from "@/lib/axios";
import { Feedback, FeedbackCreate } from "./type";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { toast } from "sonner";

export const getFeedbacks = async (productId: string): Promise<Feedback[]> => {
  try {
    const { data } = await api.get<Feedback[]>(`/feedbacks/${productId}`);
    return data;
  } catch (error) {
    handleAxiosError(error, "Не вдалося завантажити відгуки");
  }
};

export const getLatestFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const { data } = await api.get<Feedback[]>("/feedbacks/latest");

    return data;
  } catch (error) {
    handleAxiosError(error, "Не вдалося завантажити останні відгуки");
  }
};

export const createFeedback = async (
  feedback: FeedbackCreate,
  token: string,
): Promise<FeedbackCreate> => {
  try {
    const { data } = await api.post<FeedbackCreate>("/feedbacks", feedback, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Успішна операція", {
      description: "Ви успішно створили новий відгук до цього товару",
    });

    return data;
  } catch (error) {
    toast.error("Виникла помилка", {
      description:
        "На жаль, виникла помилка під час створення відгуку. Спробуйте ще раз пізніше",
    });

    handleAxiosError(error, "Не вдалося створити відгук");
  }
};
