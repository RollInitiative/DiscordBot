/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/
var model = require('./src/model/model');

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

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

// Parse through environment file to turn key-value into variables
const fs = require('fs');
try {
	var data = fs.readFileSync('./.env')
} catch (error) {
	console.log("Error: Cannot read .env file");
	process.exit(1);
}

data.toString().split('\n').forEach(function (line) {
	// looks for key value pairs seperated by '='
	var arr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);

	if (arr != null) {
		var key = arr[1];
		var value = arr[2];

		if (value && !process.env.hasOwnProperty(key)) {
			// assign variable to nodes built-in environment object map
			process.env[key] = value;
		}
	}
});

// Make sure the user has set a bot token
var token = process.env.BOT_TOKEN;
if (!token) {
	console.log("Error: BOT_TOKEN not specified");
	process.exit(1);
}

// Log our bot in
client.login(token);

var tickInterval = (1000 * 60) / process.env.ServerTicksPerMinute;
setTimeout(serverLoop, tickInterval);