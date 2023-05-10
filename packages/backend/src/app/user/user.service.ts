import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<GetUserDto[]> {
    return await this.userRepository.find({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async create(data: CreateUserDto): Promise<GetUserDto> {
    const user = await this.userRepository.save(
      this.userRepository.create(data),
    );
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    } as GetUserDto;
  }

  async findOneOrFail(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        select: {
          id: true,
          email: true,
          name: true,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<GetUserDto> {
    try {
      const task = await this.findOneOrFail(id);
      this.userRepository.merge(task, data);
      const user = await this.userRepository.save(task);
      return {
        id: user.id,
        email: user.email,
        name: user.name,
      } as GetUserDto;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteById(id: string) {
    try {
      await this.findOneOrFail(id);
      await this.userRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
