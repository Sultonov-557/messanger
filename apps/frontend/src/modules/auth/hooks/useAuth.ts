import { useMutation, useQuery } from "@tanstack/react-query";
import { App } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import type { LoginRequest } from "../types";

export function useLogin() {
	const { message } = App.useApp();
	const navigate = useNavigate();
	const setAuth = useAuthStore((state) => state.setAuth);

	return useMutation({
		mutationFn: (data: LoginRequest) => authService.login(data),
		onSuccess: (response) => {
			setAuth(response.user, response.accessToken, response.refreshToken);
			message.success("Login successful!");
			navigate("/dashboard");
		},
		onError: () => {
			message.error("Invalid phone or password");
		},
	});
}

export function useLogout() {
	const { message } = App.useApp();
	const navigate = useNavigate();
	const { refreshToken, logout } = useAuthStore();

	return useMutation({
		mutationFn: () => {
			if (!refreshToken) {
				throw new Error("No refresh token");
			}
			return authService.logout({ refreshToken });
		},
		onSuccess: () => {
			logout();
			message.success("Logged out successfully!");
			navigate("/login");
		},
		onError: () => {
			logout();
			navigate("/login");
		},
	});
}

export function useMe() {
	const { setUser, logout, accessToken } = useAuthStore();

	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			try {
				const user = await authService.getMe();
				setUser(user);
				return user;
			} catch {
				logout();
				throw new Error("Session expired");
			}
		},
		enabled: !!accessToken,
		retry: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}

export function useAuthInit() {
	const { hydrate, accessToken, isLoading, setLoading } = useAuthStore();
	const { refetch } = useMe();

	const init = async () => {
		hydrate();

		const currentAccessToken = useAuthStore.getState().accessToken;
		if (currentAccessToken) {
			await refetch();
		} else {
			setLoading(false);
		}
	};

	return { init, isLoading, accessToken };
}
