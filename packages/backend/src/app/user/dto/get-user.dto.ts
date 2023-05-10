import { OmitType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

export class GetUserDto extends OmitType(CreateUserDto, ['password']) {}
