import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import type { ReactNode } from "react";

interface AntdProviderProps {
	children: ReactNode;
}

export function AntdProvider({ children }: AntdProviderProps) {
	return (
		<StyleProvider layer>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: "#1890ff",
						borderRadius: 6,
					},
					components: {
						Layout: {
							siderBg: "#001529",
						},
					},
				}}
			>
				<AntApp>{children}</AntApp>
			</ConfigProvider>
		</StyleProvider>
	);
}
