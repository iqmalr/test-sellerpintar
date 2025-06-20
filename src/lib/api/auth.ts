import { apiClient } from "./api-client";
import { handleAxiosError } from "./error-handler";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: "User" | "Admin";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AuthResponseData;
  token?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  role: string;
}

const cookieManager = {
  set(name: string, value: string, days = 7) {
    if (typeof window === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure; SameSite=Strict`;
  },

  get(name: string): string | null {
    if (typeof window === "undefined") return null;
    const nameEQ = name + "=";
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const c = cookie.trim();
      if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
    }
    return null;
  },

  delete(name: string) {
    if (typeof window === "undefined") return;
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  },
};

const authStorage = {
  setToken(token: string) {
    localStorage.setItem("token", token);
    cookieManager.set("token", token);
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || cookieManager.get("token");
    }
    return null;
  },

  clear() {
    localStorage.removeItem("token");
    cookieManager.delete("token");
    cookieManager.delete("role");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    const result = response.data;

    if (result.token) {
      authStorage.setToken(result.token);
      if (result.data?.role) {
        cookieManager.set("role", result.data.role);
      }
    }

    return result;
  } catch (error) {
    handleAxiosError(error, {
      400: "Username or password cannot be empty",
      401: "Invalid username or password",
      500: "Internal server error during login",
    });
  }
}

export async function registerUser(
  data: RegisterRequest,
): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      400: "Please fill in all required fields correctly",
      409: "Username is already taken",
      500: "Internal server error during registration",
    });
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<UserProfile>("/auth/profile");
    return response.data;
  } catch (error) {
    handleAxiosError(error, {
      401: "Your session has expired. Please login again.",
      403: "Access to profile is forbidden",
      500: "Failed to fetch user profile",
    });
  }
}

export function logoutUser(): void {
  authStorage.clear();
}

export const isAuthenticated = () => authStorage.isAuthenticated();
export const getAuthToken = authStorage.getToken;
