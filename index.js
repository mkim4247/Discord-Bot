console.log('fuku island')

const fetch = require('node-fetch')
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'NzAwNDE0ODEzNDI3MjA0MTU2.XpineA.PHhvhaF7yIV1ocId1B5hoUMYAnQ'
const channelId = '700421543041171568'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", member => {
  console.log(`New User: "${member.user.username}" has joined "${member.guild.name}"`);

  member.guild.channels.cache.get(channelId).send(`Hi ${member.user}, Welcome to FUKU's ISLAND! \:star_struck:\:star_struck:`)
});

client.on('message', msg => {
  if(msg.author.bot) return;
  if(msg.content === '/dad') {
    fetch('https://icanhazdadjoke.com/', {
      method: "GET",
      headers: {
        Accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => msg.reply(data.joke))
  }
});




client.login(token);
