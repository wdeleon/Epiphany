"use strict";

async function loadJSON (url) {
	return new Promise((resolve, reject) => {
		let result = {
			loadSuccess: false,
			loadOKStatus: false,
			parseSuccess: false,
		}
		const options = {cache: "no-cache"};
		fetch(url, options)
		.then(response => {
			result.loadSuccess = true;
			if (response.ok) {
				result.loadOKStatus = true;
				response.json()
				.then(res => {
					result.parseSuccess = true;
					result.data = res;
					resolve(result);
				})
				.catch(err => {
					reject(result);
				});
			}
			else {
				reject(result);
			}
		})
		.catch(err => {
			reject(result);
		});
	});
}
