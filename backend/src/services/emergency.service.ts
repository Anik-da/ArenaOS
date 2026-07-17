import { EmergencyAlertRepository, NotificationRepository } from '../repositories/specialized.repository';
import { io } from '../index';
import logger from '../utilities/logger';

class EmergencyService {
  async createAlert(data: any) {
    const alert = await EmergencyAlertRepository.create({
      ...data,
      active: true,
      timestamp: new Date(),
    });
    logger.info(`Emergency alert created: ${alert.title} (Severity: ${alert.severity})`);
    
    // Broadcast automatically if critical
    if (alert.severity === 'critical') {
      await this.broadcastAlert(alert.id!);
    }
    return alert;
  }

  async listAlerts(options: any) {
    return await EmergencyAlertRepository.queryAdvanced(options);
  }

  async getActiveAlerts() {
    return await EmergencyAlertRepository.query('active', '==', true);
  }

  async updateAlert(id: string, data: any) {
    return await EmergencyAlertRepository.update(id, data);
  }

  async broadcastAlert(alertId: string) {
    const alert = await EmergencyAlertRepository.getById(alertId);
    if (!alert) throw new Error('Alert not found');

    // Emit via Socket.IO
    io.to('stadium:live').emit('alert:emergency', alert);
    logger.info(`Emergency broadcast sent for alert ID: ${alertId}`);
    return { broadcasted: true, alert };
  }

  async handleSOS(data: any) {
    logger.error(`🚨 SOS ALERT RECEIVED from User ID: ${data.userId} in Zone: ${data.zoneId || 'unknown'}`);
    
    // Record as notification for security/medical staff
    const notification = await NotificationRepository.create({
      userId: 'staff_broadcast',
      title: '🚨 CRITICAL SOS ALERT',
      body: `Fan SOS received. User ID: ${data.userId}. Zone: ${data.zoneId || 'N/A'}. Message: ${data.message || 'None'}`,
      read: false,
      type: 'emergency',
      timestamp: new Date(),
    });

    // Emit live to security channel
    io.to('stadium:security').emit('alert:security', {
      type: 'SOS_ALERT',
      userId: data.userId,
      zoneId: data.zoneId,
      coordinates: data.coordinates,
      message: data.message,
      timestamp: new Date(),
    });

    return { success: true, notificationId: notification.id };
  }
}

export const emergencyService = new EmergencyService();
