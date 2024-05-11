import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
// TODO: Uncomment this line
// import { expect, jest, it } from '@jest/globals';

jest.mock('bcrypt');

describe('auth service - unit tests', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('service - should be defined', () => {
    expect(service).toBeDefined();
  });

  it('login() - should throw bad request if user does not exist', () => {
    const findFirstMock = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(undefined);

    expect(service.login({ email: '', password: '' })).rejects.toThrow(
      new UnauthorizedException(),
    );
    expect(findFirstMock).toHaveBeenCalledWith({
      where: { username: '', deleted_at: null },
    });
  });

  it('login() - should throw bad request if user is deleted', () => {
    const findFirstMock = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(undefined);

    expect(service.login({ email: '', password: '' })).rejects.toThrow(
      new UnauthorizedException(),
    );
    expect(findFirstMock).toHaveBeenCalledWith({
      where: { username: '', deleted_at: null },
    });
  });

  it('login() - should throw UnauthorizedException if password does not match', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce({
      username: 'test@example.com',
      password: 'hashedPassword',
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      service.login({ email: 'test@example.com', password: 'wrongpassword' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login() - should return token if user and password match', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce({
      username: 'test@example.com',
      password: 'hashedPassword',
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    });

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('1234567');

    const result = await service.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result.access_token).toBe('1234567');
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
  });

  it('login() - should return LoginResponse on success', async () => {
    const user = {
      id: 1,
      username: 'test@email.com',
      password: '<encrypted>',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    const prisma_mock = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const jwtMock = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('1234567');

    const result = await service.login({
      email: 'test@email.com',
      password: 'password',
    });

    expect(result.access_token).toBe('1234567');
    expect(prisma_mock).toHaveBeenCalledWith({
      where: { username: 'test@email.com', deleted_at: null },
    });
    expect(jwtMock).toHaveBeenCalledWith({ id: 1, username: 'test@email.com' });
  });

  it('login() - should throw unauthorised and log user not found if user does not exist', () => {
    // TODO: Add check that Logger.log was called with the right argument
    const prisma_mock = jest
      .spyOn(prismaService.user, 'findFirst')
      .mockResolvedValue(undefined);

    expect(service.login({ email: '', password: '' })).rejects.toThrow(
      new UnauthorizedException(),
    );
    expect(prisma_mock).toHaveBeenCalled();
  });
});
