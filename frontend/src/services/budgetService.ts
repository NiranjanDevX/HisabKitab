import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface Budget {
  id: number;
  name: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  category_id?: number;
  spent: number;
  remaining: number;
  percentage_used: number;
  created_at: string;
}

export interface BudgetCreate {
  name: string;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  category_id?: number;
}

class BudgetService {
  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getBudgets(): Promise<Budget[]> {
    const response = await axios.get(`${API_URL}/budgets/`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async createBudget(data: BudgetCreate): Promise<Budget> {
    const response = await axios.post(`${API_URL}/budgets/`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async updateBudget(id: number, data: Partial<BudgetCreate>): Promise<Budget> {
    const response = await axios.put(`${API_URL}/budgets/${id}`, data, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async deleteBudget(id: number): Promise<void> {
    await axios.delete(`${API_URL}/budgets/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

export const budgetService = new BudgetService();
