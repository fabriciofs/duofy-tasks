import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

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

const updatedUserEntityItem = new UserEntity({
  name: 'user-1 updated',
  email: 'user-1@email.com',
  password: 'password',
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(userEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(userEntityList[0]),
            create: jest.fn().mockReturnValue(userEntityList[0]),
            merge: jest.fn().mockReturnValue(updatedUserEntityItem),
            save: jest.fn().mockResolvedValue(userEntityList[0]),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an user entity list successfully', async () => {
      const result = await userService.findAll();
      expect(result).toEqual(userEntityList);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneOrFail', () => {
    it('should return an user entity item successfully', async () => {
      const result = await userService.findOneOrFail('1');
      expect(result).toEqual(userEntityList[0]);
      expect(userRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user item successfully', async () => {
      const data: CreateUserDto = {
        name: 'user-new',
        email: 'user-new@email.com',
        password: 'password',
      };
      const result = await userService.create(data);
      expect(result).toEqual(userEntityList[0]);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const userEmail = 'test@test.com';
      const userPassword = 'password';
      const user = new UserEntity();
      user.email = userEmail;
      user.name = 'Test User';
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(userPassword, salt);
      userRepository.findOneOrFail = jest.fn().mockResolvedValue(user);
      const validatedUser = await userService.validateUser(userEmail, userPassword);
      expect(validatedUser).toBeDefined();
      expect(validatedUser.email).toEqual(userEmail);
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
    });

    it('should not validate a user with incorrect password', async () => {
      const userEmail = 'test@test.com';
      const userPassword = 'password';
      const user = new UserEntity();
      user.email = userEmail;
      user.name = 'Test User';
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(userPassword, salt);
      userRepository.findOneOrFail = jest.fn().mockResolvedValue(user);
      const validatedUser = await userService.validateUser(userEmail, 'wrongPassword');
      expect(validatedUser).toBeNull();
      expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
    });
  });

});
