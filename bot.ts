import * as TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import getTokenInfo from "./src/tokenInfo";

dotenv.config();
const token: string = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const knownCommands = ["/start"];

export default function configureBot() {
  bot.onText(/\/start/, (msg: TelegramBot.Message) => {
    bot.sendMessage(msg.chat.id, "Please, enter your token");
  });

  bot.onText(/\/help/, (msg: TelegramBot.Message) => {
    bot.sendMessage(msg.chat.id, "Available commands. \n\n/start - start chat");
  });

  bot.on("message", async (msg) => {
    if (!msg.text) return;

    const isCommand = msg.text.startsWith("/");

    if (isCommand && !knownCommands.includes(msg.text)) {
      bot.sendMessage(
        msg.chat.id,
        "Please use /help to see the list of available commands."
      );
      return;
    }

    const tokenAddress = msg.text;
    if (tokenAddress) {
      await getTokenInfo(bot, msg.chat.id, tokenAddress);
    }
  });
}
