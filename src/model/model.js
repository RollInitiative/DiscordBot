var fishing = require('./../fishing/fishing');
var saving = require('./../saving/saving');
var hunting = require('./../monsters/monsters');
var utils = require('./../utils/utils');

var users = {};

userIsLoggedIn = function(userID) {
	return users[userID] != null;
}

var loginUser = function(userID) {
	users[userID] = saving.loadUser(userID);
}

var processMessage = function(message) {

	var userID = message.author.id;
	var channel = message.channel;

	var strCommands = message.content.split(' ');
	var strMessage = '';

	if (!userIsLoggedIn(userID)) {
		loginUser(userID);
		strMessage += 'User logged in: ' + users[userID].Name + '\n';
	}
	
	var userName = users[userID].Name;

	var bNeedSaving = false;

	switch (strCommands[0]) {

		case 'Fish':
			var user = users[userID];
			strMessage += fishing.fish(message.channel, user);
			bNeedSaving = true;
			break;

		case 'SetName':
			if (strCommands.length > 1) {
				users[userID].Name = strCommands[1];
				bNeedSaving = true;
				strMessage += userID + ' set name to ' + users[userID].Name + '\n';
			}
			break;

<<<<<<< HEAD
		case 'Hunt':
			var user = users[userID];
			strMessage += hunting.hunt(message.channel, user);
			bNeedSaving = false;
=======
		case 'Replace':
			if (strCommands.length == 1) {
				strMessage += 'Replace takes text after the command and replaces it with symbols.';
			} else {
				// Take all arguments after command as a single space separated string
				var strArguments = strCommands.slice(1).join(' ').toLowerCase();
				strMessage += utils.translateString(strArguments);
			}
>>>>>>> c8f8d6c6ee3b5e544947cc43ceeb673249a461fb
			break;

		default:
			strMessage = `Command "${message.content}" not recognized.`;
	}

	// Save user data if needed
	if (bNeedSaving) {
		saving.saveUser(userID, users[userID]);
	}

	return strMessage;

}

module.exports = {
	
	processMessage: processMessage
	
};
