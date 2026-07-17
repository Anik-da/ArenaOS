import { NotificationRepository } from '../repositories/specialized.repository';
import { io } from '../index';
import logger from '../utilities/logger';

class NotificationService {
  async send(data: any) {
    const notification = await NotificationRepository.create({
      userId: data.userId,
      title: data.title,
      body: data.body,
      read: false,
      type: data.type || 'general',
      timestamp: new Date(),
    });

    // Send Realtime via Socket.io
    io.to(`user:${data.userId}`).emit('notification:user', notification);
    
    logger.info(`Notification sent to User ${data.userId}: ${data.title}`);
    return notification;
  }

  async broadcast(data: any) {
    const notification = await NotificationRepository.create({
      userId: 'broadcast_all',
      title: data.title,
      body: data.body,
      read: false,
      type: data.type || 'general',
      timestamp: new Date(),
    });

    // Emit globally
    io.to('stadium:live').emit('telemetry:broadcast', notification);

    logger.info(`Broadcast notification sent: ${data.title}`);
    return notification;
  }

  async getUserNotifications(userId: string, options: any) {
    return await NotificationRepository.queryAdvanced(options);
  }

  async markRead(notificationIds: string[]) {
    for (const id of notificationIds) {
      await NotificationRepository.update(id, { read: true });
    }
  }

  async markAllRead(userId: string) {
    const unread = await NotificationRepository.queryAdvanced({
      filters: [
        { field: 'userId', op: '==', value: userId },
        { field: 'read', op: '==', value: false },
      ],
      limit: 250,
    });

    for (const item of unread.results) {
      if (item.id) {
        await NotificationRepository.update(item.id, { read: true });
      }
    }
  }
}

export const notificationService = new NotificationService();
