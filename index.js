console.log('fuku island online!')

const fetch = require('node-fetch')
const fs = require('fs');
const jsonfile = require('jsonfile');
const cron = require('node-cron');
const dialogflow = require('dialogflow');
const uuid = require('uuid');

const dotenv = require('dotenv').config();
const token = process.env.TOKEN

const Discord = require('discord.js');
const client = new Discord.Client();
const channelId = '700421543041171568'

let stats = {};
if(fs.existsSync('stats.json')){
  stats = jsonfile.readFileSync('stats.json');
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // secs(optional) - min - hr - day of month - month - day of wk
    const task = cron.schedule('0 9 * * 7', () => {
      client.channels.cache.get(channelId).send('connected')
      console.log("Don't forget to buy turnips!");
    }, {
      scheduled: true
    });
    task.start();
});

const projectId = 'small-talk-yofikt'

async function runSample(projectId = 'mall-talk-yofikt') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'hello',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}




client.on("guildMemberAdd", member => {
  console.log(`New User: "${member.user.username}" has joined "${member.guild.name}"`);

  member.guild.channels.cache.get(channelId).send(`Hi ${member.user}, Welcome to FUKU's ISLAND! \:star_struck:\:star_struck:`)
});

client.on('message', msg => {
  if(msg.author.bot){
    return
  }

  let [command, ...parts] = msg.content.split(' ');
  if(command === '!dad'){
    fetch('https://icanhazdadjoke.com/', {
      method: "GET",
      headers: {
        Accept: 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => msg.reply(data.joke))
  }
  if(command === '!hello'){
    msg.reply(`hi c:`);
  };

  if(command === '!namegen'){
    let rnd = Math.random();
    //shuffle the array of names
    for (let i = parts.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [parts[i], parts[j]] = [parts[j], parts[i]];
    }
    let str = ''
    for(let k = 0; k < parts.length; k++){
      str += `\n${k + 1}. ${parts[k]}`
    }
    msg.channel.send(`Name Generator: ${str}`)
  }

  if(msg.guild.id in stats === false){
    stats[msg.guild.id] = {};
  }

  const guildStats = stats[msg.guild.id];
  if(msg.author.id in guildStats === false) {
    guildStats[msg.author.id] = {
      level: 0,
      msgCount: 1
    };
  }
  else {
    guildStats[msg.author.id].msgCount++
  };

  const userStats = guildStats[msg.author.id];
  if(userStats.msgCount % 3 === 0){
    userStats.level++;
    msg.channel.send(`${msg.author.toString()} has reached level ${userStats.level}!`);
    jsonfile.writeFileSync('stats.json', stats);
  }

});

client.login(token);
