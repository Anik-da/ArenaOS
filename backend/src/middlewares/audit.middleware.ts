import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AuditRepository } from '../repositories/specialized.repository';
import logger from '../utilities/logger';

export async function auditMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Capture request metadata
  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Intercept response finish
  res.on('finish', async () => {
    // Only audit mutations (POST, PUT, PATCH, DELETE) that were successful (2xx)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const actorId = req.user?.id || 'anonymous';
        const module = originalUrl.split('/')[2] || 'general';

        await AuditRepository.create({
          actorId,
          action: `${method} ${originalUrl}`,
          module,
          ipAddress: ip || req.headers['x-forwarded-for']?.toString() || '127.0.0.1',
          details: `Payload: ${JSON.stringify(req.body)}. Duration: ${Date.now() - start}ms`,
          timestamp: new Date(),
        });
      } catch (err: any) {
        logger.error(`Failed to write audit log: ${err.message}`);
      }
    }
  });

  return next();
}

export default auditMiddleware;
