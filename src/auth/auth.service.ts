import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginRequest, LoginResponse } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: request.email,
        deleted_at: null,
      },
    });

    if (!user) {
      this.logger.log(`User ${request.email} not found`);
      throw new UnauthorizedException();
    }

    if (!(await bcrypt.compare(request.password, user.password))) {
      throw new UnauthorizedException();
    }

    return {
      access_token: await this.jwtService.signAsync({
        id: user.id,
        username: user.username,
      }),
    };
  }
}
