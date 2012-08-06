/*
jQuery Plugin for Touch events.

Returns X and Y coordinates for touch events 
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

*/				
				
(function ($) {
    $.fn.touchit = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on touchit');
        }
    };

    var methods = {
        init: function (options) {
            var $this = $(this);

            $this.data('touchit', $.extend({
				onTouchStart: function (x, y) { },
				onTouchMove: function (x, y) { },
				onTouchEnd: function (x, y) { },
				onPinch: function (scale) { },
            }, options));

            return this.each(function () {

                setupMobileEvents();

                function setupMobileEvents() {

					var el = $this[0];
					
                    //test if Gestures are supported:
                    var gestureIsSupported = ('ongesturestart' in el);

                    //So I guess we can support gestures
                    if (gestureIsSupported) {
                        el.addEventListener("gesturechange", gestureChange, false);
                        el.addEventListener("gestureend", gestureEnd, false);
                    }

                    var touchIsSupported = ('ontouchstart' in el);

                    //So I guess we can support touch
                    if (touchIsSupported) {
                        el.addEventListener("touchstart", touchHandler, false);
                        el.addEventListener("touchmove", touchHandler, true);
                        el.addEventListener("touchend", touchHandler, true);
                        el.addEventListener("touchcancel", touchHandler, true);
                    }
                }

                var gestureChanged = false;

                function gestureChange(event) {
					gestureChanged = true;

					$this.data('touchit').onPinch.call(this, event.scale);
                    event.preventDefault();
                }
				
                function gestureEnd(event) {
                    gestureChanged = false;
                    event.preventDefault();
                }
				
                function touchHandler(event) {
                    if (gestureChanged == true) { return; } //  don't interfere with the gesture
                    var touches = event.changedTouches,
                        first = touches[0],
                        type = "";

                    switch (event.type) {
                        case "touchstart": type = "mousedown"; 
							$this.data('touchit').onTouchStart.call(this, first.screenX, first.screenY);
							break;
                        case "touchmove": type = "mousemove"; 
							$this.data('touchit').onTouchMove.call(this, first.screenX, first.screenY);
							break;
                        case "touchend": type = "mouseup"; 
							$this.data('touchit').onTouchEnd.call(this, first.screenX, first.screenY);
							break;
                        default: return;
                    }

                    var simulatedEvent = document.createEvent("MouseEvent");
                    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                              first.screenX, first.screenY,
                                              first.clientX, first.clientY, false,
                                              false, false, false, 0, null);

                    first.target.dispatchEvent(simulatedEvent);
					
                    event.preventDefault();
                }
            }); //return this.each(function()
        },       //init: function (options)
        destroy: function () {

            return this.each(function () {

                var $this = $(this),
                data = $this.data('touchit');

                if (data) {
                    $this.removeData('touchit');
                }
            });
        }
    };          //var methods =
})(jQuery);                                         // (function ($)
