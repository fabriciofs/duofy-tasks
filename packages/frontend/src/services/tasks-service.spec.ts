// src/services/TasksService.spec.ts

import HttpClient from "../infra/httpClient";
import { Task, TasksService } from "./tasks-service";

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Task 1",
    description: "Task 1 description",
    dueDate: new Date().toISOString(),
    priority: "LOW",
    isDone: false,
  },
  {
    id: "2",
    title: "Task 2",
    description: "Task 2 description",
    dueDate: new Date().toISOString(),
    priority: "HIGH",
    isDone: false,
  },
];

const newTask: Task = {
  title: "New Task",
  description: "New Task description",
  dueDate: new Date("2023-05-05T09:15:00.584Z").toISOString(),
  priority: "LOW",
  isDone: false,
};

const createdTask = {
  id: "3",
  ...newTask,
};

describe("TasksService", () => {
  let tasksService: TasksService;
  let httpClientMock: HttpClient;
  beforeEach(() => {
    httpClientMock = {
      get: jest.fn().mockResolvedValue(mockTasks),
      post: jest.fn().mockResolvedValue(createdTask),
      put: jest.fn(),
      delete: jest.fn(),
    };
    tasksService = new TasksService(httpClientMock);
  });

  test("getTasks should call httpClient.get with the correct URL", async () => {
    const tasks = await tasksService.getTasks();
    expect(tasks).toEqual(mockTasks);
    expect(httpClientMock.get).toHaveBeenCalledTimes(1);
    expect(httpClientMock.get).toHaveBeenCalledWith("/tasks");
  });

  test("toggleTaskDone should call httpClient.put with the correct URL and task object", async () => {
    jest.spyOn(httpClientMock, "put").mockResolvedValue({
      ...mockTasks[0],
      isDone: !mockTasks[0].isDone,
    });
    const task = await tasksService.toggleTaskDone(mockTasks[0]);
    expect(httpClientMock.put).toHaveBeenCalledTimes(1);
    expect(httpClientMock.put).toHaveBeenCalledWith(
      `/tasks/${mockTasks[0].id}`,
      {
        isDone: !mockTasks[0].isDone,
      }
    );
    expect(task).toEqual({
      ...mockTasks[0],
      isDone: !mockTasks[0].isDone,
    });
  });

  test("addTask should call httpClient.post with the correct URL and task object", async () => {
    const task = await tasksService.addTask(newTask);
    expect(httpClientMock.post).toHaveBeenCalledTimes(1);
    expect(httpClientMock.post).toHaveBeenCalledWith("/tasks", newTask);
    expect(task).toEqual(createdTask);
  });

  test("editTask should call httpClient.put with the correct URL and task object", async () => {
    jest.spyOn(httpClientMock, "put").mockResolvedValue({
      ...mockTasks[1],
      priority: "LOW",
    });
    const task = await tasksService.editTask({ ...mockTasks[1] });
    expect(httpClientMock.put).toHaveBeenCalledTimes(1);
    expect(httpClientMock.put).toHaveBeenCalledWith(
      `/tasks/${mockTasks[1].id}`,
      {
        title: "Task 2",
        description: "Task 2 description",
        dueDate: mockTasks[1].dueDate,
        priority: "HIGH",
        isDone: false,
      }
    );
    expect(task).toEqual({
      ...mockTasks[1],
      priority: "LOW",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("deleteTask should call httpClient.delete with the correct URL", async () => {
    await tasksService.deleteTask("1");
    expect(httpClientMock.delete).toHaveBeenCalledTimes(1);
    expect(httpClientMock.delete).toHaveBeenCalledWith(`/tasks/1`);
  });
});
