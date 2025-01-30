import { DISCORD_USER_IDS } from "../environment";
import { sendDirectMessage } from "../libs/discord";

export const notifyUsers = async (message: string) => {
  const userIds = DISCORD_USER_IDS.split(",");
  const messageWithSeparator = `==========\n${message}`;
  const promises = userIds.map((userId) =>
    sendDirectMessage(userId, messageWithSeparator).catch((error) => {
      console.error(`Error sending message to user ${userId}:`, error);
    })
  );
  await Promise.all(promises);
};
