import { z } from "zod/v4";

// ===========================================
// Backend Environment Schema
// ===========================================
const serverEnvSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z
		.string()
		.default("4000")
		.transform(Number)
		.pipe(z.number().min(1).max(65535)),
	HOST: z.string().default("0.0.0.0"),

	// Database
	DATABASE_URL: z.url(),

	// Redis
	REDIS_URL: z.url(),

	// JWT
	JWT_SECRET: z.string().min(32),
	JWT_EXPIRES_IN: z.string().default("15m"),
	JWT_REFRESH_SECRET: z.string().min(32),
	REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
	if (cachedServerEnv) {
		return cachedServerEnv;
	}

	const result = serverEnvSchema.safeParse(process.env);

	if (!result.success) {
		const formatted = z.prettifyError(result.error);
		throw new Error(`Invalid server environment variables:\n${formatted}`);
	}

	cachedServerEnv = result.data;
	return cachedServerEnv;
}

// ===========================================
// Frontend Environment Schema (Vite)
// ===========================================
const clientEnvSchema = z.object({
	VITE_API_URL: z.url(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let cachedClientEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
	if (cachedClientEnv) {
		return cachedClientEnv;
	}

	// Vite uses import.meta.env instead of process.env
	const envSource =
		typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : process.env;

	const result = clientEnvSchema.safeParse(envSource);

	if (!result.success) {
		const formatted = z.prettifyError(result.error);
		throw new Error(`Invalid client environment variables:\n${formatted}`);
	}

	cachedClientEnv = result.data;
	return cachedClientEnv;
}

export { serverEnvSchema, clientEnvSchema };
