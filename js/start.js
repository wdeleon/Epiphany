"use strict";

window.addEventListener('load', async function () {
	await DOM.init();
	await comic.load();
	await settings.init();
	render.setupDisplay();
	render.context = DOM['main_canvas'];
	nav.init();
});
