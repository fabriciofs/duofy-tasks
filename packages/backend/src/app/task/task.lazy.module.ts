import { DynamicModule } from '@nestjs/common';

import { TaskModule } from './task.module';

export function TaskLazyModule(): DynamicModule {
  return {
    module: TaskModule,
    imports: [TaskModule],
  };
}
