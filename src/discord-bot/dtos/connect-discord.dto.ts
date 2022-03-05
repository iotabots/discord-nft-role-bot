import { IsString } from 'class-validator';

export class ConnectDiscordDto {
  @IsString()
  signature: string;

  @IsString()
  nonce: string;

  @IsString()
  discordCode: string;
}
