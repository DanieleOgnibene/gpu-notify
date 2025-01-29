import dotenv from "dotenv";

dotenv.config();

const {
  NVIDIA_LOCALE: _NVIDIA_LOCALE,
  DISCORD_BOT_TOKEN: _DISCORD_BOT_TOKEN,
  DISCORD_USER_ID: _DISCORD_USER_ID,
  INTERVAL: _INTERVAL,
} = process.env;

if (!_NVIDIA_LOCALE) {
  throw new Error("NVIDIA_LOCALE is not set");
}

if (!_DISCORD_BOT_TOKEN) {
  throw new Error("DISCORD_BOT_TOKEN is not set");
}

if (!_DISCORD_USER_ID) {
  throw new Error("DISCORD_USER_ID is not set");
}

export const DISCORD_BOT_TOKEN = _DISCORD_BOT_TOKEN as string;
export const DISCORD_USER_ID = _DISCORD_USER_ID as string;
export const INTERVAL = _INTERVAL ? parseInt(_INTERVAL) : 10000;
export const NVIDIA_LOCALE = _NVIDIA_LOCALE as string;
