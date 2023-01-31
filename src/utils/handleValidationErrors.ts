import { Request, NextFunction, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { fromZodError } from "zod-validation-error";
import { AnyZodObject, ZodError } from "zod";
import { BadRequestError } from "../errors";
import logger from "./logger";

export default (req: Request) => {
	const validationErrors: Result<ValidationError> = validationResult(req);
	if (!validationErrors.isEmpty()) {
		throw new BadRequestError(
			"Validation Error",
			400,
			validationErrors.array()
		);
	}
};

export const validate =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { body } = req;
			await schema.parseAsync(body);
			return next();
		} catch (err) {
			if (err instanceof ZodError) {
				const error = fromZodError(err);
				return res.status(400).json(error.message);
			} else {
				return next(err);
			}
		}
	};
