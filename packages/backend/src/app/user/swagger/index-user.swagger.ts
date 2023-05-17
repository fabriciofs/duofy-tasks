import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';


export class IndexUserSwagger extends OmitType(UserEntity, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) { }
