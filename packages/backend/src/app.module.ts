import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskLazyModule } from './app/task/task.lazy.module';
import { CacheInterceptor } from './cache/cache.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerice: ConfigService) => ({
        type: 'postgres',
        host: configSerice.get('DB_HOST', 'localhost'),
        port: Number(configSerice.get('DB_PORT', 5432)),
        username: configSerice.get('DB_USER', 'postgres'),
        password: configSerice.get('DB_PWS', 'postgres'),
        database: configSerice.get('DB_NAME', 'tasks'),
        entities: [__dirname + '/**/*.entity{.js,.ts}'],
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),
    TaskLazyModule(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
