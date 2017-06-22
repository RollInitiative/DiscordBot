var fishing = require('./../fishing/fishing');
var saving = require('./../saving/saving');

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