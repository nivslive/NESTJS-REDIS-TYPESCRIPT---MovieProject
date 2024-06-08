import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
    JwtModule.register({
        secret: '#', // Mude o Secret para o JWT criado
        signOptions: { expiresIn: '1h' }, // Quanto tempo irá expirar a sessão?
    }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
