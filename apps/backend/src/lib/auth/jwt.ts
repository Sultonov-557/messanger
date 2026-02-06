import { getServerEnv } from "@shared/env";
import type { UserRoleType } from "@shared/types";
import * as jose from "jose";

const env = getServerEnv();

const accessSecret = new TextEncoder().encode(env.JWT_SECRET);

export interface AccessTokenPayload {
  sub: string; // userId
  role: UserRoleType;
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = Number.parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}

export async function generateAccessToken(
  userId: string,
  role: string,
): Promise<string> {
  const expiresIn = env.JWT_EXPIRES_IN;

  const token = await new jose.SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(accessSecret);

  return token;
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload> {
  const { payload } = await jose.jwtVerify(token, accessSecret);

  if (!(payload.sub && payload.role)) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: payload.sub,
    role: payload.role as UserRoleType,
  };
}

export function generateRefreshToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(bytes).toString("base64url");
}

export function getRefreshTokenExpirySeconds(): number {
  return parseDuration(env.REFRESH_TOKEN_EXPIRES_IN);
}
