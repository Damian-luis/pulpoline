import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly isEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.isEnabled = this.configService.get('ENABLE_CACHE') === 'true';
    
    if (this.isEnabled) {
      const host = this.configService.get('REDIS_HOST');
      const port = this.configService.get('REDIS_PORT');

      if (!host || !port) {
        throw new Error('Redis configuration is missing. Please check REDIS_HOST and REDIS_PORT environment variables.');
      }

      this.redis = new Redis({
        host,
        port: parseInt(port),
      });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled) return null;
    
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.isEnabled) return;
    
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, stringValue);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isEnabled) return;
    
    await this.redis.del(key);
  }

  async onModuleDestroy() {
    if (this.isEnabled) {
      await this.redis.quit();
    }
  }
} 