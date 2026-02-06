import { BookOutlined, CalendarOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { useAuthStore } from "@/modules/auth/store/auth.store";

const { Title, Text } = Typography;

export function DashboardPage() {
	const user = useAuthStore((state) => state.user);

	return (
		<div>
			<div className="mb-6">
				<Title level={3} className="!mb-1">
					Dashboard
				</Title>
				<Text type="secondary">
					Welcome, {user?.phone}! Role: {user?.role}
				</Text>
			</div>

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title="Users" value={0} prefix={<UserOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title="Teams" value={0} prefix={<TeamOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title="Projects" value={0} prefix={<BookOutlined />} />
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic title="Progress" value={0} prefix={<CalendarOutlined />} suffix="%" />
					</Card>
				</Col>
			</Row>
		</div>
	);
}
