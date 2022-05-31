"use strict";

class LocalData {
	storageKeyPrefix = '';
	
	constructor (prefix) {
		this.storageKeyPrefix = prefix;
	}
	
	readSetting (setting) {
		return localStorage.getItem(this.storageKeyPrefix + setting);
	}
	
	writeSetting (setting, val) {
		localStorage.setItem(this.storageKeyPrefix + setting, val);
	}
	
	clearSetting (setting) {
		localStorage.removeItem(this.storageKeyPrefix + setting);
	}
	
	clearAll () {
		localStorage.clear();
	}
}
