import { OmitType } from '@nestjs/swagger';

import { TaskEntity } from '../entities/task.entity';

export class IndexTaskSwagger extends OmitType(TaskEntity, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) { }
