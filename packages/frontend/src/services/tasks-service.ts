import HttpClient from "../infra/httpClient";

export type Task = {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "HIGH";
  isDone: boolean;
};

export class TasksService {
  private tasks: Task[];
  private endPoint = "/tasks";
  constructor(private readonly httpClient: HttpClient) {
    this.tasks = [];
  }

  async getTasks(): Promise<Task[]> {
    this.tasks = await this.httpClient.get<Task[]>(this.endPoint);
    return this.tasks;
  }

  async toggleTaskDone(data: Task): Promise<Task> {
    return await this.httpClient.put(`${this.endPoint}/${data.id}`, {
      isDone: !data.isDone,
    });
  }

  async addTask(data: Task): Promise<Task> {
    return await this.httpClient.post(this.endPoint, data);
  }

  async editTask(data: Task): Promise<Task> {
    const { id } = data;
    delete data.id;
    return await this.httpClient.put(`${this.endPoint}/${id}`, data);
  }

  async deleteTask(id: string): Promise<void> {
    await this.httpClient.delete(`${this.endPoint}/${id}`);
  }
}
