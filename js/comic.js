"use strict";

let comic = {
	parseSuccess: false,
	
	load: async function (forceReload = false) {
		if (!comic.parseSuccess || forceReload) {
			return new Promise(async function (resolve, reject) {
				let result = await loadJSON('data/comic/comic.txt');
				if (result.parseSuccess) {
					comic.parseSuccess = true;
					for (let item in result.data) {
						comic[item] = result.data[item];
					}
					resolve(true);
				}
				else {
					reject(false);
				}
			});
		}
	},
};
