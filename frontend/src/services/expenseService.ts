import api from "../lib/api";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  category_id: number;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  date: string;
  payment_method: string;
}

export interface ExpenseCreate {
  amount: number;
  description: string;
  category_id: number;
  date: string;
  payment_method: string;
}

class ExpenseService {
  async getExpenses(skip = 0, limit = 100) {
    const response = await api.get("/expenses/", {
      params: { skip, limit },
    });
    // Backend returns paginated response, extract items array
    return Array.isArray(response.data)
      ? response.data
      : response.data.items || [];
  }

  async createExpense(expense: ExpenseCreate) {
    const response = await api.post("/expenses/", expense);
    return response.data;
  }

  async updateExpense(id: number, expense: Partial<ExpenseCreate>) {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  }

  async deleteExpense(id: number) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
}

export const expenseService = new ExpenseService();
