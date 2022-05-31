"use strict";

let settings = {
	localData: null,
	resizeCallHandle: null,
	
	
	// Settings control dialog:
	controls: {
		panel: null,
		visible: false,
		
		showButton: null,
		closeButton: null,
		
		savePlaceCheckbox: null,
		precacheCheckbox: null,
		scaleSlider: null,
		scaleDisplay: null,
		scaleApplyButton: null,
		scaleResetButton: null,
		animateBgCheckbox: null,
		
		clearButton: null,

		switchVisibility: function () {
			if (settings.controls.visible) {
				settings.controls.hide();
			}
			else {
				settings.controls.show();
			}
		},
		
		show: function () {
			settings.controls.panel.showModal();
			settings.controls.visible = true;
		},
		
		hide: function () {
			settings.controls.panel.close();
			settings.controls.visible = false;
		},
		
		changeScaleSlider: function () {
			let scale_text = '(' + settings.controls.scaleSlider.value + '%';
			if (settings.scale == null) {
				scale_text += ', Automatic';
			}
			scale_text += ')';
			settings.controls.scaleDisplay.innerHTML = scale_text;
		},
	},
	
	
	// Navigation:
	get lastViewed () {
		return this.localData.readSetting('LastViewed');
	},
	
	set lastViewed (val) {
		this.localData.writeSetting('LastViewed', val);
	},
	
	
	// Save place:
	savePlaceChange () {
		if (settings.controls.savePlaceCheckbox.checked) {
			settings.savePlace = 'true';
			nav.recordId = true;
		}
		else {
			settings.savePlace = 'false';
			nav.recordId = false;
		}
	},
	
	get savePlace () {
		return this.localData.readSetting('SavePlace');
	},
	
	set savePlace (val) {
		this.localData.writeSetting('SavePlace', val);
	},
	
	
	// Pre-caching:
	precacheChange () {
		if (settings.controls.precacheCheckbox.checked) {
			settings.precacheStrips = 'true';
		}
		else {
			settings.precacheStrips = 'false';
		}
	},
	
	get precacheStrips () {
		return this.localData.readSetting('PrecacheStrips');
	},
	
	set precacheStrips (val) {
		this.localData.writeSetting('PrecacheStrips', val);
	},

	
	// Scaling:
	initScale: function () {
		if (settings.scale == null) {
			settings.controls.scaleSlider.value = settings.autoScale;
		}
		else {
			settings.controls.scaleSlider.value = settings.scale;
		}
		settings.controls.changeScaleSlider();
	},
	
	applyScaleClick: function () {
		settings.scale = parseInt(settings.controls.scaleSlider.value, 10);
		settings.applyScale();
	},
	
	applyScale: function () {
		let sc;
		if (settings.scale == null) {
			settings.controls.scaleSlider.value = settings.autoScale;
			settings.controls.changeScaleSlider();
			sc = settings.autoScale;
		}
		else {
			sc = settings.scale;
			settings.controls.changeScaleSlider();
		}
		let p_adjust = (100 - ((100 / sc) * 100)) / 2;
		sc /= 100;
		
		DOM['side_buttons'].style.transform = 'scale(' + sc + ') translate(' + p_adjust + '%, ' + p_adjust + '%)';
		DOM['main'].style.transform = 'scale(' + sc + ') translate(0%, ' + p_adjust + '%)';
		DOM['controls'].style.transform = 'scale(' + sc + ')';
	},
	
	resetScale: function () {
		settings.scale = null;
		settings.controls.scaleSlider.value = settings.autoScale;
		settings.controls.changeScaleSlider();
		settings.applyScale();
	},
	
	autoResize: function () {
		if (settings.scale != null) {
			return;
		}
		
		if (settings.resizeCallHandle != null) {
			clearTimeout(settings.resizeCallHandle);
		}
		settings.resizeCallHandle = setTimeout(settings.applyScale, 300);
	},
	
	get autoScale () {
		if (window.innerHeight < 1100) {
			return Math.max(50, Math.floor((window.innerHeight / 1200) * 100));
		}
		return 100;
	},
	
	get scale () {
		if (this.localData.readSetting('visualScale') == null) {
			return null;
		}
		return parseInt(this.localData.readSetting('visualScale'));
	},
	
	set scale (val) {
		if (val == null) {
			this.localData.clearSetting('visualScale');
		}
		else {
			this.localData.writeSetting('visualScale', val);
		}
	},
	
	
	// Clear settings:
	clearSettings: function () {
		settings.localData.clearAll();
		settings.fillCheckBoxes();
	},
	
	
	// Checkboxes:
	fillCheckBoxes: function () {
		settings.controls.savePlaceCheckbox.checked = settings.savePlace == 'false' ? false : true;
		settings.controls.precacheCheckbox.checked = settings.precacheStrips == 'false' ? false : true;
	},


	// Initialization:
	init: async function () {
		await comic.load();
		let prefix = comic.title + '_' + comic.id + '_Comic_';
		this.localData = new LocalData(prefix);
		
		// Settings dialog panel:
		settings.controls.panel = DOM['controls'];
		
		// Show button:
		settings.controls.showButton = DOM['settings_show_button'];
		settings.controls.showButton.addEventListener('click', settings.controls.switchVisibility);
		
		// Save place checkbox:
		settings.controls.savePlaceCheckbox = DOM['save_place_checkbox'];
		settings.controls.savePlaceCheckbox.addEventListener('click', settings.savePlaceChange);
		
		// Pre-cache checkbox:
		settings.controls.precacheCheckbox = DOM['precache_checkbox'];
		settings.controls.precacheCheckbox.addEventListener('click', settings.precacheChange);
		
		// Scale slider control:
		settings.controls.scaleSlider = DOM['scale_slider'];
		settings.controls.scaleDisplay = DOM['scale_display'];
		settings.controls.scaleSlider.addEventListener('input', settings.controls.changeScaleSlider);
		settings.initScale();
		
		// Scale apply button:
		settings.controls.scaleApplyButton = DOM['scale_apply'];
		settings.controls.scaleApplyButton.addEventListener('click', settings.applyScaleClick);
		
		// Scale reset button:
		settings.controls.scaleResetButton = DOM['scale_reset'];
		settings.controls.scaleResetButton.addEventListener('click', settings.resetScale);
		
		// Clear storage button:
		settings.controls.clearButton = DOM['clear_settings'];
		settings.controls.clearButton.addEventListener('click', settings.clearSettings);
		
		// Close button:
		settings.controls.closeButton = DOM['settings_close_button'];
		settings.controls.closeButton.addEventListener('click', () => {
			settings.controls.hide();
			settings.applyScale();
		});
		
		// Fill in checkboxes:
		settings.fillCheckBoxes();
		
		// Apply scaling:
		settings.applyScale();
		window.addEventListener('resize', settings.autoResize);
	},
};
