// libs/redis-cache/src/redis-cache.module.ts
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,                     // 앱 전체에서 사용 가능
      imports: [ConfigModule],            // ConfigService 주입을 위해
      useFactory: async (cfg: ConfigService) => ({
        store: redisStore,                // Redis 스토어 지정
        host: cfg.get<string>('REDIS_HOST'),
        port: cfg.get<number>('REDIS_PORT'),
        ttl: 7 * 24 * 60 * 60,            // 기본 TTL: 7일 (초 단위)
        // password: cfg.get<string>('REDIS_PASSWORD'), // 필요 시
        // db: 1,                                  // DB 번호 지정 가능
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],                // 다른 모듈에서 import 하도록
})
export class RedisClientModule { }
