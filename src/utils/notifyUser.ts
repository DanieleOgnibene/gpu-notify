import player from "play-sound";
import { DISCORD_USER_ID } from "../environment";
import { sendDirectMessage } from "../libs/discord";

const audioPlayer = player({});

const playSound = () => {
  audioPlayer.play("src/assets/notification.mp3", (err) => {
    if (err) console.error("Error playing the sound:", err);
  });
};

export const notifyUser = async (message: string) => {
  playSound();
  await sendDirectMessage(DISCORD_USER_ID, message);
  console.log(`Message sent to user ${DISCORD_USER_ID}: ${message}`);
};
