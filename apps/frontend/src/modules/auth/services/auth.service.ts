import apiClient from "@/app/api/client";
import type {
	AuthData,
	AuthTokens,
	LoginRequest,
	LoginResponse,
	LogoutRequest,
	LogoutResponse,
	MeResponse,
	RefreshResponse,
	RefreshTokenRequest,
	User,
} from "../types";

export const authService = {
	async login(data: LoginRequest): Promise<AuthData> {
		const response = await apiClient.post<LoginResponse>("/auth/login", data);
		return response.data.data;
	},

	async refresh(data: RefreshTokenRequest): Promise<AuthTokens> {
		const response = await apiClient.post<RefreshResponse>("/auth/refresh", data);
		return response.data.data;
	},

	async logout(data: LogoutRequest): Promise<void> {
		await apiClient.post<LogoutResponse>("/auth/logout", data);
	},

	async getMe(): Promise<User> {
		const response = await apiClient.get<MeResponse>("/auth/me");
		return response.data.data;
	},
};
