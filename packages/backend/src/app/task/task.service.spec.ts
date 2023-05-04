import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entity/task.entity';
import { TaskService } from './task.service';

const taskEntityList: TaskEntity[] = [
  new TaskEntity({
    title: 'task-1',
    description: 'Description task-1',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
  new TaskEntity({
    title: 'task-2',
    description: 'Description task-2',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
  new TaskEntity({
    title: 'task-3',
    description: 'Description task-3',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
];

const updatedTaskEntityItem = new TaskEntity({
  title: 'task-1',
  description: 'Description task-1',
  dueDate: new Date(),
  priority: 'LOW',
  isDone: true,
});

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(taskEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(taskEntityList[0]),
            create: jest.fn().mockReturnValue(taskEntityList[0]),
            merge: jest.fn().mockReturnValue(updatedTaskEntityItem),
            save: jest.fn().mockResolvedValue(taskEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
    expect(taskRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a task entity list successfully', async () => {
      const result = await taskService.findAll();
      expect(result).toEqual(taskEntityList);
      expect(taskRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('should return a task entity item successfully', async () => {
      const result = await taskService.findOneOrFail('1');
      expect(result).toEqual(taskEntityList[0]);
      expect(taskRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new entity item successfully', async () => {
      const data: CreateTaskDto = {
        title: 'new-task',
        description: 'Description new-task',
        dueDate: new Date(),
        priority: 'LOW',
        isDone: false,
      };
      const result = await taskService.create(data);
      expect(result).toEqual(taskEntityList[0]);
      expect(taskRepository.create).toHaveBeenCalledTimes(1);
      expect(taskRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a task entity item successfully', async () => {
      const data: UpdateTaskDto = { isDone: false };
      jest
        .spyOn(taskRepository, 'save')
        .mockResolvedValueOnce(updatedTaskEntityItem);
      const result = await taskService.update('1', data);
      expect(result).toEqual(updatedTaskEntityItem);
      expect(taskRepository.save).toHaveBeenCalledTimes(1);
      expect(taskRepository.merge).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteById', () => {
    it('should delete a task entity item successfully', async () => {
      expect(await taskService.deleteById('1')).toBeUndefined();
      expect(taskRepository.softDelete).toHaveBeenCalledTimes(1);
    });
  });
});
