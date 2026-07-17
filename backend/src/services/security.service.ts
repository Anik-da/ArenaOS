import { SecurityRepository } from '../repositories/specialized.repository';
import { SecurityEvent } from '../models';
import logger from '../utilities/logger';

export class SecurityService {
  async reportIncident(data: Omit<SecurityEvent, 'id' | 'timestamp' | 'status' | 'stadiumId'> & { stadiumId?: string }) {
    logger.warn(`Security Incident Reported: ${data.type} in Zone: ${data.zoneId}`);
    return SecurityRepository.create({
      stadiumId: data.stadiumId || 'stadium_main_1',
      type: data.type,
      zoneId: data.zoneId,
      status: 'open',
      severity: data.severity,
      description: data.description,
      timestamp: new Date(),
    });
  }

  async updateIncidentStatus(id: string, status: 'open' | 'investigating' | 'resolved', responderId?: string) {
    logger.info(`Updating Incident ${id} status to: ${status}`);
    
    const incident = await SecurityRepository.getById(id);
    if (!incident) throw new Error('Incident report not found.');

    const updatePayload: Partial<SecurityEvent> = {
      status,
      assignedResponderId: responderId || incident.assignedResponderId,
    };

    await SecurityRepository.update(id, updatePayload);
    return { ...incident, ...updatePayload };
  }

  async getActiveIncidents() {
    const openQuery = await SecurityRepository.queryAdvanced({
      filters: [{ field: 'status', op: '==', value: 'open' }],
      limit: 100
    });
    const investigatingQuery = await SecurityRepository.queryAdvanced({
      filters: [{ field: 'status', op: '==', value: 'investigating' }],
      limit: 100
    });
    return [...openQuery.results, ...investigatingQuery.results];
  }
}

export const securityService = new SecurityService();
export default securityService;
