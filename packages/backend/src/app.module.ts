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
        entities: [UserEntity, TaskEntity],
        synchronize: true,
      }),
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
