import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpirySeconds,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { conflict, invalidCredentials, notFound } from "@/lib/errors";
import {
  deleteRefreshToken,
  isRefreshTokenValid,
  storeRefreshToken,
} from "@/lib/redis";
import type { AppRouteHandler } from "@/lib/types";
import type { login, logout, me, refresh, update } from "./auth.routes";
import { UpdateRequestSchema } from "./auth.schemas";

export const registerHandler: AppRouteHandler<typeof login> = async (c) => {
  const { username, password } = c.req.valid("json");

  const foundUser = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (foundUser) {
    throw conflict("Username band");
  }

  const passwordHash = await hashPassword(password);


  const [user] = await db.insert(users).values({ username, password:passwordHash}).returning()

  const accessToken = await generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken();

  const expiresIn = getRefreshTokenExpirySeconds();
  await storeRefreshToken(user.id, refreshToken, expiresIn);

  return c.json(
    {
      success: true as const,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
        },
        accessToken,
        refreshToken,
      },
    },
    200,
  );
};

export const loginHandler: AppRouteHandler<typeof login> = async (c) => {
  const { username, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    throw invalidCredentials("Username yoki parol noto'g'ri");
  }

  if (!user.isActive) {
    throw invalidCredentials("Foydalanuvchi hisobi faol emas");
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw invalidCredentials("Username yoki parol noto'g'ri");
  }

  const accessToken = await generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken();

  const expiresIn = getRefreshTokenExpirySeconds();
  await storeRefreshToken(user.id, refreshToken, expiresIn);

  return c.json(
    {
      success: true as const,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
        },
        accessToken,
        refreshToken,
      },
    },
    200,
  );
};

export const refreshHandler: AppRouteHandler<typeof refresh> = async (c) => {
  const { refreshToken } = c.req.valid("json");

  const allUsers = await db.query.users.findMany({
    where: eq(users.isActive, true),
  });

  let foundUser = null;

  for (const user of allUsers) {
    const isValid = await isRefreshTokenValid(user.id, refreshToken);
    if (isValid) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    throw invalidCredentials("Refresh token yaroqsiz yoki muddati tugagan");
  }

  await deleteRefreshToken(foundUser.id, refreshToken);

  const newAccessToken = await generateAccessToken(
    foundUser.id,
    foundUser.role,
  );
  const newRefreshToken = generateRefreshToken();

  const expiresIn = getRefreshTokenExpirySeconds();
  await storeRefreshToken(foundUser.id, newRefreshToken, expiresIn);

  return c.json(
    {
      success: true as const,
      data: {
        user: {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          isActive: foundUser.isActive,
          createdAt: foundUser.createdAt.toISOString(),
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    },
    200,
  );
};

export const logoutHandler: AppRouteHandler<typeof logout> = async (c) => {
  const user = c.get("user");
  const { refreshToken } = c.req.valid("json");

  await deleteRefreshToken(user.id, refreshToken);

  return c.json(
    {
      success: true as const,
      data: {
        message: "Muvaffaqiyatli chiqildi",
      },
    },
    200,
  );
};

export const meHandler: AppRouteHandler<typeof me> = async (c) => {
  const authUser = c.get("user");

  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (!user) {
    throw notFound("Foydalanuvchi", authUser.id);
  }

  return c.json(
    {
      success: true as const,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      },
    },
    200,
  );
};

export const updateHandler: AppRouteHandler<typeof update> = async (c) => {
  const authUser = c.get("user");
  const body = UpdateRequestSchema.parse(await c.req.json());

  const user = await db.query.users.findFirst({
    where: eq(users.id, authUser.id),
  });

  if (!user) {
    throw notFound("Foydalanuvchi", authUser.id);
  }

  const data: { username?: string; password?: string } = {};

  if (body.username !== undefined) {
    const foundUser = await db.query.users.findFirst({
      where: eq(users.username, body.username),
    });

    if (foundUser) {
      throw conflict("username band");
    }

    data.username = body.username;
  }

  if (body.password && body.currentPassword) {
    const isValid = verifyPassword(body.currentPassword, user.password);

    if (!isValid) {
      throw invalidCredentials("parol noto'g'ri");
    }

    const passwordHash = await hashPassword(body.password);
    data.password = passwordHash;
  }

  await db.update(users).set(data).where(eq(users.id, user.id));

  return c.json(
    {
      success: true as const,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      },
    },
    200,
  );
};
