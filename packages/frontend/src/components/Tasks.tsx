// src/components/ExampleComponent.tsx
import React, { useEffect, useState } from 'react';
import { useHttpClient } from '../infra/HttpClientContext';
import { Task, TasksService } from '../services/tasks-service';

export const TasksComponent: React.FC = () => {
  const httpClient = useHttpClient();
  const tasksService = new TasksService(httpClient)
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await tasksService.getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl my-4">Tarefas</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 rounded-lg shadow ${task.isDone ? 'bg-green-100' : 'bg-white'
              }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{task.title}</h2>
                <p>{task.description}</p>
                <p>Vencimento: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p>Prioridade: <span className={`text-white px-2 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-600' : 'bg-green-600'}`}>{task.priority}</span></p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => tasksService.toggleTaskCompletion(task.id)}
                  className="bg-blue-500 text-white rounded px-4 py-1"
                >
                  {task.isDone ? 'Não concluido' : 'Concluir'}
                </button>
                <button
                  onClick={() => tasksService.editTask(task.id, task)}
                  className="bg-yellow-500 text-white rounded px-4 py-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => tasksService.deleteTask(task.id)}
                  className="bg-red-500 text-white rounded px-4 py-1"
                >
                  Apagar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

