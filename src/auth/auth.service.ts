import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createToken(userId: number): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload);
  }

  async validateUser(jwtPayload: any): Promise<any> {
    // Logic to validate user from database or any other source
    return { userId: jwtPayload.userId, username: 'example' };
  }
}
