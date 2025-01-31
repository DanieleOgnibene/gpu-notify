# Discord Configuration Guide

This guide explains how to set up the required Discord environment variables.

## Environment Variables

The application requires the following environment variables:

- `DISCORD_BOT_TOKEN`: The token for the Discord bot.
- `DISCORD_USER_IDS`: The IDs of the Discord users to notify.
- `NVIDIA_LOCALE`: The locale for the Nvidia shop (e.g., "es-es" for Spanish store).
- `INTERVAL`: Time in milliseconds between stock checks (default: 10000).

## GPU Configuration

The application monitors GPU stock based on the configuration in `src/data/gpus.json`. You can add or modify GPUs to monitor by editing this file:

```json
[
  {
    "name": "GPU_NAME",
    "api_url": "https://api.store.nvidia.com/partner/v1/feinventory?skus=SKU_CODE"
  }
]
```

Each GPU entry requires:

- `name`: A descriptive name for the GPU (used in notifications)
- `api_url`: The Nvidia API URL with the specific SKU code for the GPU

Example:

```json
{
  "name": "5090",
  "api_url": "https://api.store.nvidia.com/partner/v1/feinventory?skus=NVGFT590"
}
```

You can add multiple GPUs to monitor by adding more objects to the array.

## Discord Configuration

### Getting Your Discord Bot Token

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Under the bot's username, click "Reset Token" and then "Copy"
6. Add this token to your `.env` file as `DISCORD_BOT_TOKEN`

### Getting Your Discord User ID

1. Enable Developer Mode in Discord:

   - Open Discord
   - Go to Settings (gear icon)
   - Under "App Settings", click on "Advanced"
   - Enable "Developer Mode"

2. Get your User ID:
   - Right-click on your username anywhere in Discord
   - Click "Copy User ID"
   - Add this ID to your `.env` file as `DISCORD_USER_IDS`
   - If you want to add more users, you can add them as a comma-separated list.

### Bot Setup for Direct Messages

To allow the bot to send you direct messages:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "OAuth2" → "URL Generator"
4. Under "Scopes", check:
   - `bot`
5. Under "Bot Permissions", check:
   - `Send Messages`
6. Use the generated URL to invite the bot to any server you're in

### Discord Privacy Settings

Ensure your Discord privacy settings allow DMs:

1. Open Discord
2. Go to User Settings (gear icon)
3. Click "Privacy & Safety"
4. Enable "Allow direct messages from server members"

## Security Notes

- Never share your bot token with anyone
- Don't commit the `.env` file to version control
- If you accidentally expose your bot token, reset it immediately in the Discord Developer Portal
