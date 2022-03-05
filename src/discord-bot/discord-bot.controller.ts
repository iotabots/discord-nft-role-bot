import { Controller, Post, Body } from '@nestjs/common';
import { ConnectDiscordDto } from './dtos/connect-discord.dto';
import { DiscordBotService } from './discord-bot.service';

@Controller('connect-discord')
export class DiscordBotController {
  constructor(private discordBotService: DiscordBotService) {}

  @Post()
  async connectDiscord(@Body() body: ConnectDiscordDto): Promise<void> {
    return this.discordBotService.connectDiscord(body);
  }
}
