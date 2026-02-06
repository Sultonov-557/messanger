import { z } from "@hono/zod-openapi";

export const LoginSchema = z.object({
  username: z.string().min(4).max(20).openapi({
    example: "user123",
    description: "Username",
  }),
  password: z.string().min(4).max(100).openapi({
    example: "password123",
    description: "Parol",
  }),
});

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1).openapi({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      description: "Refresh token",
    }),
  })
  .openapi("RefreshTokenRequest");

export const UserSchema = z.object({
  id: z.string().uuid().openapi({
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  username: z.string().openapi({
    example: "username",
  }),
  role: z.enum(["user", "admin"]).openapi({
    example: "user",
  }),
  isActive: z.boolean().openapi({
    example: true,
  }),
  createdAt: z.string().datetime().openapi({
    example: "2024-01-15T10:30:00.000Z",
  }),
});

export const AuthResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    user: UserSchema,
    accessToken: z.string().openapi({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    }),
    refreshToken: z.string().openapi({
      example: "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    }),
  }),
});

export const MeResponseSchema = z.object({
  success: z.literal(true),
  data: UserSchema,
});

export const MessageResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    message: z.string().openapi({
      example: "Successfully logged out",
    }),
  }),
});

export const UpdateRequestSchema = z.object({
  username: z
    .string()
    .min(4)
    .max(20)
    .optional()
    .openapi({ example: "user123" }),
  currentPassword: z
    .string()
    .min(4)
    .max(90)
    .optional()
    .openapi({ example: "password123" }),
  password: z
    .string()
    .min(4)
    .max(90)
    .optional()
    .openapi({ example: "pass123" }),
});

export const UpdateResponseSchema = z
  .object({
    success: z.literal(true),
    data: UserSchema,
  })
  .openapi("MeResponse");

export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type UserOutput = z.infer<typeof UserSchema>;
