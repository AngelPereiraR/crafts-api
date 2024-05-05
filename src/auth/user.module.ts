import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SEED,
          signOptions: { expiresIn: '6h' },
        }),
    ],
    providers: [UserService, AuthGuard],
    controllers: [UserController]})
export class UserModule {}
