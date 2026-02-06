import {
	DashboardOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Typography } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/modules/auth/hooks/useAuth";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
	{
		key: "/dashboard",
		icon: <DashboardOutlined />,
		label: "Dashboard",
	},
];

export function MainLayout() {
	const [collapsed, setCollapsed] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const user = useAuthStore((state) => state.user);
	const { mutate: logout, isPending: isLoggingOut } = useLogout();

	const userMenuItems = [
		{
			key: "profile",
			icon: <UserOutlined />,
			label: "Profile",
		},
		{
			type: "divider" as const,
		},
		{
			key: "logout",
			icon: <LogoutOutlined />,
			label: "Logout",
			danger: true,
		},
	];

	const handleUserMenuClick = ({ key }: { key: string }) => {
		if (key === "logout") {
			logout();
		} else if (key === "profile") {
			navigate("/profile");
		}
	};

	const handleMenuClick = ({ key }: { key: string }) => {
		navigate(key);
	};

	return (
		<Layout className="min-h-screen">
			<Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
				<div className="h-16 flex items-center justify-center">
					<Text strong className="text-white text-lg">
						{collapsed ? "App" : "Messagner"}
					</Text>
				</div>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[location.pathname]}
					items={menuItems}
					onClick={handleMenuClick}
				/>
			</Sider>
			<Layout>
				<Header className="bg-white px-4 flex items-center justify-between shadow-sm">
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						className="text-lg"
					/>
					<Dropdown
						menu={{
							items: userMenuItems,
							onClick: handleUserMenuClick,
						}}
						placement="bottomRight"
						trigger={["click"]}
						disabled={isLoggingOut}
					>
						<div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">
							<Avatar icon={<UserOutlined />} />
							<Text className="hidden sm:inline">{user?.phone}</Text>
						</div>
					</Dropdown>
				</Header>
				<Content className="m-4 p-6 bg-white rounded-lg min-h-70">
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}
