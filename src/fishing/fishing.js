const Discord = require('discord.js');
const utils = require('./../utils/utils');

const fishingData = require('./data/fishing.json')

var moduleID;
var entityIDDict = {};
var entityRarityDict = {};
var rarityRateList = [];

module.exports = {
	
	fish: function(channel, playerObj) {
		var item = rollRarity();
		addItemToUser(playerObj, item);
		
		return createReturnString(playerObj, item);
	}
	
};

rollRarity = function() {
	var roll = Math.random() * rarityRateList[rarityRateList.length - 1][0];
	var item;
	
	for (var i = 0; i < rarityRateList.length; i++)
	{
		var rarityList = rarityRateList[i];
		if (roll < rarityList[0]) {
			var rarity = rarityList[1];
			var secondRoll = parseInt(Math.random() * entityRarityDict[rarity].length);
			item = entityRarityDict[rarity][secondRoll];
			break;
		}
	}
	return item;
}

loadData = function() {
	moduleID = fishingData.ModuleID;
	fishingData.Entities.forEach(obj => {
		var id = obj.ID;
		entityIDDict[id] = obj;

		var rarity = obj.Rarity;
		if (entityRarityDict[rarity] == null) {
			entityRarityDict[rarity] = [];
		}
		entityRarityDict[rarity].push(obj);
	});

	var percentageCounter = 0;
	fishingData.Rarities.forEach(obj => {
		percentageCounter += parseInt(obj.Percentage);
		rarityRateList.push([percentageCounter, obj.Rarity]);
	});
	console.log(rarityRateList);
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