import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IndexTaskSwagger } from './swagger/index-task.swagger';
import { TaskService } from './task.service';

@Controller('api/v1/tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de Tarefas retornada com sucesso',
    type: IndexTaskSwagger,
    isArray: true,
  })
  async index() {
    return await this.taskService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar uma nova tarefa' })
  @ApiResponse({ status: 201, description: 'Nova tarefa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos' })
  async create(@Body() body: CreateTaskDto) {
    return await this.taskService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibir uma tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uma tarefa retornados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.taskService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return await this.taskService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: 204, description: 'Tarefa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.taskService.deleteById(id);
  }
}
