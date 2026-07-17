import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}
export default NotFoundError;
