const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith("?play")) return;

  if (!message.member.voice.channel) {
    return message.reply("❌ Debes estar en un canal de voz.");
  }

  joinVoiceChannel({
  channelId: message.member.voice.channel.id,
  guildId: message.guild.id,
  adapterCreator: message.guild.voiceAdapterCreator,
  selfDeaf: false,
  selfMute: false,
});

  message.reply("✅ Entré al canal de voz.");
});
setInterval(() => {
  const canal = client.channels.cache.get("1534842015307534366");

  if (canal) {
    joinVoiceChannel({
      channelId: canal.id,
      guildId: canal.guild.id,
      adapterCreator: canal.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    });
  }
}, 60000);

client.login(process.env.TOKEN);
