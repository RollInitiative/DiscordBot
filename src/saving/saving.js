const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');

const DataFolder = path.dirname(process.argv[1]) + '/saves/';

const userTemplate = require('./data/user_template.json');

module.exports = {
	
	saveUser: function(userID, userObj) {
		writeToUserFile(userID, userObj);
		return loadExistingUser(userID);
	}
	,
	loadUser: function(userID) {
		
		var userObj = {};
		if (userExists(userID)) {
			console.log('User found.');
			userObj = loadExistingUser(userID);
		} else {
			userObj = createUser(userID);
		}
		
		return userObj;
	}
	
};

getUserFilepath = function(userID) {
	return DataFolder + userID + '.json';
}

userExists = function(userID) {
	return fs.existsSync(getUserFilepath(userID));
}

createUser = function(userID) {

	// Shallow copy, not "production level performance"
	var newUser = JSON.parse(JSON.stringify(userTemplate));
	newUser.UserID = userID;

	writeToUserFile(userID, newUser);	
	
	console.log('Created user ' + userID);
	return loadExistingUser(userID);
}

loadExistingUser = function(userID) {

	// Loading template user first to ensure new user has all new attributes
	var baseUser = JSON.parse(JSON.stringify(userTemplate));
	var user = JSON.parse(fs.readFileSync(getUserFilepath(userID)));
	for (var property in user) {
		baseUser[property] = user[property];
	}
	return baseUser;
}

writeToUserFile = function(userID, userObj) {
	fs.writeFileSync(getUserFilepath(userID), JSON.stringify(userObj));
}