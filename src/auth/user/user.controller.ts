// user.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(parseInt(id, 10));
  }

  @Post('register')
  register(@Body() user: User): Promise<User> {
    return this.userService.register(user);
  }

  @UseGuards(AuthGuard)
  @Get('/check-token')
  checkToken(@Request() req: Request) {
    const user = req['user'] as User;

    return {
      user,
      token: this.userService.getJwtToken({ id: user.id.toString() })
    }

  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string): Promise<Object> {
    return this.userService.login(email, password);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.updateUser(parseInt(id, 10), user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(parseInt(id, 10));
  }
}
