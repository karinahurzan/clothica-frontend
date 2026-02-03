import { apiGet } from "@/lib/apiClient";
import { Category, CategoryFromBackend } from "./type";

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const data = await apiGet<CategoryFromBackend[]>(
      "/categories",
      undefined,
      "Не вдалося завантажити категорії",
    );

    if (!Array.isArray(data)) {
      throw new Error("Неправильний формат відповіді від сервера");
    }

    return data.map(({ id, name }) => ({ id, name }));
  },

  async getCategoryById(id: string): Promise<Category> {
    const data = await apiGet<CategoryFromBackend>(
      `/categories/${id}`,
      undefined,
      "Не вдалося завантажити категорію",
    );

    return {
      id: data.id,
      name: data.name,
    };
  },
};
