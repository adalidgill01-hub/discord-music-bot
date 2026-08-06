const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

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

  if (!message.content.startsWith("?play ")) return;

  const url = message.content.split(" ")[1];

  if (!url) {
    return message.reply("❌ Escribe un enlace de YouTube.");
  }

  if (!message.member.voice.channel) {
    return message.reply("❌ Debes estar en un canal de voz.");
  }

  try {
    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const stream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    });

    const resource = createAudioResource(stream);

    player.play(resource);
    connection.subscribe(player);

    message.reply("🎵 Reproduciendo música.");
  } catch (err) {
    console.error(err);
    message.reply("❌ No pude reproducir esa canción.");
  }
});

client.login(process.env.TOKEN);
