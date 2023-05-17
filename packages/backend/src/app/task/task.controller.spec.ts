import { Test, TestingModule } from '@nestjs/testing';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

const taskEntityList: TaskEntity[] = [
  new TaskEntity({
    id: '1',
    title: 'task-1',
    description: 'Description task-1',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
  new TaskEntity({
    id: '2',
    title: 'task-2',
    description: 'Description task-2',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
  new TaskEntity({
    id: '3',
    title: 'task-3',
    description: 'Description task-3',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  }),
];

const newTaskEntity = new TaskEntity({
  title: 'new-task',
  description: 'Description new-task',
  dueDate: new Date(),
  priority: 'LOW',
  isDone: false,
});

const updatedTaskEntity = new TaskEntity({
  id: '1',
  title: 'task-1',
  description: 'Description task-1',
  dueDate: new Date(),
  priority: 'LOW',
  isDone: true,
});

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(taskEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(taskEntityList[0]),
            create: jest.fn().mockResolvedValue(newTaskEntity),
            update: jest.fn().mockResolvedValue(updatedTaskEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
    expect(taskService).toBeDefined();
  });

  describe('findAll', () => {
    it('shoud return a task list entity successfully', async () => {
      const result = await taskController.findAll();
      expect(result).toEqual(taskEntityList);
      expect(taskService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('shoud create a new task item successfully', async () => {
      const body: CreateTaskDto = {
        title: 'new-task',
        description: 'Description new-task',
        dueDate: new Date(),
        priority: 'LOW',
        isDone: false,
      };
      const result = await taskController.create(body);
      expect(result).toEqual({
        ...body,
        dueDate: expect.any(Date),
      });
      expect(taskService.create).toHaveBeenCalledTimes(1);
      expect(taskService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('findOneOrFail', () => {
    it('shoud show a task item successfully', async () => {
      const result = await taskController.findOneOrFail('1');
      expect(result).toEqual(taskEntityList[0]);
      expect(taskService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(taskService.findOneOrFail).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('shoud update a task item successfully', async () => {
      const body: UpdateTaskDto = { isDone: false };
      const result = await taskController.update('1', body);
      expect(result).toEqual(updatedTaskEntity);
      expect(taskService.update).toHaveBeenCalledTimes(1);
      expect(taskService.update).toHaveBeenCalledWith('1', body);
    });
  });

  describe('destroy', () => {
    it('shoud delete a task item successfully', async () => {
      const result = await taskController.remove('1');
      expect(result).toBeUndefined();
      expect(taskService.deleteById).toHaveBeenCalledTimes(1);
      expect(taskService.deleteById).toHaveBeenCalledWith('1');
    });
  });
});
