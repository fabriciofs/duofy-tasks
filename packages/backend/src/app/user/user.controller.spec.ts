import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userEntityList: UserEntity[] = [
  new UserEntity({
    name: 'user-1',
    email: 'user-1@email.com',
    password: 'password',
  }),
  new UserEntity({
    name: 'user-2',
    email: 'user-2@email.com',
    password: 'password',
  }),
  new UserEntity({
    name: 'user-3',
    email: 'user-3@email.com',
    password: 'password',
  }),
  new UserEntity({
    name: 'user-4',
    email: 'user-4@email.com',
    password: 'password',
  }),
]

const newUserEntity = new UserEntity({
  name: 'user-new',
  email: 'user-new@email.com',
  password: 'password',
});

const updatedUserEntity = new UserEntity({
  name: 'user-1 updated',
  email: 'user-1@email.com',
  password: 'password',
});

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          findAll: jest.fn().mockResolvedValue(userEntityList),
          findOneOrFail: jest.fn().mockResolvedValue(userEntityList[0]),
          create: jest.fn().mockResolvedValue(newUserEntity),
          update: jest.fn().mockResolvedValue(updatedUserEntity),
          deleteById: jest.fn().mockResolvedValue(undefined),
        },
      },],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('findAll', () => {
    it('shoud return an user list entity successfully', async () => {
      const result = await userController.findAll();
      expect(result).toEqual(userEntityList);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('shoud create a new user item successfully', async () => {
      const body: CreateUserDto = {
        name: 'user-new',
        email: 'user-new@email.com',
        password: 'password',
      };
      const result = await userController.create(body);
      expect(result).toEqual({
        ...body,
      });
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('findOneOrFail', () => {
    it('shoud show a task user successfully', async () => {
      const result = await userController.findOneOrFail('1');
      expect(result).toEqual(userEntityList[0]);
      expect(userService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(userService.findOneOrFail).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('shoud update an user item successfully', async () => {
      const body: UpdateUserDto = { name: 'user-1 updated' };
      const result = await userController.update('1', body);
      expect(result).toEqual(updatedUserEntity);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith('1', body);
    });
  });

  describe('destroy', () => {
    it('shoud delete an user item successfully', async () => {
      const result = await userController.remove('1');
      expect(result).toBeUndefined();
      expect(userService.deleteById).toHaveBeenCalledTimes(1);
      expect(userService.deleteById).toHaveBeenCalledWith('1');
    });
  });

});
