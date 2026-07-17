import {
  TicketRepository,
  ParkingRepository,
  SecurityRepository,
  CrowdRepository
} from '../repositories/specialized.repository';
import logger from '../utilities/logger';

export class AnalyticsService {
  async getStadiumDashboardAnalytics(stadiumId: string) {
    logger.info(`Compiling stadium analytics dataset for: ${stadiumId}`);
    
    // Fetch all entities (using optimized counts for ticketing)
    const bookedQuery = await TicketRepository.queryAdvanced({
      filters: [{ field: 'status', op: '==', value: 'booked' }],
      limit: 0
    });
    const validatedQuery = await TicketRepository.queryAdvanced({
      filters: [{ field: 'status', op: '==', value: 'validated' }],
      limit: 0
    });

    const totalTicketsBooked = bookedQuery.total + validatedQuery.total;
    const validatedTicketsCount = validatedQuery.total;

    const parkingSlots = await ParkingRepository.query('stadiumId', '==', stadiumId);
    const incidents = await SecurityRepository.query('stadiumId', '==', stadiumId);
    const crowdEntries = await CrowdRepository.query('stadiumId', '==', stadiumId);
    
    const parkingOccupied = parkingSlots.filter(s => s.status === 'occupied').length;
    const parkingOccupancyPct = parkingSlots.length > 0 ? (parkingOccupied / parkingSlots.length) * 100 : 0;

    const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;

    let averageCrowdDensity = 0;
    if (crowdEntries.length > 0) {
      const sum = crowdEntries.reduce((acc, curr) => acc + curr.currentDensity, 0);
      averageCrowdDensity = sum / crowdEntries.length;
    }

    return {
      stadiumId,
      ticketing: {
        totalBooked: totalTicketsBooked,
        attendanceCheckedIn: validatedTicketsCount,
        occupancyPct: totalTicketsBooked > 0 ? (validatedTicketsCount / totalTicketsBooked) * 100 : 0,
      },
      parking: {
        totalSlots: parkingSlots.length,
        occupiedCount: parkingOccupied,
        occupancyPct: parseFloat(parkingOccupancyPct.toFixed(1)),
      },
      security: {
        activeCount: activeIncidents,
        resolvedCount: resolvedIncidents,
        totalReported: incidents.length,
      },
      crowd: {
        averageDensityPct: parseFloat(averageCrowdDensity.toFixed(1)),
      },
      timestamp: new Date(),
    };
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
