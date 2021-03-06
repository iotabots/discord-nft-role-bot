import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Client, Intents, Guild } from 'discord.js';
import { BOT_TOKEN, DISCORD_SERVER, IOTABOTS_ROLE } from '../secrets';
import { ethers } from 'ethers';
import { ConnectDiscordDto } from './dtos/connect-discord.dto';
import { getDiscordUserInfo } from './discord.utils';
import axios from 'axios';

@Injectable()
export class DiscordBotService {
  private bot: Client;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    // connection URL
    // https://discord.com/api/oauth2/authorize?client_id=949687840504160267&permissions=268435488&scope=bot
    const bot = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
      partials: ['CHANNEL', 'MESSAGE'],
    });
    bot.login(BOT_TOKEN);
    this.bot = bot;
  }

  /**
   * Map an eth address to a discord id and then subsequently issue the role
   * to the user
   *
   * @param {ConenctDiscordDto}
   * @returns {bool}
   */

  async connectDiscord(body: ConnectDiscordDto) {
    const { nonce, signature, discordCode } = body;
    const ethAddr = ethers.utils.verifyMessage(nonce, signature);
    const { id } = await getDiscordUserInfo(discordCode);
    const user_exists = await this.userModel.findOne({ ethAddr });
    console.log(user_exists);
    if (!user_exists) {
      await this.userModel.create({ discordUser: id, ethAddr });
    }

    const URL =
      'https://raw.githubusercontent.com/iotabots/save-the-bots/main/all.txt';

    const { data } = await axios.get(URL);
    console.log('data', data);

    const airdropAddresses: Array<any> = [];

    if (!data) {
      return;
    }

    const array = data.split('\n');
    // for (var i = 0; i < array.length; i++) {
    for (let index = 0; index < array.length - 1; index += 1) {
      const botData = array[index].split(':');
      const obj = {
        id: botData[0],
        address: botData[1],
      };
      airdropAddresses.push(obj);
    }

    const iotabots = (airdropAddresses || [])
      .filter((obj) => obj?.address === ethAddr)
      .map((obj) => obj.id);

    if (iotabots.length > 0) {
      // do this if user has nft
      const guild = this.bot.guilds.cache.find(
        (g: Guild) => g.id === DISCORD_SERVER,
      );
      const member = await guild?.members.fetch(id);
      await member?.roles.add(IOTABOTS_ROLE);
    }
  }
}
