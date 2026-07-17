import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { auth } from '../config/firebase';
import { config } from '../config/app';
import { UserRepository } from '../repositories/specialized.repository';
import { cacheService } from '../services/cache.service';
import logger from '../utilities/logger';
import ApiResponse from '../utilities/apiResponse';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    uid: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Authorization token required.', 401);
    }

    const token = authHeader.split(' ')[1];

    // 1. JWT Local Pipeline Check first (fast, CPU-bound signature check)
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      req.user = {
        id: decoded.id,
        uid: decoded.uid,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions || [],
      };
      return next();
    } catch (err) {
      // If JWT verification fails, proceed to Firebase verification pipeline
    }

    // 2. Check Redis session cache for Firebase token to avoid expensive verification and DB lookups
    const sessionCacheKey = `user:session:${token}`;
    const cachedUser = await cacheService.get<any>(sessionCacheKey);
    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    // 3. Firebase Auth Verification Pipeline (Network/crypto intensive)
    let firebaseUser;
    try {
      firebaseUser = await auth.verifyIdToken(token);
    } catch (err: any) {
      logger.warn(`Firebase token verification failed: ${err.message}`);
      return ApiResponse.error(res, 'Invalid or expired credentials.', 401);
    }

    if (!firebaseUser) {
      return ApiResponse.error(res, 'Invalid or expired credentials.', 401);
    }

    // 4. Resolve user details and permissions from database
    let dbUser = await UserRepository.getById(firebaseUser.uid);
    
    if (!dbUser) {
      // Auto-provision basic profile if they pass Firebase authentication but have no db record yet
      dbUser = await UserRepository.create({
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.name || 'Anonymous User',
        role: (firebaseUser.role as any) || 'Fan',
        permissions: [],
        isActive: true,
        createdAt: new Date(),
      });
    }

    if (!dbUser.isActive) {
      return ApiResponse.error(res, 'User account is currently deactivated.', 403);
    }

    const sessionUser = {
      id: dbUser.id!,
      uid: dbUser.uid,
      email: dbUser.email,
      role: dbUser.role,
      permissions: dbUser.permissions,
    };

    // Cache the verified user session in Redis for 15 minutes (900 seconds)
    await cacheService.set(sessionCacheKey, sessionUser, 900);

    req.user = sessionUser;
    return next();
  } catch (error: any) {
    logger.warn(`Auth middleware failure: ${error.message}`);
    return ApiResponse.error(res, 'Unauthorized access.', 401);
  }
}

export default authMiddleware;
