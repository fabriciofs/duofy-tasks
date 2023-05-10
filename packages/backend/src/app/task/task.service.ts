import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entity/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async findAll() {
    return await this.taskRepository.find({
      order: {
        isDone: 'ASC',
        priority: 'ASC',
        dueDate: 'ASC',
      },
    });
  }

  async findOneOrFail(id: string): Promise<TaskEntity> {
    try {
      return await this.taskRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskRepository.save(this.taskRepository.create(data));
  }

  async update(id: string, data: UpdateTaskDto): Promise<TaskEntity> {
    try {
      const task = await this.findOneOrFail(id);
      this.taskRepository.merge(task, data);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.findOneOrFail(id);
      await this.taskRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async updatePriorityForDueTasks(): Promise<void> {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const tasksToUpdate = await this.taskRepository.find({
      where: {
        dueDate: LessThanOrEqual(threeDaysFromNow),
        isDone: false,
        priority: 'LOW',
      },
    });
    tasksToUpdate.forEach((task) => {
      task.priority = 'HIGH';
    });
    await this.taskRepository.save(tasksToUpdate);
  }
}
