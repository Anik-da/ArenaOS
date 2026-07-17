import { SettingRepository, AuditRepository } from '../repositories/specialized.repository';
import { cacheService } from './cache.service';
import logger from '../utilities/logger';

class SettingsService {
  async get(key: string) {
    const cacheKey = `setting:${key}`;
    const cached = await cacheService.get<any>(cacheKey);
    if (cached) return cached;

    const settings = await SettingRepository.query('key', '==', key);
    if (settings.length === 0) return null;

    const val = settings[0].value;
    await cacheService.set(cacheKey, val, 1800); // Cache for 30 minutes
    return val;
  }

  async update(data: any) {
    const { key, value, description } = data;
    const settings = await SettingRepository.query('key', '==', key);
    
    let settingRecord;
    if (settings.length > 0) {
      settingRecord = settings[0];
      await SettingRepository.update(settingRecord.id!, { value, description });
    } else {
      settingRecord = await SettingRepository.create({ key, value, description });
    }

    // Invalidate Cache
    await cacheService.del(`setting:${key}`);
    await cacheService.del('settings:all');

    logger.info(`System setting updated: ${key} = ${JSON.stringify(value)}`);
    return { key, value };
  }

  async bulkUpdate(settingsList: { key: string; value: any }[]) {
    for (const item of settingsList) {
      await this.update(item);
    }
    return { count: settingsList.length };
  }

  async list() {
    const cacheKey = 'settings:all';
    const cached = await cacheService.get<any[]>(cacheKey);
    if (cached) return cached;

    const settings = await SettingRepository.getAll();
    await cacheService.set(cacheKey, settings, 600); // 10 minutes cache
    return settings;
  }
}

export const settingsService = new SettingsService();
