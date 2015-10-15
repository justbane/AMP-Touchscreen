// Functions
var Carousel = (function() {

    var carousel = $("#carousel");

    function resize() {
        carousel.css("height", $(window).height());
    }

    return {
        resize: resize
    };
});

var Window = (function() {

    var main = chrome.app.window.get('main');

    function init() {
        isFullScreened();
        isMaximized();
    }

    function isFullScreened() {
        main.onFullscreened.addListener(function() {
            events.emit("fullscreen", true);
        });
    }

    function isMaximized() {
        main.onMaximized.addListener(function() {
            if(!main.isFullscreen()) {
                events.emit("maximized", true);
            }
        });
    }

    function goFullScreen() {
        main.fullscreen();
    }

    return {
        init: init,
        goFullScreen: goFullScreen
    };
});

var Controls = (function() {

    var controls = $("#controls");

    // subscribe
    events.on("fullscreen", hideControls);
    events.on("maximized", showControls);

    function hideControls() {
        controls.addClass("hidden");
    }

    function showControls() {
        controls.removeClass("hidden");
    }

})();

// ready code
$(function() {
    $('.keyboard').keyboard({
        usePreview: false,
        autoAccept: true,
        lockInput: true, // prevent manual keyboard entry
		layout: 'custom',
		customLayout: {
			'normal': [
				'1 2 3 4 5 6 7 8 9 0 - = @ {bksp}',
				'q w e r t y u i o p [ ] \\',
				'a s d f g h j k l ; \' {accept}',
				'{shift} z x c v b n m , . / {shift}',
				'{left} {space} {right} {cancel}'
			],
			'shift': [
				'~ ! @ # $ % ^ & * ( ) _ + {bksp}',
				'Q W E R T Y U I O P { } |',
				'A S D F G H J K L : " {accept}',
				'{shift} Z X C V B N M < > ? {shift}',
				'{left} {space} {right} {cancel}'
			]
		}
    }).addTyping({
        showTyping: true,
        delay: 250
    });

    // fullscreen
    var win = new Window();
    win.init();
    $("#go-fullscreen").on("click", function() {
        win.goFullScreen();
    });
});
