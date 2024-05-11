import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequest, LoginResponse } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth | Authentication related APIS')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Logs user in.' })
  @ApiOkResponse({
    description: 'Successful login',
    type: LoginResponse,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(request);
  }
}
