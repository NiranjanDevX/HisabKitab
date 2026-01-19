import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

class CategoryService {
  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getCategories() {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createCategory(category: Partial<Category>) {
    const response = await axios.post(`${API_URL}/categories`, category, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}

export const categoryService = new CategoryService();
