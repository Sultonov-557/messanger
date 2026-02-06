import { ErrorCode, type ErrorCodeType, type ErrorDetails } from "@shared/types";
import * as HttpStatusCodes from "stoker/http-status-codes";

export { ErrorCode, type ErrorCodeType, type ErrorDetails };

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: ErrorCodeType;
	public readonly details?: ErrorDetails[];
	public readonly isOperational: boolean;

	constructor(
		message: string,
		code: ErrorCodeType,
		statusCode: number = HttpStatusCodes.BAD_REQUEST,
		details?: ErrorDetails[]
	) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.statusCode = statusCode;
		this.details = details;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}

	toJSON() {
		return {
			success: false as const,
			error: {
				code: this.code,
				message: this.message,
				details: this.details,
			},
		};
	}
}

export function validationError(message: string, details?: ErrorDetails[]) {
	return new AppError(message, ErrorCode.VALIDATION_ERROR, HttpStatusCodes.BAD_REQUEST, details);
}

export function invalidInput(field: string, reason: string) {
	return new AppError(
		`Invalid input: ${field}`,
		ErrorCode.INVALID_INPUT,
		HttpStatusCodes.BAD_REQUEST,
		[{ field, reason }]
	);
}

export function unauthorized(message = "Authentication required") {
	return new AppError(message, ErrorCode.UNAUTHORIZED, HttpStatusCodes.UNAUTHORIZED);
}

export function invalidToken(message = "Invalid or malformed token") {
	return new AppError(message, ErrorCode.INVALID_TOKEN, HttpStatusCodes.UNAUTHORIZED);
}

export function tokenExpired(message = "Token has expired") {
	return new AppError(message, ErrorCode.TOKEN_EXPIRED, HttpStatusCodes.UNAUTHORIZED);
}

export function invalidCredentials(message = "Invalid email or password") {
	return new AppError(message, ErrorCode.INVALID_CREDENTIALS, HttpStatusCodes.UNAUTHORIZED);
}

export function forbidden(message = "Access denied") {
	return new AppError(message, ErrorCode.FORBIDDEN, HttpStatusCodes.FORBIDDEN);
}

export function insufficientPermissions(requiredRole?: string) {
	const message = requiredRole
		? `Insufficient permissions. Required role: ${requiredRole}`
		: "Insufficient permissions";
	return new AppError(message, ErrorCode.INSUFFICIENT_PERMISSIONS, HttpStatusCodes.FORBIDDEN);
}

export function notFound(resource = "Resource", id?: string) {
	const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
	return new AppError(message, ErrorCode.RESOURCE_NOT_FOUND, HttpStatusCodes.NOT_FOUND);
}

export function conflict(message: string, details?: ErrorDetails[]) {
	return new AppError(message, ErrorCode.CONFLICT, HttpStatusCodes.CONFLICT, details);
}

export function alreadyExists(resource: string, field?: string) {
	const message = field
		? `${resource} with this ${field} already exists`
		: `${resource} already exists`;
	return new AppError(message, ErrorCode.ALREADY_EXISTS, HttpStatusCodes.CONFLICT);
}

export function businessError(message: string, details?: ErrorDetails[]) {
	return new AppError(
		message,
		ErrorCode.BUSINESS_RULE_VIOLATION,
		HttpStatusCodes.UNPROCESSABLE_ENTITY,
		details
	);
}

export function invalidOperation(message: string) {
	return new AppError(message, ErrorCode.INVALID_OPERATION, HttpStatusCodes.UNPROCESSABLE_ENTITY);
}

export function rateLimitExceeded(message = "Too many requests. Please try again later.") {
	return new AppError(message, ErrorCode.RATE_LIMIT_EXCEEDED, HttpStatusCodes.TOO_MANY_REQUESTS);
}

export function internalError(message = "An unexpected error occurred") {
	return new AppError(message, ErrorCode.INTERNAL_ERROR, HttpStatusCodes.INTERNAL_SERVER_ERROR);
}

export function databaseError(message = "Database operation failed") {
	return new AppError(message, ErrorCode.DATABASE_ERROR, HttpStatusCodes.INTERNAL_SERVER_ERROR);
}
