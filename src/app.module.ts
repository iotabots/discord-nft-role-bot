import { Module } from '@nestjs/common';
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URI } from './secrets';

@Module({
  imports: [DiscordBotModule, MongooseModule.forRoot(MONGO_URI)],
  controllers: [],
  providers: [],
})
export class AppModule {}
