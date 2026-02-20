import api from "../lib/api";

class AIService {
  async getInsights() {
    const response = await api.get("/ai/insights");
    return response.data;
  }

  async chat(message: string) {
    const response = await api.post("/ai/chat", { message });
    return response.data;
  }

  async suggestCategory(description: string, amount: number) {
    // Backend supports both /categorize and /suggest-category
    const response = await api.post("/ai/categorize", { description, amount });
    return response.data;
  }

  async parseVoice(message: string) {
    const response = await api.post("/ai/parse-voice", { message });
    return response.data;
  }
}

export const aiService = new AIService();
