canvasMark
==========

jQuery plugin for animating a spritesheet on a canvas element

Takes a sprite sheet with frames of equal size positioned left-to-right top-to-bottom order and renders it to a Canvas element.

Usage
=====
Call canvasMark on a canvas tag with additional properties:

    <canvas id="myCanvas"></canvas>
    
    <script>
        $('#myCanvas').canvasMark({
          spriteSheet: '/path/to/spritesheet.jpg',
          sprite: {
            width: 960,
            height: 540
          },
          fps: 30
        });
    </script>

* <b>spriteSheet</b> - The path to the spritesheet resource.
* <b>sprite</b> - Object containing properties width and height of a single sprite on the spritesheet resource.
* <b>fps</b> - Frames per second to playback animation. If unspecified, defaults to 60.

Canvas animation can be controlled via triggers on the canvas element:

    <script>
        $('canvas').trigger('play'); // Pauses playback
    </script>

The following triggers are available:
* play
* pause
* next
* prev
* move, {frames: i}
