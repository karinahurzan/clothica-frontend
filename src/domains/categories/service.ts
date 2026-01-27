import api from "@/lib/axios";
import { Category, CategoryFromBackend } from "./type";
import { handleAxiosError } from "@/lib/handleAxiosError";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const { data } = await api.get<CategoryFromBackend[]>("/categories");

      if (!Array.isArray(data)) {
        throw new Error("Неправильний формат відповіді від сервера");
      }

      return data.map(({ id, name }) => ({ id, name }));
    } catch (error) {
      handleAxiosError(error, "Не вдалося завантажити категорії");
    }
  },

  async getCategoryById(id: string): Promise<Category> {
    try {
      const { data } = await api.get<CategoryFromBackend>(`/categories/${id}`);

      return {
        id: data.id,
        name: data.name,
      };
    } catch (error) {
      handleAxiosError(error, "Не вдалося завантажити категорію");
    }
  },
};
