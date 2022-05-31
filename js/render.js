"use strict";

let render = {
	pX: 1280,
	pY: 460,
	sX: 1,
	sY: 1,
	ctxType: '2d',
	displayChanged: false,
	
	interval: 1000 / 60, //1000 milliseconds per second / frames per second = milliseconds per frame
	
	get fps () {
		return 1000 / this.interval;
	},
	
	set fps (rate) {
		this.interval = 1000 / rate;
	},
	
	get pixelX () {
		return this.pX;
	},
	
	get pixelY () {
		return this.pY;
	},
	
	set pixelX (p) {
		this.pX = p;
		this.displayChanged = true;

	},
	
	set pixelY (p) {
		this.pY = p;
		this.displayChanged = true;
	},
	
	get scaleX () {
		return this.sX;
	},
	
	get scaleY () {
		return this.sY;
	},
	
	set scaleX (s) {
		this.sX = s;
		this.displayChanged = true;

	},
	
	set scaleY (s) {
		this.sY = s;
		this.displayChanged = true;
	},
	
	setupDisplay: function () {
		// Resize canvas physical pixel size
		DOM['main_canvas'].style.width = (this.pX * this.sX) + 'px';
		DOM['main_canvas'].style.height = (this.pY * this.sY) + 'px';

		// Logically resize canvas, allowing the browser to handle scaling
		DOM['main_canvas'].width = this.pX;
		DOM['main_canvas'].height = this.pY;
		
		// Reset display changed flag
		this.displayChanged = false;
	},
	
	set context (c) {
		this.ctx = c.getContext(this.ctxType);
	},
	
	get context () {
		return this.ctx;
	},
};
