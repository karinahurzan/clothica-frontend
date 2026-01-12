import { useQuery } from "@tanstack/react-query";
import { categoryService } from "./service";
import { Category } from "./type";

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategory = (id?: string) => {
  return useQuery<Category, Error>({
    queryKey: ["category", id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id,
  });
};
