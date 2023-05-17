import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';

import { TaskModule } from '../src/app/task/task.module';
import { CreateTaskDto } from 'src/app/task/dto/create-task.dto';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let createTaskId: string;
  const newTask: CreateTaskDto = {
    title: 'task-1',
    description: 'Description task-1',
    dueDate: new Date(),
    priority: 'LOW',
    isDone: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TaskModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: ['./src/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/tasks (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/tasks')
      .send(newTask)
      .expect(201);
    createTaskId = response.body.id;
    expect(response.body).toEqual({
      id: createTaskId,
      ...newTask,
      dueDate: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
    });
  });
  it('/api/tasks (GET)', () => {
    return request(app.getHttpServer()).get('/api/tasks').expect(200);
  });

  it('/api/tasks/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/tasks/${createTaskId}`)
      .expect(200);
    expect(response.body).toEqual({
      id: createTaskId,
      ...newTask,
      dueDate: expect.any(String),
    });
  });

  it('/api/tasks/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .put(`/api/tasks/${createTaskId}`)
      .send({ isDone: true })
      .expect(200);
    expect(response.body).toEqual({
      id: createTaskId,
      ...newTask,
      isDone: true,
      dueDate: expect.any(String),
      updatedAt: expect.any(String),
      deletedAt: null,
    });
  });

  it('/api/tasks/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/api/tasks/${createTaskId}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
