import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../../task/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  password: string;

  @OneToMany(() => TaskEntity, task => task.user)
  tasks: TaskEntity[];

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;

  constructor(user?: Partial<UserEntity>) {
    this.id = user?.id;
    this.email = user?.email;
    this.name = user?.name;
    this.password = user?.password;
    this.tasks = user?.tasks;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
    this.deletedAt = user?.deletedAt;
  }
}