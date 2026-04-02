import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { CreateUserDto } from './dto/create-user-dto';
import { PrismaService } from 'src/shared/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository, private readonly prismaService: PrismaService) { }

  getUserById(userId: string) {
    return this.usersRepo.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
  }

  createUser(createUserDto: CreateUserDto) {
    const user = this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      }
    })

    return user;
  }
}
