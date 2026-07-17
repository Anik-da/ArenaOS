import { Request, Response, NextFunction } from 'express';
import logger from '../utilities/logger';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export function errorHandlerMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log detailed trace
  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} \n Stack: ${err.stack}`);

  return res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred on the server.'
      : message,
    errors: err.errors || undefined,
  });
}
export default errorHandlerMiddleware;
