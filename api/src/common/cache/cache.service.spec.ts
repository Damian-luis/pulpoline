import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'ENABLE_CACHE':
                  return 'true';
                case 'REDIS_HOST':
                  return 'localhost';
                case 'REDIS_PORT':
                  return '6379';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set and get cache value', async () => {
    const testKey = 'test-key';
    const testValue = { data: 'test-data' };

    await service.set(testKey, testValue);
    const result = await service.get(testKey);

    expect(result).toEqual(testValue);
  });

  it('should delete cache value', async () => {
    const testKey = 'test-key';
    const testValue = { data: 'test-data' };

    await service.set(testKey, testValue);
    await service.del(testKey);
    const result = await service.get(testKey);

    expect(result).toBeNull();
  });
}); 