import { format, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

import logo from '../../assets/logo.png';
import { useHttpClient } from '../../infra/useHttpClient';
import { Task, TasksService } from '../../services/tasks-service';
import Alert, { AlertProps } from '../shared/Alert';
import ConfirmationDialog, { ConfirmationDialogProps } from '../shared/ConfirmationDialog';


export const TasksComponent = () => {
  const httpCliente = useHttpClient()
  const tasksService = new TasksService(httpCliente);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString());
  const [priority, setPriority] = useState<'LOW' | 'HIGH'>('LOW');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [confirmationDialog, setConfirmationDialog] = useState<ConfirmationDialogProps | null>(null);


  useEffect(() => {
    loadTasks();
  }, []);


  useEffect(() => {
    if (alert && alert.timeOut) {
      setTimeout(() => {
        setAlert(null)
      }, alert.timeOut)
    }
  }, [alert]);

  const loadTasks = async () => {
    const tasks = await tasksService.getTasks();
    setTasks(tasks);
  };

  const formFieldsOk = () => title && description

  const onAddTask = async () => {
    if (!formFieldsOk()) {
      setAlert({ message: 'Preencha todos os campos', type: 'warning', timeOut: 4000, onClose: () => setAlert(null) })
      return
    }
    const newTask: Task = {
      title,
      description,
      dueDate,
      priority,
      isDone: false,
    };
    try {
      setLoadingMessage('Apagando Tarefa...');
      await tasksService.addTask(newTask);
      setTitle('');
      setDescription('');
      setDueDate(new Date().toISOString());
      setPriority('LOW');
      loadTasks();
      setLoadingMessage(null);
    } catch (error) {
      setLoadingMessage(null);
      setAlert({ message: 'Falha ao comunicar com o servidor', type: 'error', timeOut: 4000, onClose: () => setAlert(null) })
    }

  };

  const onDeleteTask = async (task: Task) => {
    setConfirmationDialog({
      title: 'Exclusão de tarefa',
      message: `Deseja realmente excluir a tarefa ${task.title}?`,
      onConfirm: async () => deleteTask(task),
      onCancel: () => setConfirmationDialog(null)
    })
  }
  const deleteTask = async (task: Task) => {
    try {
      setConfirmationDialog(null)
      setLoadingMessage('Apagando Tarefa...');
      await tasksService.deleteTask(task.id!);
      loadTasks();
      setLoadingMessage(null);
    } catch (error) {
      setLoadingMessage(null);
      setAlert({ message: 'Falha ao comunicar com o servidor', type: 'error', timeOut: 4000, onClose: () => setAlert(null) })
    }
  };

  const onToggleTaskDone = async (task: Task) => {
    try {
      setLoadingMessage('Salvando...');
      await tasksService.toggleTaskDone(task);
      loadTasks();
      setLoadingMessage(null);
    } catch (error) {
      setLoadingMessage(null);
      setAlert({ message: 'Falha ao comunicar com o servidor', type: 'error', timeOut: 4000, onClose: () => setAlert(null) })
    }
  };

  const onEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
  };

  const onSaveTask = async () => {
    try {
      if (editingTask && formFieldsOk()) {
        const updatedTask: Task = {
          ...editingTask,
          title,
          description,
          dueDate,
          priority,
        };
        await tasksService.editTask(updatedTask);
        setEditingTask(null);
        setTitle('');
        setDescription('');
        setDueDate(new Date().toISOString());
        setPriority('LOW');
        loadTasks();
      }
    } catch (error) {
      setLoadingMessage(null);
      setAlert({ message: 'Falha ao comunicar com o servidor', type: 'error', timeOut: 4000, onClose: () => setAlert(null) })
    }
  };

  const clearForm = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate(new Date().toISOString());
    setPriority('LOW');
  };

  return (
    <>
      {!!alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={alert.onClose}
        />
      )}
      {!!confirmationDialog && (
        < ConfirmationDialog {...confirmationDialog} />
      )}
      {!!loadingMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <div>{loadingMessage}</div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <img src={logo} alt="Logo Duofy" className="w-12 h-12" />
          <h1 className="text-2xl font-bold">Tarefas Duofy</h1>
        </div>
        <div className='grid grid-flow-row-dense grid-cols-2 grid-rows-3 gap-2'>
          <div className="col-span-2">
            <span className='font-bold'>Título:</span>
            <input
              type="text"
              className="border px-2 py-1 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <span className='font-bold'>Descrição:</span>
            <textarea
              className="border px-2 py-1 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <span className='font-bold'>Vencimento:</span>
            <div >
              <input
                type="date"
                className="border h-9 px-2 py-1 w-full"
                value={format(parseISO(String(dueDate)), 'yyyy-MM-dd')}
                onChange={(e) => setDueDate(new Date(parseISO(e.target.value)).toISOString())}
              />
            </div>
          </div>
          <div>
            <span className='font-bold'>Prioridade:</span>
            <div >
              <select
                className="border h-9 px-2 py-1 w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'HIGH')}
              >
                <option value="LOW">Baixa</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>
        </div>
        {editingTask ? (
          <div className="flex space-x-2">
            {formFieldsOk() && (<button
              className="bg-blue-600 text-white px-4 py-1"
              onClick={onSaveTask}
            >
              Salvar
            </button>)}
            <button
              className="bg-red-600 text-white px-4 py-1"
              onClick={clearForm}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            {formFieldsOk() && (<button
              className="bg-green-600 text-white px-4 py-1"
              onClick={onAddTask}
            >
              Salvar Nova Tarefa
            </button>)}
            <button
              className="bg-red-600 text-white px-4 py-1"
              onClick={clearForm}
            >
              Limpar
            </button>
          </div>

        )}

        <div className="h-96 overflow-y-auto mt-8">
          {tasks.length === 0 && (
            <span className='font-bold'>Não ha tarefas definidas</span>
          )}
          <ul className="mt-8 mr-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`mt-2 p-4  rounded shadow-md ${task.isDone ? 'bg-green-100' : 'bg-gray-100'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold uppercase ">{task.title}</h2>
                    <p>{task.description}</p>
                    <p><span className='font-bold'>Vencimento</span>: {new Date(task.dueDate).toLocaleDateString()}</p>
                    <p>
                      <span className='font-bold'>Prioridade: </span>
                      <span className={`text-white px-2 py-0.5 rounded ${task.priority === 'HIGH' ? 'bg-red-600' : 'bg-green-600'}`}>
                        {task.priority === 'HIGH' ? 'Alta' : 'Baixa'}
                      </span>
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => onToggleTaskDone(task)}
                      className="bg-blue-500 text-white rounded px-4 py-1"
                    >
                      {task.isDone ? 'Concluido' : 'Concluir'}
                    </button>
                    <button
                      onClick={() => onEditTask(task)}
                      className="bg-yellow-500 text-white rounded px-4 py-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDeleteTask(task)}
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
      </div >
    </>
  )
};
