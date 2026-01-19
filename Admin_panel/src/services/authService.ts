import api from "../lib/api";

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
}

export const authService = {
  login: async (email: string, pass: string) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", pass);
    const response = await api.post("/auth/login", formData);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  googleLogin: async (idToken: string) => {
    const response = await api.post("/auth/firebase-login", { token: idToken });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};
