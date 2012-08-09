# TouchIt

TouchIt jQuery Plugin for converting touch to mouse events and call backs for touch X and Y coordinates and pinch Scale values.

## jQuery Plugin for Touch events.

Blog article: http://danielglyde.blogspot.co.uk/2012/08/touchit-jquery-plugin-for-touch-events.html

Returns X and Y coordinates for touch events and double tap.
Returns scale for Pinch events (1 = original position, > 1 = fingers move apart, < 1 fingers move together).

Converts touch events in to mouse events - for using mouse input controls like jQuery UI slider on mobile devices.

You may use TouchIt under the terms of either the MIT License or the GNU General Public License (GPL) Version 2

X, Y, Scale Callback Example
----------------------------
	$( "#touch" ).touchit({
		onTouchStart: function (x, y) {
			$("#touched").text('Touch Start ' + x + ':' + y);
		},
		onTouchMove: function (x, y) {
			$("#touched").text("Touch Move " + x + ':' + y);
		},
		onTouchEnd: function (x, y) {
			$("#touched").text("Touch End " + x + ':' + y);
		},
		onDoubleTap: function (x, y) {
			$("#touched").text("Double Tap " + x + ':' + y);
		},
		onPinch: function (scale) {
			$("#touched").text("Pinch " + scale);
		}
	});

jQuery UI Slider Example
------------------------
Just add .touchit() to the jQuery UI Slider:

$( "#zoomSlider" ).slider({
	orientation: "vertical",
	min: 0,
	max: 100
}).touchit();