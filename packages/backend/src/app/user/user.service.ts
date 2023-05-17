import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneOrFail(id: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
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

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return await this.userRepository.save(this.userRepository.create(createUserDto));
  }


  async update(id: string, data: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.findOneOrFail(id);
      this.userRepository.merge(user, data);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.findOneOrFail(id);
      await this.userRepository.softDelete(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}
