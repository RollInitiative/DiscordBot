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
	
};