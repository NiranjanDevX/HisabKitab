import api from "../lib/api";

export const authService = {
  login: async (email: string, pass: string) => {
    // FastAPI OAuth2 expects form data for login
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", pass);
    const response = await api.post("/auth/login", formData);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
  googleLogin: async (idToken: string) => {
    const response = await api.post("/auth/firebase-login", { token: idToken });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};
