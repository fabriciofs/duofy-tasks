import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { TaskService } from './task.service';

@Injectable()
export class TaskCron {
  constructor(private taskService: TaskService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    await this.taskService.updatePriorityForDueTasks();
  }
}
