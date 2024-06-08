import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: any): Promise<any> {
    const user = await this.authService.validateUser(credentials);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    const token = await this.authService.createToken(user.userId);
    return { token };
  }
}
