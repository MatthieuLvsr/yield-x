import { Elysia } from "elysia";
import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from "../../generated/prisma/internal/prismaNamespace";

export const prismaErrorPlugin = (entity: string) =>
	new Elysia({
		name: "prisma-error-handler",
	}).onError({ as: "scoped" }, ({ error, set }) => {
		if (error instanceof PrismaClientUnknownRequestError) {
			console.error("PrismaClientUnknownRequestError ->", error);
			set.status = "Internal Server Error";
			return {
				error: set.status,
				message: error.message,
				cause: error.cause,
			};
		}

		if (!(error instanceof PrismaClientKnownRequestError)) {
			// Let elysia handle the error if it's not a Prisma error
			return;
		}

		// Handle different Prisma error codes
		switch (error.code) {
			case "P2025": {
				// Record not found
				set.status = "Not Found";
				return {
					error: set.status,
					message: `${entity} not found`,
					code: error.code,
				};
			}

			case "P2002": {
				// Unique constraint violation
				set.status = "Conflict";
				const field = (error.meta?.target as string[]) || ["field"];
				return {
					error: set.status,
					message: `${entity} with this ${field.join(", ")} already exists`,
					code: error.code,
				};
			}

			case "P2003": {
				// Foreign key constraint violation
				set.status = "Conflict";
				return {
					error: set.status,
					message: `Related ${error.meta?.field_name || "entity"} does not exist`,
					code: error.code,
				};
			}

			case "P2000": {
				// Value too long
				set.status = "Bad Request";
				return {
					error: set.status,
					message: `Input value too long for field ${error.meta?.target || ""}`,
					code: error.code,
				};
			}

			default: {
				// Unhandled error
				set.status = "Internal Server Error";
				console.error(error);
				return {
					error: set.status,
					message: error.message,
					code: error.code,
				};
			}
		}
	});
