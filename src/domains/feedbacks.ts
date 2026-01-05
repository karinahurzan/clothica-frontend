import api from "@/lib/axios";
import axios from "axios";

export interface FeedbackFromBackend {
  id: string;
  author: string;
  description: string;
  rate: number;
  product_id: string;
  date: string;
}

export interface Feedback {
  id: string;
  author: string;
  description: string;
  rate: number;
  product_id: string;
  date: string;
}
export async function getFeedbacks({
  productId,
}: {
  productId: string;
}): Promise<Feedback[]> {
  try {
    const { data } = await api.get(`/feedbacks/${productId}`);

    const feedbacksData: FeedbackFromBackend[] = data || [];

    if (!Array.isArray(feedbacksData)) {
      console.error("Неправильний формат відповіді:", data);
      throw new Error("Очікувався масив у полі 'feedbacks'.");
    }

    return feedbacksData.map((item) => ({
      id: item.id,
      author: item.author,
      description: item.description,
      rate: item.rate,
      product_id: item.product_id,
      date: item.date,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити відгуки на даний товар");
  }
}
