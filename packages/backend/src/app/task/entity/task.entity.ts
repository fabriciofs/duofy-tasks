import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  description: string;

  @CreateDateColumn({ name: 'due_date' })
  @ApiProperty()
  dueDate: Date;

  @Column()
  @ApiProperty()
  priority: string;

  @Column({ name: 'is_done' })
  @ApiProperty()
  isDone: boolean;

  @CreateDateColumn({ name: 'created_at', select: false })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  @ApiProperty()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  @ApiProperty()
  deletedAt: Date;

  constructor(task?: Partial<TaskEntity>) {
    this.id = task?.id;
    this.title = task?.title;
    this.description = task?.description;
    this.dueDate = task?.dueDate;
    this.priority = task?.priority;
    this.isDone = task?.isDone;
    this.createdAt = task?.createdAt;
    this.updatedAt = task?.updatedAt;
    this.deletedAt = task?.deletedAt;
  }
}
