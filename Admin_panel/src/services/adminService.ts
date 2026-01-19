import api from "../lib/api";

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_expenses: number;
  total_amount: number;
  ai_features_used: number;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  expense_count: number;
  total_spent: number;
  occupation?: string;
  phone_number?: string;
  profile_pic?: string;
}

export interface AdminLog {
  id: number;
  user_id: number;
  event_type: string;
  description: string;
  timestamp: string;
  user_email?: string;
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    const response = await api.get("/admin/stats");
    return response.data;
  }

  async getUsers(
    page = 1,
    pageSize = 20,
  ): Promise<{ items: AdminUser[]; total: number }> {
    const response = await api.get("/admin/users", {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async getLogs(
    page = 1,
    pageSize = 50,
  ): Promise<{ items: AdminLog[]; total: number }> {
    const response = await api.get("/admin/logs", {
      params: { page, page_size: pageSize },
    });
    return response.data;
  }

  async banUser(userId: number): Promise<void> {
    await api.put(`/admin/users/${userId}/ban`, {});
  }

  async unbanUser(userId: number): Promise<void> {
    await api.put(`/admin/users/${userId}/unban`, {});
  }
}

export const adminService = new AdminService();
