import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataFactoryService } from './data-factory.service';
import { UserRole } from '../../users/enums/role.enum';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataFactory: DataFactoryService,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.userRepository.count();
      if (count > 100) {
        console.log('Database already has sufficient data. Skipping seed.');
        return;
      }

      await this.clearAndSeedDatabase();
    } catch (error) {
      console.error('Error during data seeding:', error);
    }
  }

  private async clearAndSeedDatabase() {
    // Clear existing data
    await this.userRepository.clear();
    console.log('Cleared existing data');

    // Create default admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = this.userRepository.create({
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(admin);
    console.log('Created admin user');

    // Generate bulk users in batches
    const BATCH_SIZE = 100;
    const TOTAL_USERS = 1000;

    for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
      const users = await this.dataFactory.generateUsers(BATCH_SIZE, i);
      await this.userRepository.save(users);
      console.log(`Seeded users ${i + 1} to ${i + BATCH_SIZE}`);
    }

    console.log('Data seeding completed successfully');
  }
}
