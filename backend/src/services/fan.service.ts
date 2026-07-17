import { FanProfileRepository, TicketRepository } from '../repositories/specialized.repository';
import { emergencyService } from './emergency.service';
import logger from '../utilities/logger';

class FanService {
  async getProfile(userId: string) {
    const profiles = await FanProfileRepository.query('userId', '==', userId);
    if (profiles.length === 0) {
      // Auto-provision a basic fan profile if not exists
      return await FanProfileRepository.create({
        userId,
        favorites: [],
        loyaltyPoints: 0,
        createdAt: new Date(),
      });
    }
    return profiles[0];
  }

  async updateProfile(userId: string, data: any) {
    const profile = await this.getProfile(userId);
    await FanProfileRepository.update(profile.id!, data);
    return { ...profile, ...data };
  }

  async getTickets(userId: string) {
    const tickets = await TicketRepository.query('userId', '==', userId);
    return tickets;
  }

  async getOrders(userId: string) {
    // Ticket purchases double as orders in current scope
    return await this.getTickets(userId);
  }

  async getFavorites(userId: string) {
    const profile = await this.getProfile(userId);
    return profile.favorites || [];
  }

  async sendSOS(userId: string, data: any) {
    logger.warn(`FanSOS: User ${userId} sent SOS alert.`);
    return await emergencyService.handleSOS({
      ...data,
      userId,
    });
  }
}

export const fanService = new FanService();
