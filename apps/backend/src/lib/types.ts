import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { UserRoleType } from "@shared/types";
import type { PinoLogger } from "hono-pino";

export interface AuthUser {
	id: string;
	role: UserRoleType;
}

export interface AppBindings {
	// biome-ignore lint/style/useNamingConvention: Hono requires this exact property name
	Variables: {
		logger: PinoLogger;
		user: AuthUser;
	};
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
