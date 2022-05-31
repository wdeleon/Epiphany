"use strict";

class Animation {
	startTime = null;
	nextFrameDue = null;
	duration = 300;	// Milliseconds
	lastFrameRequestID = null;
	nextFrameDue = null;
	continueLoop = true;
	toId = null;
	fromId = null;
	effectFn = null;
	
	constructor (effect) {
		this.effectFn = effect;
		this.effectFn = this.effectFn.bind(this);
		this.loop = this.loop.bind(this);
	}
	
	start (id, old_id) {
		this.totalFrames = 0;
		this.continueLoop = true;
		this.toId = id;
		this.fromId = old_id;
		
		// Set size of canvas based on strip image natural dimensions
		let x = strip.cache[this.toId].img.naturalWidth;
		let y = strip.cache[this.toId].img.naturalHeight;
		if (render.pixelX != x) {
			render.pixelX = x;
		}
		if (render.pixelY != y) {
			render.pixelY = y;
		}

		this.startTime = performance.now();
		this.nextFrameDue = performance.now();
		this.lastFrameRequestID = requestAnimationFrame(this.loop);
	}
	
	cancel () {
		if (this.lastFrameRequestID !== null && this.continueLoop) {
			cancelAnimationFrame(this.lastFrameRequestID);
		}
	}
	
	loop (t) {
		//if (t >= this.nextFrameDue) {
			if (render.displayChanged) {
				render.setupDisplay();
			}
			
			let progress = (t - this.startTime) / this.duration;
			if (progress >= 1) {
				progress = 1;
			}
			this.effectFn(progress);
			
			if (progress == 1) {
				this.continueLoop = false;
			}
			
			// Find the time at which the next frame refresh is due to be rendered
			// This can be used as a frame rate limiter
			//while (t > this.nextFrameDue) {
			//	this.nextFrameDue += render.interval;
			//}
		//}
		
		if (this.continueLoop) {
			this.lastFrameRequestID = requestAnimationFrame(this.loop);
		}
	}
}

let stripAnimation = {
	simpleFade: new Animation(function (progress) {
		render.context.globalAlpha = progress;
		render.context.drawImage(strip.cache[this.toId].img, 0, 0);
	}),
	
	slideForward: new Animation(function (progress) {
		render.context.globalAlpha = 1.0;
		render.context.fillStyle = "#FFFFFF";
		render.context.fillRect(0, 0, render.pixelX, render.pixelY);
		
		if (this.fromId !== null && this.fromId != this.toId) {
			 render.context.globalAlpha = 1.0 - progress;
			 //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			 render.context.drawImage(
				strip.cache[this.fromId].img,
				0,
				0,
				render.pixelX,
				render.pixelY,
				0 - Math.floor(progress * render.pixelX),
				0,
				render.pixelX,
				render.pixelY
			);
		}
		
		render.context.globalAlpha = progress;
		render.context.drawImage(
			strip.cache[this.toId].img,
			0,
			0,
			render.pixelX,
			render.pixelY,
			Math.floor((1.0 - progress) * render.pixelX),
			0,
			render.pixelX,
			render.pixelY
		);
	}),
	
	slideBackward: new Animation(function (progress) {
		render.context.globalAlpha = 1.0;
		render.context.fillStyle = "#FFFFFF";
		render.context.fillRect(0, 0, render.pixelX, render.pixelY);
		
		if (this.fromId !== null && this.fromId != this.toId) {
			render.context.globalAlpha = 1.0 - progress;
			render.context.drawImage(
				strip.cache[this.fromId].img,
				0,
				0,
				render.pixelX,
				render.pixelY,
				Math.floor(progress * render.pixelX),
				0,
				render.pixelX,
				render.pixelY
			);
		}
		
		render.context.globalAlpha = progress;
		render.context.drawImage(
			strip.cache[this.toId].img,
			0,
			0,
			render.pixelX,
			render.pixelY,
			0 - Math.floor((1.0 - progress) * render.pixelX),
			0,
			render.pixelX,
			render.pixelY
		);
	}),
	
	/* Some examples of alternate strip transition animations: */
	/*
	cornerSlideForward: new Animation(function (progress) {
		render.context.globalAlpha = 1.0;
		render.context.fillStyle = "#FFFFFF";
		render.context.fillRect(0, 0, render.pixelX, render.pixelY);
		
		
		
		let scale = (1.0 - progress) * (1.0 - progress);
		if (this.fromId !== null && this.fromId != this.toId) {
			render.context.globalAlpha = 1.0 - scale;
			render.context.drawImage(
				strip.cache[this.fromId].img,
				0,
				0,
				render.pixelX,
				render.pixelY,
				0,
				render.pixelY - Math.floor((1.0 - progress) * render.pixelY),
				Math.floor(scale * render.pixelX),
				Math.floor(scale * render.pixelY)
			);
		}
		
		scale = progress * progress; // 1.0 - scale;
		render.context.globalAlpha = scale;
		render.context.drawImage(
			strip.cache[this.toId].img,
			0,
			0,
			render.pixelX,
			render.pixelY,
			render.pixelX - Math.ceil(scale * render.pixelX),
			0,
			Math.floor(scale * render.pixelX),
			Math.floor(scale * render.pixelY)
		);
	}),
	
	cornerSlideBackward: new Animation(function (progress) {
		render.context.globalAlpha = 1.0;
		render.context.fillStyle = "#FFFFFF";
		render.context.fillRect(0, 0, render.pixelX, render.pixelY);
		
		let scale = (1.0 - progress) * (1.0 - progress);
		if (this.fromId !== null && this.fromId != this.toId) {
			render.context.globalAlpha = 1.0 - scale;
			render.context.drawImage(
				strip.cache[this.fromId].img,
				0,
				0,
				render.pixelX,
				render.pixelY,
				render.pixelX - Math.floor((1.0 - progress) * render.pixelX),
				0,
				Math.floor(scale * render.pixelX),
				Math.floor(scale * render.pixelY)
			);
		}
		
		scale = progress * progress; // 1.0 - scale;
		render.context.globalAlpha = scale;
		render.context.drawImage(
			strip.cache[this.toId].img,
			0,
			0,
			render.pixelX,
			render.pixelY,
			0,
			render.pixelY - Math.ceil(scale * render.pixelY),
			Math.floor(scale * render.pixelX),
			Math.floor(scale * render.pixelY)
		);
	}),
	*/
};
