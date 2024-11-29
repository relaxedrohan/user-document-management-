// src/database/seeds/initial-users.seed.ts
import { DataSource } from 'typeorm';
import { UserRole } from '../../users/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

export class InitialUsersSeed {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);

    // Create initial users with different roles
    const users = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      },
      {
        email: 'editor@example.com',
        password: 'editor123',
        firstName: 'Editor',
        lastName: 'User',
        role: UserRole.EDITOR,
      },
      {
        email: 'viewer@example.com',
        password: 'viewer123',
        firstName: 'Viewer',
        lastName: 'User',
        role: UserRole.VIEWER,
      },
    ];

    // Hash passwords and create users
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await userRepository.save(user);
      console.log(`Created ${userData.role} user: ${userData.email}`);
    }
  }
}
