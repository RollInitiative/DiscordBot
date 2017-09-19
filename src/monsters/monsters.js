const Discord = require('discord.js');
const utils = require('./../utils/utils');
const monsterData = require('./data/monsters.json')

var moduleID;
var monsterTable = {};
var entityIDDict = {};

module.exports = {
	
	hunt: function(channel, playerObj) {
		var monster = utils.rollFromLootTable(monsterTable);
		return createHuntReturnString(playerObj, monster);
	},
	surprise: function(playerObj) {
		var monster = utils.rollFromLootTable(monsterTable);
		return createSurpriseReturnString(playerObj, monster);
	}
};

loadData = function() {
	monsterTable = utils.generateLootTable(monsterData);
	moduleID = monsterData.ModuleID;
	monsterData.Entities.forEach(obj => {
		var id = obj.ID;
		entityIDDict[id] = obj;
	});
}

createHuntReturnString = function(user, monster) {
	var strMessage = `${user.Name} encountered ${monster.Name}!`;
	return strMessage;
}

createSurpriseReturnString = function(user, monster) {
	var strMessage = `${user.Name} is caught by surprise by a ${monster.Name}!`;
	return strMessage;
}

loadData();
