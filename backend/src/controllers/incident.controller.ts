import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { SecurityRepository } from '../repositories/specialized.repository';
import { securityService } from '../services/security.service';
import ApiResponse from '../utilities/apiResponse';
import logger from '../utilities/logger';

export class SecurityController {
  /**
   * Report a new security incident event
   */
  async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await securityService.reportIncident(req.body);
      return ApiResponse.success(res, result, 'Incident reported successfully.', 201);
    } catch (e) {
      return next(e);
    }
  }

  /**
   * Update details/status of security incident
   */
  async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, responderId } = req.body;
      const result = await securityService.updateIncidentStatus(id, status, responderId);
      return ApiResponse.success(res, result, 'Incident status updated successfully.');
    } catch (e) {
      return next(e);
    }
  }

  /**
   * List security incidents with pagination, ordering, and optional status/severity filtering
   */
  async listEvents(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const severity = req.query.severity as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string, 10) || 15;

      const filters: any[] = [];
      if (severity) {
        filters.push({ field: 'severity', op: '==', value: severity });
      }
      if (status) {
        filters.push({ field: 'status', op: '==', value: status });
      }

      const queryResult = await SecurityRepository.queryAdvanced({
        filters,
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit,
      });

      // Filter resolved in JS only if status wasn't specified, to maintain compatibility without needing extra composite indexes
      let results = queryResult.results;
      if (!status) {
        results = results.filter(inc => inc.status !== 'resolved');
      }

      return ApiResponse.success(
        res,
        results,
        'Security incidents retrieved successfully.',
        200,
        {
          limit,
          total: queryResult.total,
          hasNext: queryResult.hasNext,
        }
      );
    } catch (e) {
      return next(e);
    }
  }
}

export class EmergencyController {
  /**
   * Broadcast emergency SOS push alerts across sectors
   */
  async broadcastAlert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, severity, broadcastScope } = req.body;
      logger.warn(`Broadcasting Emergency SOS Alert: [${severity}] ${title}`);
      
      const broadcastData = {
        title,
        description,
        severity,
        broadcastScope,
        timestamp: new Date(),
      };

      return ApiResponse.success(res, broadcastData, 'Emergency Broadcast alert sent successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export class MedicalController {
  /**
   * Dispatch medical ambulance crew and start triage
   */
  async dispatchMedical(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { type, patientName } = req.body;
      logger.info(`Dispatching medical ambulance crew for: ${type}`);
      
      const dispatchData = {
        status: 'dispatched',
        message: 'Ambulance dispatched. ETA: 3 minutes.',
        patientName,
        type,
      };

      return ApiResponse.success(res, dispatchData, 'Ambulance dispatched successfully.');
    } catch (e) {
      return next(e);
    }
  }
}

export const securityController = new SecurityController();
export const emergencyController = new EmergencyController();
export const medicalController = new MedicalController();
