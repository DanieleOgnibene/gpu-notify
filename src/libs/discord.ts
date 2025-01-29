import { Client, IntentsBitField } from "discord.js";

let client: Client | null = null;

const createClientInstance = () => {
  return new Promise<Client>((resolve) => {
    const discordClient = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
      ],
    });

    discordClient.once("ready", () => {
      console.log("Discord bot is ready!");
    });

    discordClient.login(process.env.DISCORD_BOT_TOKEN);
    resolve(discordClient);
  });
};

const getDiscordClient = async (): Promise<Client> => {
  if (!client) {
    client = await createClientInstance();
  }
  return client;
};

export const sendDirectMessage = async (
  userId: string,
  message: string
): Promise<void> => {
  try {
    const discordClient = await getDiscordClient();
    const user = await discordClient.users.fetch(userId);
    await user.send(message);
  } catch (error) {
    console.error("Failed to send Discord message:", error);
    throw new Error("Failed to send Discord message");
  }
};
