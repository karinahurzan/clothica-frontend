import api from "@/lib/axios";
import { Category, CategoryFromBackend } from "./type";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<CategoryFromBackend[]>("/categories");

    if (!Array.isArray(data)) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  },

  async getCategoryById(id: string): Promise<Category> {
    const { data } = await api.get<CategoryFromBackend>(`/categories/${id}`);
    return {
      id: data.id,
      name: data.name,
    };
  },
};
