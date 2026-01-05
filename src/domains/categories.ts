import api from "@/lib/axios";
import axios from "axios";

export interface CategoryFromBackend {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}
export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await api.get("/categories");

    const categoriesData: CategoryFromBackend[] = data || [];

    if (!Array.isArray(categoriesData)) {
      console.error("Неправильний формат відповіді:", data);
      throw new Error("Очікувався масив у полі 'categories'.");
    }

    return categoriesData.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios помилка:", error.response?.status, error.message);
    } else {
      console.error("Невідома помилка:", error);
    }
    throw new Error("Не вдалося завантажити категорії");
  }
}
