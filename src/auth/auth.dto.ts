import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'User email', example: 'recruiter@pulsifi.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User password', example: 'password' })
  password: string;
}

export class LoginResponse {
  @ApiProperty({ description: 'Returns a JWT as the session token.' })
  access_token: string;
}

export class RequestUserEntity {
  id: number;
  username: string;
}
