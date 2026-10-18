import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";

export class SchemaMiddleware {
  // Validates { body, query, params } against a Zod schema before the
  // controller runs, so handlers receive well-formed input.
  validate = (schema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          return res.status(400).json({
            code: 400,
            status: "error",
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          });
        }
        return next(error);
      }
    };
}
