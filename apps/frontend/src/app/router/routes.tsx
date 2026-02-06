import { Navigate, type RouteObject } from "react-router-dom";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage";
import { AuthLayout } from "@/shared/components/layouts/AuthLayout";
import { MainLayout } from "@/shared/components/layouts/MainLayout";
import { ProtectedRoute } from "./ProtectedRoute";

export const routes: RouteObject[] = [
	// Public routes - Auth
	{
		path: "/login",
		element: <AuthLayout />,
		children: [
			{
				index: true,
				element: <LoginPage />,
			},
		],
	},

	// Protected routes
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<MainLayout />
			</ProtectedRoute>
		),
		children: [
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
		],
	},

	// 404 - Redirect to dashboard or login
	{
		path: "*",
		element: <Navigate to="/" replace />,
	},
];
