import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('12322222');
    return 'Hello World!';
  }
}
