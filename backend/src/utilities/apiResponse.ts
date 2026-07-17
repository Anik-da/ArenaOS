import { Response } from 'express';

export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasNext?: boolean;
  nextCursor?: string | null;
}

export class ApiResponse {
  /**
   * Send a successful API response.
   */
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = 200,
    meta?: PaginationMeta
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
    });
  }

  /**
   * Send an error API response.
   */
  public static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errors: any = undefined
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors ? { errors } : {}),
    });
  }
}
export default ApiResponse;
