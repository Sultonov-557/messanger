import { Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const { Content } = Layout;

export function AuthLayout() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	// If already authenticated, redirect to dashboard
	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<Layout className="min-h-screen bg-gray-100">
			<Content className="flex items-center justify-center p-6">
				<Outlet />
			</Content>
		</Layout>
	);
}
