import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { MatchesModule } from './matches/matches.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ global: true, wildcard: true }),
    AuthModule,
    UsersModule,
    ItemsModule,
    MatchesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
