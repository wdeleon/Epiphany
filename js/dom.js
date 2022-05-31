"use strict";

// NOTE: When using this code, the id attribute of 'init' should be treated as reserved, and not used in the HTML document.
let DOM = {	
	init: function () {
		// Get a list of all the elements in the page:
		let element_list = document.getElementsByTagName('*');
		
		// Get a handle for every element with the id attribute set:
		for (let elem of element_list) {
			let id = elem.id;
			if (id != '') {
				DOM[id] = elem;
			}
		}
	}
};
