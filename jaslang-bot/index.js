const TelegramBot = require("node-telegram-bot-api");

const token = "BOT_TOKENINGNI_BU_YERGA_QO'Y"; 
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Ro‘yxatdan o‘tdingiz ✅ Endi saytingizga kiring 👇", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Saytga o‘tish", url: "https://sizning-saytingiz.com/login" }]
      ]
    }
  });
});
