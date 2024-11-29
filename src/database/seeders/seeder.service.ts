// src/database/seeders/seeder.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InitialUsersSeed } from '../seeds/initial-users.seed';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      await this.dataSource.getRepository('users').clear();

      console.log('Starting database seeding...');
      const usersSeeder = new InitialUsersSeed(this.dataSource);
      await usersSeeder.run();
      console.log('Database seeding completed');
    } catch (error) {
      console.error('Error during database seeding:', error);
    }
  }
}
