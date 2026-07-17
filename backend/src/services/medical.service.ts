import {
  MedicalRepository, AmbulanceRepository, DoctorRepository, PatientQueueRepository
} from '../repositories/specialized.repository';
import { io } from '../index';
import logger from '../utilities/logger';

class MedicalService {
  async createCase(data: any) {
    const caseRecord = await MedicalRepository.create({
      ...data,
      status: 'dispatched',
      timestamp: new Date(),
      responseStartTime: new Date(),
    });

    // Auto-create queue position
    const activeCases = await PatientQueueRepository.query('stadiumId', '==', data.stadiumId);
    const position = activeCases.length + 1;

    await PatientQueueRepository.create({
      stadiumId: data.stadiumId,
      medicalEventId: caseRecord.id!,
      priority: data.type === 'cardiac_arrest' ? 'critical' : 'normal',
      estimatedWaitMinutes: data.type === 'cardiac_arrest' ? 1 : 10,
      position,
      timestamp: new Date(),
    });

    io.to('stadium:medical').emit('alert:medical', {
      type: 'MEDICAL_CASE_CREATED',
      case: caseRecord,
      position,
    });

    return caseRecord;
  }

  async dispatchAmbulance(data: any) {
    const { medicalEventId, ambulanceId } = data;
    await MedicalRepository.update(medicalEventId, { ambulanceId, status: 'triage' });
    await AmbulanceRepository.update(ambulanceId, { status: 'dispatched' });

    logger.info(`Ambulance ${ambulanceId} dispatched to case ${medicalEventId}`);
    return { success: true, medicalEventId, ambulanceId };
  }

  async assignDoctor(data: any) {
    const { medicalEventId, doctorId } = data;
    await MedicalRepository.update(medicalEventId, { assignedDoctor: doctorId });
    await DoctorRepository.update(doctorId, { available: false });

    logger.info(`Doctor ${doctorId} assigned to case ${medicalEventId}`);
    return { success: true, medicalEventId, doctorId };
  }

  async updatePatientStatus(caseId: string, status: any) {
    const updateData: any = { status };
    if (status === 'resolved') {
      updateData.responseEndTime = new Date();
      
      // Clean up queue position
      const queueEntries = await PatientQueueRepository.query('medicalEventId', '==', caseId);
      for (const entry of queueEntries) {
        if (entry.id) {
          await PatientQueueRepository.delete(entry.id);
        }
      }
    }

    await MedicalRepository.update(caseId, updateData);
    logger.info(`Medical Case ${caseId} status updated to: ${status}`);
    return { success: true, caseId, status };
  }

  async getPatientQueue(stadiumId: string) {
    const queue = await PatientQueueRepository.query('stadiumId', '==', stadiumId);
    return queue.sort((a, b) => a.position - b.position);
  }

  async getResponseMetrics(stadiumId: string) {
    const cases = await MedicalRepository.query('stadiumId', '==', stadiumId);
    const resolvedCases = cases.filter((c: any) => c.status === 'resolved' && c.responseStartTime && c.responseEndTime);

    if (resolvedCases.length === 0) {
      return { averageResponseTimeSec: 0, totalCases: cases.length, resolvedCount: 0 };
    }

    let totalDiffMs = 0;
    resolvedCases.forEach((c: any) => {
      const start = new Date(c.responseStartTime).getTime();
      const end = new Date(c.responseEndTime).getTime();
      totalDiffMs += (end - start);
    });

    const averageResponseTimeSec = Math.round((totalDiffMs / resolvedCases.length) / 1000);
    return {
      averageResponseTimeSec,
      totalCases: cases.length,
      resolvedCount: resolvedCases.length,
    };
  }
}

export const medicalService = new MedicalService();
