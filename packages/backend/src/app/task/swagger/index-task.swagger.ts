import { OmitType } from '@nestjs/swagger';

import { TaskEntity } from '../entity/task.entity';

export class IndexTaskSwagger extends OmitType(TaskEntity, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
