require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');
const keep_alive = require('./keep_alive.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;
const MESSAGE_SENDER_CHANNEL_ID = process.env.MESSAGE_SENDER_CHANNEL_ID;
const ALLOWED_USER_ID = process.env.ALLOWED_USER_ID; // O ID do usuário autorizado

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  try {
    // Verifica se a mensagem é de um canal de texto ou DM e se o autor não é um bot
    if (!message.author.bot && message.author.id === ALLOWED_USER_ID) {
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
      const senderChannel = await client.channels.fetch(MESSAGE_SENDER_CHANNEL_ID);

      console.log(`Mensagem recebida de usuário autorizado: ${message.author.tag}`);

      if (targetChannel && senderChannel) {
        await targetChannel.send({
          content: `${message.content}`,
          allowedMentions: { parse: [] }, // Suprime menções
        });
        await senderChannel.send(
          `**Mensagem de ${message.author.tag}:**\n${message.content}`
        );
      } else {
        console.error('Os canais necessários não foram encontrados!');
      }
    } else {
      console.log('Mensagem ignorada: Usuário não autorizado ou mensagem de bot.');
    }
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }
});

client.login(BOT_TOKEN);
