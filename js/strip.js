"use strict";

// For strip entry / exit functions to use:
let tempData = {};

let strip = {
	cache: {},
	logoAnimation: null,
	previousAnimEffect: null,
	
	load: async function (id) {
		return new Promise(async function (resolve, reject) {
		
		if (!strip.cache.hasOwnProperty(id) || !strip.cache[id].loadSuccess) {
			try {
				let result = await loadJSON('data/' + id + '.txt');
				if (result.parseSuccess) {
					// JSON data:
					strip.cache[id] = {};
					for (let item in result.data) {
						strip.cache[id][item] = result.data[item];
					}
					strip.cache[id].loadSuccess = false;
					
					// Image:
					strip.cache[id].img = new Image();
					strip.cache[id].img.onload = () => {
						strip.cache[id].loadSuccess = true;	
						resolve(true);
					};
					strip.cache[id].img.src = 'strips/' + strip.cache[id].imgFile;
				}
				else {
					reject(false);
				}
			}
			catch (err) {
				//console.log(err);
				reject(false);
			}
		}
		else {
			resolve(true);
		}
		
		});
	},
	
	show: async function (id, old_id, anim_effect = "slideForward") {
		try {
			await strip.load(id);
			if (strip.cache[id].loadSuccess) {
				// Run any unshow event code from the old strip:
				if (strip.cache[old_id] !== undefined) {
					if (strip.cache[old_id].exitFn != null) {
						let exitFn = new Function(strip.cache[old_id].exitFn);
						exitFn();
					}
				}
				
				// Start main strip transition animation:
				if (this.previousAnimEffect != null) {
					stripAnimation[this.previousAnimEffect].cancel();
				}
				stripAnimation[anim_effect].start(id, old_id);
				this.previousAnimEffect = anim_effect;
				
				// Set strip title on canvas element:
				let strip_title = strip.cache[id].hasOwnProperty('title') ? strip.cache[id].title : "";
				DOM.main_canvas.title = strip_title;
				
				// Run any show event code from the new strip:
				if (strip.cache[id].entryFn != null) {
					let entryFn = new Function(strip.cache[id].entryFn);
					entryFn();
				}
			}
		}
		catch (err) {
			
		}
	},
};

/* Example code for creating strip entry / exit functions: */

	let e1 = () => {
		tempData.strip6subtitle = DOM['subtitle'].innerHTML;
		DOM['subtitle'].innerHTML = '<a href="../">See a customized version used for a real comic strip</a>';
	};
	e1 = e1.toString();
	console.log("Entry: " + JSON.stringify(e1));	// Trim the "() => {" and ending "}" off this to make it work well by itself with new Function(), or else
													// use with something like: entryfn = new Function ('return ' + e1)(); entryfn();
	
	let e2 = () => {
		DOM['subtitle'].innerHTML = tempData.strip6subtitle;
	};
	e2 = e2.toString();
	console.log("Exit: " + JSON.stringify(e2));		// Same as above, trim the "() => {" and ending "}" off this or use exitfn = new Function('return ' + e2)();
	
	let entry = new Function("return " + JSON.parse(JSON.stringify(e1)))();
	let exit = new Function("return " + e2)();
	
	//setTimeout(entry, 100);
	//setTimeout(exit, 1500);
