import { getServerEnv } from "@shared/env";

const env = getServerEnv();

const redis = new Bun.RedisClient(env.REDIS_URL);

const REFRESH_TOKEN_PREFIX = "refresh_token:";

export async function storeRefreshToken(
	userId: string,
	token: string,
	expiresInSeconds: number
): Promise<void> {
	const key = `${REFRESH_TOKEN_PREFIX}${userId}:${token}`;
	await redis.set(key, "1", "EX", expiresInSeconds);
}

export async function isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
	const key = `${REFRESH_TOKEN_PREFIX}${userId}:${token}`;
	const result = await redis.get(key);
	return result !== null;
}

export async function deleteRefreshToken(userId: string, token: string): Promise<void> {
	const key = `${REFRESH_TOKEN_PREFIX}${userId}:${token}`;
	await redis.del(key);
}

export async function deleteAllUserTokens(userId: string): Promise<void> {
	const pattern = `${REFRESH_TOKEN_PREFIX}${userId}:*`;
	const keys = await redis.keys(pattern);

	if (keys.length > 0) {
		await redis.del(...keys);
	}
}

export { redis };
