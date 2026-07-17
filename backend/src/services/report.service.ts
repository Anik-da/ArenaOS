import { ReportRepository } from '../repositories/specialized.repository';
import logger from '../utilities/logger';

class ReportService {
  async generateReport(type: string, format: 'pdf' | 'excel' | 'csv', options: any) {
    const { actorId } = options;
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `reports/${type}_${timestampStr}.${format}`;
    const mockFileUrl = `https://storage.googleapis.com/ares-ai-reports/${filename}`;

    const reportContent = await ReportRepository.create({
      type: type as any,
      format,
      generatedBy: actorId || 'system',
      fileUrl: mockFileUrl,
      timestamp: new Date(),
    });

    logger.info(`Report compiled and logged: ${filename}`);
    return reportContent;
  }

  async generateDailyReport(stadiumId: string, format: 'pdf' | 'excel' | 'csv') {
    logger.info(`Daily operations report generation invoked for ${stadiumId} in format ${format}`);
    return this.generateReport('daily', format, { actorId: 'system' });
  }

  async listReports(options: any) {
    return await ReportRepository.queryAdvanced(options);
  }

  async getReportById(reportId: string) {
    return await ReportRepository.getById(reportId);
  }
}

export const reportService = new ReportService();
export default reportService;
