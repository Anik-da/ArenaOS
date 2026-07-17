import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access Forbidden') {
    super(message, 403);
  }
}
export default ForbiddenError;
