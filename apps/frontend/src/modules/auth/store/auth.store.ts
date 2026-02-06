import { create } from "zustand";
import {
	clearStoredTokens,
	getStoredAccessToken,
	getStoredRefreshToken,
	setStoredTokens,
} from "@/shared/utils/token";
import type { User } from "../types";

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

interface AuthActions {
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	setUser: (user: User) => void;
	setLoading: (loading: boolean) => void;
	logout: () => void;
	hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: true,

	setAuth: (user, accessToken, refreshToken) => {
		setStoredTokens(accessToken, refreshToken);
		set({
			user,
			accessToken,
			refreshToken,
			isAuthenticated: true,
			isLoading: false,
		});
	},

	setTokens: (accessToken, refreshToken) => {
		setStoredTokens(accessToken, refreshToken);
		set({ accessToken, refreshToken });
	},

	setUser: (user) => {
		set({ user, isAuthenticated: true, isLoading: false });
	},

	setLoading: (loading) => {
		set({ isLoading: loading });
	},

	logout: () => {
		clearStoredTokens();
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
		});
	},

	hydrate: () => {
		const accessToken = getStoredAccessToken();
		const refreshToken = getStoredRefreshToken();

		if (accessToken && refreshToken) {
			set({
				accessToken,
				refreshToken,
				isLoading: true,
			});
		} else {
			set({ isLoading: false });
		}
	},
}));
