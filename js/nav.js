"use strict";

let nav = {
	firstId: null,
	prevId: null,
	currentId: null,
	nextId: null,
	lastId: null,
	recordId: false,
	direction: true,	// true = forward, false = reverse
	
	DOMWriteTimer: 10,	// Milliseconds to delay writing anchor hrefs to avoid getting wrong hash values in URL
	
	get first () {
		return this.firstId;
	},
	get prev () {
		return this.prevId;
	},
	get current () {
		return this.currentId;
	},
	get next () {
		return this.nextId;
	},
	get last () {
		return this.lastId;
	},
	
	get forward () {
		if (this.direction) {
			return true;
		}
		return false;
	},
	
	get reverse () {
		if (!this.direction) {
			return true;
		}
		return false;
	},
	
	set first (id) {
		this.firstId = id;
		setTimeout(() => {
			DOM['strip_nav_first'].href = '#' + id;
		}, nav.DOMWriteTimer);
	},
	
	set prev (id) {
		this.prevId = id;
		setTimeout(() => {
			DOM['strip_nav_prev'].href = '#' + id;
		}, nav.DOMWriteTimer);
	},
	
	set current (id) {
		this.currentId = id;
	},
	
	set next (id) {
		this.nextId = id;
		setTimeout(() => {
			DOM['strip_nav_next'].href = '#' + id;
			DOM['strip_next'].href = '#' + id;		// For clicking directly on the strip itself
		}, nav.DOMWriteTimer);
	},
	
	set last (id) {
		this.lastId = id;
		setTimeout(() => {
			DOM['strip_nav_last'].href = '#' + id;
		}, nav.DOMWriteTimer);
	},
	
	set forward (dir) {
		this.direction = false;
		if (dir) {
			this.direction = true;
		}
	},
	
	set reverse (dir) {
		this.direction = true;
		if (dir) {
			this.direction = false;
		}
	},
		
	
	init: function () {
		window.addEventListener('hashchange', nav.hashChange);
		
		nav.first = comic.first;
		nav.last = comic.last;
		
		DOM['strip_nav_first'].addEventListener('click', () => {nav.reverse = true;});
		DOM['strip_nav_prev'].addEventListener('click', () => {nav.reverse = true;});
		DOM['strip_nav_next'].addEventListener('click', () => {nav.forward = true;});
		DOM['strip_next'].addEventListener('click', () => {nav.forward = true;});
		DOM['strip_nav_last'].addEventListener('click', () => {nav.forward = true;});
		
		// Anchor (#) to a comic strip number should override stored position:
		let url_parts = window.location.href.split('#');
		if (url_parts.length > 1 && url_parts[1] != '') {
			nav.recordId = false;	// Prevents user's place from being lost if they're linked directly to a different strip
			nav.hashChange();
		}
		else {
			let curr = settings.lastViewed;
			nav.current = curr != null ? curr : comic.first;
			window.location.hash = "#" + nav.current;
		}
	},
	
	hashChange: function () {
		let url_parts = window.location.href.split('#');
		if (url_parts.length > 1 && url_parts[1] != '') {
			nav.moveTo(url_parts[1]);
		}
	},
	
	moveTo: async function (id) {
		try {
			await strip.load(id);
			if (strip.cache[id].loadSuccess) {
				nav.prev = id;
				if (strip.cache[id].prevId != null) {
					nav.prev = strip.cache[id].prevId;
				}

				nav.next = id;
				if (strip.cache[id].nextId != null) {
					nav.next = strip.cache[id].nextId;
				}
				
				// Don't record the last viewed strip if it was navigated to from an external link
				// This would cause people sharing links to strips to clobber other peoples' saved places
				if (nav.recordId) {
					settings.lastViewed = id;
				}
				if (settings.savePlace != 'false') {
					nav.recordId = true;	// Start recording the user's place again
				}
				
				// Show new strip:
				let anim_name = nav.forward ? "slideForward" : "slideBackward";
				await strip.show(id, nav.current, anim_name);
				
				nav.current = id;
				
				// Preemptively load next and previous strips:
				if (settings.precacheStrips != 'false') {
					// Disable pre-loading if the option for it is unselected
					if (nav.next != id && !strip.cache.hasOwnProperty(nav.next)) {
						strip.load(nav.next);
					}
					if (nav.prev != id && !strip.cache.hasOwnProperty(nav.prev)) {
						strip.load(nav.prev);
					}
				}
			}
			else {
				// TODO: Error image?
				//console.log("Error");
			}
		}
		catch (err) {
			// TODO: Error image?
			//console.log("Error");
		}
	},
};
