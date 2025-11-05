import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BuildsModule } from './builds/builds.module';
import { VersionsModule } from './versions/versions.module';

@Module({
  imports: [UsersModule, BuildsModule, VersionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
