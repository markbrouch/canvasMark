(function($) {
	$.fn.canvasMark = function(options) {
		var _this, config, canvas, spriteSheet, sprite, frames;
		var animator = {
			frame   : 0,
			fps     : 60,
			ticks   : 0,
			playing : false
		};

		var generateFrames = function() {
			if(/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {	// Handle iOS subsampling
				if(spriteSheet.width * spriteSheet.height >= 1024 * 1024) {	// image > 1MP
					sprite.width /= 2;
					sprite.height /= 2;
					spriteSheet.width /= 2;
					spriteSheet.height /= 2;
				}
			}

			var frames = [],
				gridX = spriteSheet.width / sprite.width,
				gridY = spriteSheet.height / sprite.height;

			for(var y = 0; y < gridY; y++) {
				for(var x = 0; x < gridX; x++) {
					frames.push({
						y: y * sprite.height,
						x: x * sprite.width
					});
				}
			}

			return frames;
		};

		var animate = function() {
			window.requestAnimationFrame(animate);

			canvas.width = _this.width();
			canvas.height = canvas.width / (sprite.width / sprite.height);

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

		this.init = function(options) {
			_this = this;
			canvas = this[0];
			sprite = options.sprite;

			animator.fps = options.fps || animator.fps;

			spriteSheet = new Image();
			spriteSheet.src = options.spriteSheet;
			$(spriteSheet).load(function() {
				frames = generateFrames();
				animate();
			});

			_this.on({
				play  : play,
				pause : pause,
				next  : next,
				prev  : prev,
				move  : move
			});
		};
		
		this.init(options);
		return this;
	};
}(jQuery));