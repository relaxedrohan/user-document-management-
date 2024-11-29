import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataFactoryService } from './seeders/data-factory.service';
import { SeederService } from './seeders/seeder.service';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DataFactoryService, SeederService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
