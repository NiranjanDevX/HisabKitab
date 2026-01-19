import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class AIService {
  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async getInsights() {
    const response = await axios.get(`${API_URL}/ai/insights`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }

  async chat(message: string) {
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      { message },
      {
        headers: this.getHeaders(),
      },
    );
    return response.data;
  }

  async suggestCategory(description: string, amount: number) {
    const response = await axios.post(
      `${API_URL}/ai/suggest-category`,
      { description, amount },
      {
        headers: this.getHeaders(),
      },
    );
    return response.data;
  }
}

export const aiService = new AIService();
