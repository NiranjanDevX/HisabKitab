import api from "../lib/api";

export interface SpendingSummary {
  total: number;
  average: number;
  count: number;
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  total: number;
  percentage: number;
  count: number;
}

export interface TrendData {
  date: string;
  amount: number;
}

export interface AnalyticsResponse {
  summary: SpendingSummary;
  category_breakdown: CategoryBreakdown[];
  recent_trends: TrendData[];
  month_over_month: number | null;
}

export const analyticsService = {
  getDashboardData: async (
    period: "daily" | "weekly" | "monthly" = "monthly",
  ): Promise<AnalyticsResponse> => {
    const response = await api.get(`/analytics/summary?period=${period}`);
    return response.data;
  },
};
