import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [ConfigModule, UsersModule],
})
export class FilesModule {}
