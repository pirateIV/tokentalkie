import * as TelegramBot from "node-telegram-bot-api";
import { Pair, SearchResponse } from "./types";

const API_URL: string = "https://api.dexscreener.com/latest/dex/tokens/";

export default async function getTokenInfo(
  bot: TelegramBot,
  chatId: TelegramBot.ChatId,
  token: string
) {
  const url: string = API_URL + token;

  try {
    const response = await fetch(url);
    const data: SearchResponse = await response.json();

    const isTokenInvalid = data.pairs === null;
    if (isTokenInvalid) {
      bot.sendMessage(chatId, "Invalid token");
      return;
    }

    const pair: Pair = data.pairs[0];

    const {
      baseToken,
      quoteToken,
      priceUsd,
      liquidity,
      fdv,
      pairCreatedAt,
      info,
    } = pair;
    let message: string;

    const createdAtDate: Date = new Date(pairCreatedAt);
    const ageInDays: number = Math.floor(
      (Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const ath = (fdv * parseFloat(priceUsd)) / liquidity.usd;
    const fdvInMillions = (fdv / Math.pow(10, 6)).toFixed(1);
    const liqInMillions = (liquidity.usd / Math.pow(10, 6)).toFixed(1);

    const website = info.websites.length > 0 ? info.websites[0].url : "";
    const telegram = info.socials.find((s) => s.type === "telegram")?.url || "";

    const name = baseToken.name || baseToken.symbol;
    const baseTokenName = `🟡 $${name}[${fdvInMillions}m] - [${name}]`;
    const FDV = `💎 FDV: $${fdvInMillions}m | $${parseFloat(priceUsd).toFixed(
      6
    )}`;
    const LIQ = `💦 LIQ: $${liqInMillions}m `;
    const ATH = `⛰️ ATH: $${ath}m`;
    const AGE = `⏳ AGE: ${ageInDays}d ago`;
    const SOC = `🌐 soc: <a href="${website}">website</a> | <a href="${telegram}">telegram</a>`;

    message = `${baseTokenName}\n${FDV}\n${LIQ}\n${ATH}\n${AGE}\n${SOC}\n\n<code>${baseToken.address}</code>`;

    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (error) {
    console.log(error);
    // return bot.sendMessage(chatId, "Please, try again later");
  }
}
