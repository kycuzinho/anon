require('dotenv').config();

const { Client, GatewayIntentBits, Partials } = require('discord.js');

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

client.once('ready', () => {
  console.log(`Logado como ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  try {
    if (message.channel.type === 1 && !message.author.bot && message.author.tag === 'kyco') {
      const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID);
      const senderChannel = await client.channels.fetch(MESSAGE_SENDER_CHANNEL_ID);
      console.log('O usuário é o kyco')

      if (targetChannel) {
        await targetChannel.send({
          content: `${message.content}`,
          allowedMentions: { parse: [] }, // Suppresses mentions
        });
        await senderChannel.send(
          `**Mensagem de ${message.author.tag}:**\n${message.content}`
        );
      } else {
        console.error('Não existe um canal para enviar a mensagem!');
      }
    }else{
      console.log('vim parar aqui')
    }
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }
});

client.login(BOT_TOKEN);
