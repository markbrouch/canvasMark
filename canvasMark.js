(function($) {
	$.fn.canvasMark = function(options) {
		var _this, config, canvas, spriteSheet, sprite, frames;
		var animator = {
			frame   : 0,
			fps     : 60,
			ticks   : 0,
			playing : false
		};

		var generateFrames = function(frameCount) {
			frameCount = frameCount || -1;

			if(/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {	// Handle iOS subsampling
				if(spriteSheet.width * spriteSheet.height >= 2 * 1024 * 1024) {	// image > 2MP
					var sampleFactor = 2;
					if(spriteSheet.width * spriteSheet.height >= 20 * 1024 * 1024) {	// image > 20MP
						sampleFactor = 4;
					}
					sprite.width /= sampleFactor;
					sprite.height /= sampleFactor;
					spriteSheet.width /= sampleFactor;
					spriteSheet.height /= sampleFactor;
				}
			}

			var frames = [],
				gridX = spriteSheet.width / sprite.width,
				gridY = spriteSheet.height / sprite.height;

			for(var y = 0; y < gridY; y++) {
				for(var x = 0; x < gridX; x++) {
					if(frames.length < frameCount || frameCount < 0) {
						frames.push({
							y: y * sprite.height,
							x: x * sprite.width
						});
					}
				}
			}

			return frames;
		};

		var animate = function() {
			window.requestAnimationFrame(animate);

			canvas.width = _this.width();
			canvas.height = sprite.height * (canvas.width / sprite.width);

			if(animator.playing) {
				animator.ticks++;
				if(animator.ticks >= 60 / animator.fps) {
					animator.ticks = 0;
					next();
				}
			}

			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(
				spriteSheet,
				frames[animator.frame].x,
				frames[animator.frame].y,
				sprite.width,
				sprite.height,
				0,
				0,
				canvas.width,
				canvas.height
			);
		};

		var play = function() {
			animator.playing = true;
		};

		var pause = function() {
			animator.playing = false;
		};

		var next = function(e, data) {
			if(arguments.length === 1) {
				data = {
					frames: e.frames
				};
			} else {
				data = data || {};
			}
			move(data.frames || 1);
		};

		var prev = function(e, data) {
			if(arguments.length === 1) {
				data = {
					frames: e.frames
				};
			} else {
				data = data || {};
			}
			move(data.frames || -1);
		};

		var move = function(e, data) {
			var moveFrames = 0;
			if(arguments.length === 1) {
				moveFrames = e;
			} else {
				moveFrames = data.frames;
			}
			for(var i = 0, len = Math.abs(moveFrames); i < len; i++) {
				animator.frame += moveFrames / Math.abs(moveFrames);
				if(animator.frame <= 0) {
					animator.frame = frames.length - 1;
				} else if(animator.frame >= frames.length) {
					animator.frame = 0;
				}
			}
		};

		var moveTo = function(e, data) {
			var frame = 0;
			if(arguments.length === 1) {
				frame = e;
			} else {
				frame = data.frame;
			}
			animator.frame = frame;
		};

		this.init = function(options) {
			_this = this;
			canvas = this[0];
			sprite = options.sprite;

			animator.fps = options.fps || animator.fps;

			spriteSheet = new Image();
			spriteSheet.src = options.spriteSheet;
			$(spriteSheet).load(function() {
				frames = generateFrames(options.frames);
				animate();
			});

			_this.on({
				play   : play,
				pause  : pause,
				next   : next,
				prev   : prev,
				move   : move,
				moveTo : moveTo
			});
		};
		
		this.init(options);
		return this;
	};
}(jQuery));