import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', errors: any = undefined) {
    super(message, 400, errors);
  }
}
export default BadRequestError;
