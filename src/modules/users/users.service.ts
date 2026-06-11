import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { CreateUserDto } from './dto/create-user-dto';

const DEFAULT_CATEGORIES = [
  { name: 'Salary', icon: 'salary', type: 'INCOME' },
  { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
  { name: 'Investments', icon: 'investments', type: 'INCOME' },
  { name: 'Other', icon: 'other', type: 'INCOME' },
  { name: 'Home', icon: 'home', type: 'EXPENSE' },
  { name: 'Food', icon: 'food', type: 'EXPENSE' },
  { name: 'Transport', icon: 'transport', type: 'EXPENSE' },
  { name: 'Education', icon: 'education', type: 'EXPENSE' },
  { name: 'Health', icon: 'health', type: 'EXPENSE' },
  { name: 'Leisure', icon: 'leisure', type: 'EXPENSE' },
  { name: 'Clothing', icon: 'clothing', type: 'EXPENSE' },
  { name: 'Subscriptions', icon: 'subscriptions', type: 'EXPENSE' },
] as const;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  getUserById(userId: string) {
    return this.usersRepo.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const emailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('Email already taken');
    }

    const hashedPassword = await hash(password, 12);

    return this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [...DEFAULT_CATEGORIES],
          },
        },
      },
    });
  }
}
