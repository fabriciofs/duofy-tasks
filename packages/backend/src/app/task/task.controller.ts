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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { IndexTaskSwagger } from './swagger/index-task.swagger';
import { TaskService } from './task.service';

@Controller('api/tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @ApiResponse({
    status: 200,
    description: 'All tasks returned successfully',
    type: IndexTaskSwagger,
    isArray: true,
  })
  async findAll(): Promise<TaskEntity[]> {
    return await this.taskService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add new task' })
  @ApiResponse({ status: 201, description: 'New task created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  async create(@Body() body: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one task' })
  @ApiResponse({
    status: 200,
    description: 'Task returned successfully',
    type: IndexTaskSwagger,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOneOrFail(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TaskEntity> {
    return await this.taskService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 201, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return await this.taskService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.taskService.deleteById(id);
  }
}
