import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import logMiddleware from '@/functions/logMiddleware';

function validationMiddleware(
  schema: Joi.Schema,
  section: keyof Request
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };
    try {
      const value = await schema.validateAsync(req[section], validationOptions);
      req.body = value;
      logMiddleware('validation Middleware');
      next();
    } catch (e: any) {
      const errors: string[] = [];
      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });
      res.status(412).send({ errors });
    }
  };
}

export default validationMiddleware;
