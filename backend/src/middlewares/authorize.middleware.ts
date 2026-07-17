import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import logger from '../utilities/logger';

// Role checking middleware
export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`RBAC blocked: User ${req.user.email} (Role: ${req.user.role}) attempted to access resource requiring [${allowedRoles.join(', ')}]`);
      return res.status(403).json({ success: false, message: 'Access denied: Insufficient permissions.' });
    }

    return next();
  };
}

// Specific permission checking middleware
export function authorizePermissions(...requiredPermissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Super Admin bypasses all specific permission checks
    if (req.user.role === 'Super Admin') {
      return next();
    }

    const hasAll = requiredPermissions.every((p) => req.user?.permissions.includes(p));
    if (!hasAll) {
      logger.warn(`Permission verification blocked: User ${req.user.email} lacks permissions: [${requiredPermissions.join(', ')}]`);
      return res.status(403).json({ success: false, message: 'Access forbidden: Missing specific module permissions.' });
    }

    return next();
  };
}
