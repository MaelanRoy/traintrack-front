import type Category from "@/models/Category";
import CategoryService from "@/services/CategoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategoryList = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: (): Promise<Category[]> => CategoryService.findAll(),
  });
};
