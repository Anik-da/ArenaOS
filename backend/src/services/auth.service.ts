import jwt from 'jsonwebtoken';
import { config } from '../config/app';
import { UserRepository } from '../repositories/specialized.repository';
import { User } from '../models';
import logger from '../utilities/logger';

export class AuthService {
  async generateTokens(user: User) {
    const payload = {
      id: user.id,
      uid: user.uid,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    const refreshToken = jwt.sign({ uid: user.uid }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });

    return { accessToken, refreshToken };
  }

  async register(data: { email: string; name: string; role?: string }) {
    logger.info(`Registering new user in ARES backend database: ${data.email}`);
    
    // Check if user already exists
    const existing = await UserRepository.query('email', '==', data.email);
    if (existing.length > 0) {
      throw new Error('User already registered with this email address.');
    }

    const role = (data.role as any) || 'Fan';
    
    // Assign basic default permissions based on role
    const permissions: string[] = [];
    if (role === 'Super Admin') {
      permissions.push('all');
    } else if (role === 'Security Officer') {
      permissions.push('security:read', 'security:write', 'drones:control');
    } else if (role === 'Medical Staff') {
      permissions.push('medical:read', 'medical:write');
    }

    const uid = Math.random().toString(36).substring(2, 15);
    const newUser = await UserRepository.create({
      id: uid,
      uid,
      email: data.email,
      name: data.name,
      role,
      permissions,
      isActive: true,
      createdAt: new Date(),
    });

    const tokens = await this.generateTokens(newUser);
    return { user: newUser, ...tokens };
  }

  async login(email: string) {
    logger.info(`Processing auth session login for: ${email}`);
    const users = await UserRepository.query('email', '==', email);
    if (users.length === 0) {
      throw new Error('User not found. Please register first.');
    }
    
    const user = users[0];
    if (!user.isActive) {
      throw new Error('User account is currently deactivated.');
    }

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
      const user = await UserRepository.getById(decoded.uid);
      if (!user || !user.isActive) {
        throw new Error('User session not active.');
      }
      return this.generateTokens(user);
    } catch (err: any) {
      logger.warn(`Token refresh failed: ${err.message}`);
      throw new Error('Invalid refresh credentials.');
    }
  }
}

export const authService = new AuthService();
export default authService;
