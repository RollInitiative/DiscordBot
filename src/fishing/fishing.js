const Discord = require('discord.js');
const utils = require('./../utils/utils');
const monsters = require('./../monsters/monsters.js') 
const fishingData = require('./data/fishing.json')

var moduleID;
var lootTable = {};
var entityIDDict = {};

module.exports = {
	
	fish: function(channel, playerObj) {
		var item = utils.rollFromLootTable(lootTable);

                if (item.Name == "monster") {
                  var strMessage = monsters.surprise(playerObj);
                  strMessage += '\n';
                  return strMessage;
                }
		addItemToUser(playerObj, item);
		
		return createReturnString(playerObj, item);
	}
	
};

loadData = function() {
	
	lootTable = utils.generateLootTable(fishingData);

	moduleID = fishingData.ModuleID;
	fishingData.Entities.forEach(obj => {
		var id = obj.ID;
		entityIDDict[id] = obj;
	});
}

addItemToUser = function(playerObj, itemObj) {
	var fullItemID = utils.concatFullItemID(moduleID, itemObj.ID);
	if (playerObj[fullItemID] == null) {
		playerObj[fullItemID] = 0;
	}
	playerObj[fullItemID]++;
}

createReturnString = function(user, item) {
        
	var strMessage = `${user.Name} caught ${item.Name}!`;
	if (item.Emote != null) {
		strMessage += ' ' + item.Emote;
	}
	strMessage += `\nNumber of -`;
	var fishingAttrs = utils.getAllUserAttrsFromModule(user, moduleID);
	for (var attr in fishingAttrs) {
		var itemID = utils.getItemIDFromFullItemID(attr);
		if (entityIDDict[itemID] != null) {
			strMessage += ` ${entityIDDict[itemID].Name}: ${user[attr]}`;
		}
	}
	strMessage += '\n';
	return strMessage;
}

loadData();
