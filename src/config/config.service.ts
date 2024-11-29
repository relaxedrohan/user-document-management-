// src/config/config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, JwtConfig, Environment } from './env.config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): Environment {
    return this.configService.get<Environment>(
      'NODE_ENV',
      Environment.Development,
    );
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get database(): DatabaseConfig {
    return {
      host: this.configService.get<string>('POSTGRES_HOST'),
      port: this.configService.get<number>('POSTGRES_PORT'),
      username: this.configService.get<string>('POSTGRES_USER'),
      password: this.configService.get<string>('POSTGRES_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_NAME'),
    };
  }

  get jwt(): JwtConfig {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expirationTime: this.configService.get<string>('JWT_EXPIRATION', '1h'),
    };
  }
}
