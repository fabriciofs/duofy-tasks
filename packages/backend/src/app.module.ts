import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskEntity } from './app/task/entities/task.entity';
import { TaskLazyModule } from './app/task/task.lazy.module';
import { UserEntity } from './app/user/entities/user.entity';
import { UserLazyModule } from './app/user/user.lazy.module';
import { CacheInterceptor } from './cache/cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) ?? 5432,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PWS ?? 'postgres',
      database: process.env.DB_NAME ?? 'tasks',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    TaskLazyModule(),
    UserLazyModule(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule { }
