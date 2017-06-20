/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/
var model = require('./src/model/model');
var config = require('./config.json');

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
var token = '';

var myClientID;

const commandPrefix = '!PK';

var bEnabled = true;
var commandQueue = [];

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
	console.log('I am ready!');
	myClientID = client.user.id;
});

// Create an event listener for messages
client.on('message', message => {
	
	if (!inputIsACommand(message.content)) {
		return;
	}
	
	if (inputMatchesCommand(message.content, 'Enable')) {
		message.channel.send((bEnabled) ? 
			'PK-Bot is already enabled.' :
			'PK-Bot re-enabled.'
		);
		bEnabled = true;
		return;
	} else if (inputMatchesCommand(message.content, 'Disable')) {
		message.channel.send((bEnabled) ? 
			'PK-Bot disabled, re-enabled with "!PKEnable".' :
			'PK-Bot is already disabled.');
		bEnabled = false;
		return;
	}

	if (!bEnabled) {
		return;
	}

	message.content = removeCommandPrefix(message.content);
	
	if (message.author.id === myClientID) {
		return;
	}
	commandQueue.push(message);
	
});

inputIsACommand = function(input) {
	return input.startsWith(commandPrefix);
}

removeCommandPrefix = function(command) {
	return command.replace(commandPrefix, '');
}

inputMatchesCommand = function(input, string) {
	return input === commandPrefix + string;
}

serverLoop = function() {
	
	var startTime = (new Date).getTime();
	
	if (commandQueue.length > 0) {

		var userMessages = filterMessages();
		for (var key in userMessages) {
			var message = userMessages[key];
			var strMessage = model.processMessage(userMessages[key]);
			message.channel.send(strMessage);
		}
	}	

	var endTime = (new Date).getTime();
	var msElapsed = endTime - startTime;
	
	var timeToSleep = tickInterval - msElapsed;

	if (timeToSleep < 0) {
		console.log(`Thread falling behind by ${timeToSleep}ms`);
		timeToSleep = 0;
	}

	setTimeout(serverLoop, timeToSleep);
}

// Filters messages so only the last message from a user is done
filterMessages = function() {
	var userMessages = {};
	for (var i = 0; i < commandQueue.length; i++) {
		var message = commandQueue[i];
		userMessages[message.author.id] = message;
	}
	commandQueue.length = 0;
	return userMessages;
}

// Read token from environment variable if user doesn't specify one
var envToken = process.env.DISCORD_BOT_TOKEN;
if (token.length <= 0 && envToken) {
    token = envToken;
}

// Log our bot in
client.login(token);

var tickInterval = (1000 * 60) / config.ServerTicksPerMinute;
setTimeout(serverLoop, tickInterval);
