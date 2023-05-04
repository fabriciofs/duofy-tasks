import HttpClient from "../infra/httpClient";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "HIGH";
  isDone: boolean;
};

export class TasksService {
  private tasks: Task[];
  private endPoint = "/tasks";
  constructor(private readonly httpCliente: HttpClient) {
    this.tasks = [];
  }

  async getTasks(): Promise<Task[]> {
    this.tasks = await this.httpCliente.get<Task[]>(this.endPoint);
    return this.tasks;
  }
  async toggleTaskCompletion(id: string) {
    console.log({ id });
  }
  async editTask(id: string, data: Task) {
    console.log({ id, data });
  }
  async deleteTask(id: string) {
    console.log({ id });
  }
}
