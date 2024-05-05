// user.service.ts
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        id: 'ASC'
      }
    });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  async register(user: User): Promise<User> {
    try {
       // Verificar si faltan datos por añadir
       if (!user.email || !user.password) {
        throw new HttpException('Verifica los datos introducidos, faltan datos por añadir', HttpStatus.BAD_REQUEST);
      }

      // Verificar si el email ya existe en la base de datos
      const existingUser = await this.userRepository.findOneBy({ email: user.email });
      if (existingUser) {
        throw new HttpException('El email ya está registrado', HttpStatus.BAD_REQUEST);
      }
      
      const hashedPassword = await bcryptjs.hash(user.password, 10);
      const newUser = this.userRepository.create({ ...user, password: hashedPassword });
      return this.userRepository.save(newUser);
    } catch(error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<Object> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = await this.jwtService.signAsync({id: user.id}, {secret: process.env.JWT_SEED});
    const newUser = {...user, token}
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      // Verificar si el email ya existe en la base de datos
      const existingUser = await this.userRepository.findOneBy({ email: userData.email });
      if (existingUser && existingUser.id == id) {
        throw new HttpException('El email ya está registrado', HttpStatus.BAD_REQUEST);
      }

      await this.userRepository.update(id, userData);
      return this.userRepository.findOneBy({id});
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.userRepository.remove(user);
  }
}
