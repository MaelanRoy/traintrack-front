import type Category from "@/models/Category";
import api from "@/config/api/ApiConfig";

class CategoryService {
  /**
   * Returns categories
   * @return promise @type { Promise<Category[]> }
   */
  async findAll(): Promise<Category[]> {
    const { data } = await api.get(`/categories`);
    return data;
  }
}

export default new CategoryService();
