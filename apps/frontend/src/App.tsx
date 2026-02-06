import { Spin } from "antd";
import { useEffect } from "react";
import { Providers } from "./app/providers";
import { AppRouter } from "./app/router";
import { authService } from "./modules/auth/services/auth.service";
import { useAuthStore } from "./modules/auth/store/auth.store";

function AuthInitializer({ children }: { children: React.ReactNode }) {
	const { hydrate, setUser, setLoading, logout, accessToken, isLoading } = useAuthStore();

	useEffect(() => {
		const initAuth = async () => {
			hydrate();

			const currentToken = useAuthStore.getState().accessToken;
			if (currentToken) {
				try {
					const user = await authService.getMe();
					setUser(user);
				} catch {
					logout();
				}
			} else {
				setLoading(false);
			}
		};

		initAuth();
	}, [hydrate, setUser, setLoading, logout]);

	if (isLoading && accessToken) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spin size="large" />
			</div>
		);
	}

	return <>{children}</>;
}

function App() {
	return (
		<Providers>
			<AuthInitializer>
				<AppRouter />
			</AuthInitializer>
		</Providers>
	);
}

export default App;
