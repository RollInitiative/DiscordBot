const replaceData = require('./data/letter_replacement.json');
const token = '|';

splitFullItemID = function(fullItemID) {
	var strParts = String(fullItemID).split('|');
	return { "moduleID": strParts[0], "itemID": parseInt(strParts[1]) };
}

itemIDBelongsToModule = function(fullItemID, moduleID) {
	var idParts = splitFullItemID(fullItemID);
	// Double equals in case of string comparision
	return moduleID == idParts.moduleID && !isNaN(idParts.itemID);
}

getItemIDFromFullItemID = function(fullItemID) {
	var idParts = splitFullItemID(fullItemID);
	return idParts.itemID;
}

generateLootTable = function(data) {
	var lootTable = { 'rarityTable': [], 'rarityToItemDict': {} };
	moduleID = data.ModuleID;
	data.Entities.forEach(obj => {

		var rarity = obj.Rarity;
		if (lootTable.rarityToItemDict[rarity] == null) {
			lootTable.rarityToItemDict[rarity] = [];
		}
		lootTable.rarityToItemDict[rarity].push(obj);
	});

	var percentageCounter = 0;
	data.Rarities.forEach(obj => {
		percentageCounter += parseInt(obj.Percentage);
		lootTable.rarityTable.push([percentageCounter, obj.Rarity]);
	});

	return lootTable;
}

rollFromLootTable = function(lootTable) {
	var roll = Math.random() * lootTable.rarityTable[lootTable.rarityTable.length - 1][0];
	var item;
	
	for (var i = 0; i < lootTable.rarityTable.length; i++)
	{
		var rarityList = lootTable.rarityTable[i];
		if (roll < rarityList[0]) {
			var rarity = rarityList[1];
			var secondRoll = parseInt(Math.random() * lootTable.rarityToItemDict[rarity].length);
			item = lootTable.rarityToItemDict[rarity][secondRoll];
			break;
		}
	}
	return item;
}

translateString = function(string) {
	
	var newString = '';
	for (var i = 0; i < string.length; i++) {
		var char = replaceData.Replacements[string[i]];
		if (char != null) {
			newString += char;
		}
	}
	return newString;
}

module.exports = {
	
	concatFullItemID: function(moduleID, itemID) {
		return moduleID + '|' + itemID; 
	}
	,
	splitFullItemID: splitFullItemID
	,
	getAllUserAttrsFromModule: function(userObj, moduleID) {
		var retAttrs = {};
		for (var property in userObj) {
			if (itemIDBelongsToModule(property, moduleID)) {		
				retAttrs[property] = userObj[property];
			}
		}
		return retAttrs;
	}
	,
	itemIDBelongsToModule: itemIDBelongsToModule
	,
	getItemIDFromFullItemID : getItemIDFromFullItemID
	,
	generateLootTable: generateLootTable
	,
	rollFromLootTable: rollFromLootTable
	,
	translateString: translateString
};
