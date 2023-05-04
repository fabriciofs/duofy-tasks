import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsIn(['HIGH', 'LOW'])
  @ApiProperty()
  priority: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsBoolean()
  isDone: boolean;
}
