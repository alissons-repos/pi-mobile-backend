import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './objects/items.module';
import { MatchesModule } from './notifications/matches.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true }),
    AuthModule,
    UsersModule,
    ItemsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
