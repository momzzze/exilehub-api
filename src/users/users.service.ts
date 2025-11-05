import { Injectable } from '@nestjs/common';
import { User } from './users.types';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  create(dto: CreateUserDto): User {
    try {
      const newUser: User = {
        id: this.idCounter++,
        username: dto.username,
        email: dto.email,
        password: dto.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  findAll(): User[] {
    try {
      return this.users;
    } catch (error) {
      console.error('Error finding users:', error);
      return [];
    }
  }

  findOne(id: number): User | undefined {
    try {
      return this.users.find((user) => user.id === id);
    } catch (error) {
      console.error('Error finding user:', error);
      return undefined;
    }
  }

  remove(id: number): boolean {
    try {
      const userIndex = this.users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        this.users.splice(userIndex, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing user:', error);
      return false;
    }
  }

  update(id: number, dto: Partial<CreateUserDto>): User | undefined {
    try {
      const user = this.findOne(id);
      if (user) {
        Object.assign(user, dto, { updatedAt: new Date() });
        return user;
      }
      return undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }
}
