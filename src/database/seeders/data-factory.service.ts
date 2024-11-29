import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UserRole } from '../../users/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataFactoryService {
  async generateUsers(count: number, startIndex = 0) {
    const users = [];
    const roles = Object.values(UserRole);

    for (let i = 0; i < count; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const uniqueIndex = startIndex + i;

      users.push({
        email: `user${uniqueIndex}@example.com`,
        password: await bcrypt.hash('password123', 10),
        firstName,
        lastName,
        role: roles[Math.floor(Math.random() * roles.length)],
        createdAt: faker.date.past(),
        lastLoginAt: faker.date.recent(),
      });
    }

    return users;
  }
}
