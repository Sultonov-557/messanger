import type { UserRoleType } from "@shared/types";
import type { Context, Next } from "hono";
import { createMiddleware } from "hono/factory";

import { forbidden, invalidToken, tokenExpired, unauthorized } from "@/lib/errors";
import type { AppBindings } from "@/lib/types";

import { verifyAccessToken } from "./jwt";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	const authHeader = c.req.header("Authorization");

	if (!authHeader) {
		throw unauthorized("Authorization header is required");
	}

	if (!authHeader.startsWith("Bearer ")) {
		throw unauthorized("Invalid authorization header format");
	}

	const token = authHeader.slice(7);

	if (!token) {
		throw unauthorized("Token is required");
	}

	try {
		const payload = await verifyAccessToken(token);

		c.set("user", {
			id: payload.sub,
			role: payload.role,
		});

		await next();
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes("expired")) {
				throw tokenExpired();
			}
			if (error.message.includes("signature") || error.message.includes("malformed")) {
				throw invalidToken();
			}
		}
		throw invalidToken();
	}
});

export function requireRole(...allowedRoles: UserRoleType[]) {
	return createMiddleware<AppBindings>(async (c: Context<AppBindings>, next: Next) => {
		const user = c.get("user");

		if (!user) {
			throw unauthorized("Authentication required");
		}

		if (!allowedRoles.includes(user.role)) {
			throw forbidden(`Access denied. Required roles: ${allowedRoles.join(", ")}`);
		}

		await next();
	});
}
