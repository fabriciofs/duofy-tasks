import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { IndexUserSwagger } from './swagger/index-user.swagger';
import { UserService } from './user.service';

@Controller('api/user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'All users returned successfully',
    type: IndexUserSwagger,
    isArray: true,
  })
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add new user' })
  @ApiResponse({ status: 201, description: 'New task created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid parameters' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an user' })
  @ApiResponse({
    status: 200,
    description: 'User returned successfully',
    type: IndexUserSwagger,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOneOrFail(@Param('id', new ParseUUIDPipe()) id: string): Promise<UserEntity> {
    return this.userService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an user' })
  @ApiResponse({ status: 201, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
