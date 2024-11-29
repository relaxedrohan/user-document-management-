// test/setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { User } from '../src/users/user.entity';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

export class TestSetup {
  private static app: INestApplication;

  static async createTestingApp(): Promise<INestApplication> {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'testuser',
          password: 'testpass',
          database: 'test-db',
          entities: [User],
          synchronize: true, // Safe for testing
        }),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();
    this.app = app;
    return app;
  }

  static async getAuthToken(): Promise<string> {
    const app = this.app;
    // Create test user
    await app.get('UsersService').create({
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
    });

    // Login and get token
    const response = await app.get('AuthService').login({
      email: 'test@example.com',
      password: 'test123',
    });

    return response.access_token;
  }

  static async cleanup() {
    const dataSource = this.app.get(DataSource); // Correct way to get connection
    await dataSource.dropDatabase(); // Drop instead of sync
    await this.app.close();
  }
}
