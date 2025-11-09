import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto.js';
import { User } from './user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ username: dto.username }, { email: dto.email }],
      });

      if (existingUser) {
        throw new ConflictException('Username or email already exists.');
      }

      const user = this.userRepository.create({
        ...dto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      return users.map(({ password, ...safeUser }) => safeUser);
    } catch (error) {
      console.error('Error finding users:', error);
      return [];
    }
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) return null;

      const { password, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<{ success: boolean }> {
    try {
      await this.userRepository.delete(id);
      return { success: true };
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      await this.userRepository.update(id, {
        ...dto,
        updatedAt: new Date(),
      });

      const updated = await this.userRepository.findOne({ where: { id } });
      if (!updated) {
        throw new Error(`User with ID ${id} not found`);
      }

      const { password, ...safeUser } = updated;
      return safeUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
