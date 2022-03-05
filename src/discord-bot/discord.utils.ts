import axios from "axios";
import queryString from "querystring";
import { DISCORD_CLIENT, DISCORD_REDIRECT, DISCORD_SECRET } from "../secrets";

export const getUserTokens = async (code: string) => {
  const payload = {
    client_id: DISCORD_CLIENT,
    client_secret: DISCORD_SECRET,
    redirect_uri: DISCORD_REDIRECT,
    code,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const stringifiedPayload = new URLSearchParams(payload).toString();
  try {
    console.log(payload);
    const { data }: any = await axios
      .post(
        `https://discord.com/api/oauth2/token?grant_type=authorization_code`,
        stringifiedPayload,
        config,
      )
      .catch((error) => {
        console.error(error);
      });
    console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getDiscordUserInfo = async (code: string) => {
  const tokens = await getUserTokens(code);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access_token}`,
    },
  };

  const { data }: any = await axios.get(
    "http://discordapp.com/api/users/@me",
    config
  );

  return {
    ...tokens,
    ...data,
  };
};
