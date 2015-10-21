

// CAROUSEL ****************************************************/

var Carousel = (function() {

    var carousel = $("#carousel");

    function resize() {
        carousel.css("height", $(window).height());
    }

    return {
        resize: resize
    };
});

// WINDOW ****************************************************/

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


// CONTROLS ****************************************************/

var Controls = (function() {

    var controls = $("#controls");

    // subscribe
    events.on("fullscreen", hideControls);
    events.on("maximized", showControls);

    function hideControls() {
        controls.addClass("hide");
    }

    function showControls() {
        controls.removeClass("hide");
    }

})();


// EVENTS MANAGER ****************************************************/

var eventsMgr = (function() {

    var touchIndex = 0, // Resetting face switch button
        backBtnClicked = false,
        backBtn = $('.carousel-control.left'),
        forwardBtn = $('.carousel-control.right'),
        faces = $('.face'),
        faceOne = $('.face-one'),
        faceTwo = $('.face-two'),
        marquee = $('.marquee');
    

    /* METHODS */

    // Switching Face and Slide buttons
    function slideEvents() {
        
        // Hooking onto Carousel 'slide' event
        $('#carousel').on('slide.bs.carousel', function(e) {
            
             // Conditional index increment
            if (!backBtnClicked) {
                touchIndex++;
            } else {
                events.emit('backBtnClicked', true);
                touchIndex--;
            }
            
            // These conditionals set slides to their initial state
            // Slide 0, Face 0
            if (touchIndex === 0) {

                // See method below -- this is default face resetting
                // The argument is index of face to reset
                faceReset(0)

                // Slide particular resetting
                marquee.removeClass('fadeout');
                backBtn.addClass('fadeout no-click');
                
                if (backBtnClicked) {
                    // Pass the index of the face to reset!
                    events.emit('backBtnClicked', 0);
                }
            }

            // Slide 1
            if (touchIndex === 1) {
                backBtn.removeClass('fadeout no-click');

                events.emit('blueSlide', true);
            }

            // Slide 2, Face 1
            if (touchIndex === 2) {
                faceReset(1);

                events.emit('whiteSlide', true);

                if (backBtnClicked) {
                    events.emit('backBtnClicked', 1);
                }
            }

            // Slide 3, Face 2
            if (touchIndex === 3) {
                faceReset(2);

                if (backBtnClicked) {
                    events.emit('backBtnClicked', 2);
                }
            }

            // Slide 4
            if (touchIndex === 4) {
                events.emit('blueSlide', true);
            }

            // Slide 5, Face 3
            if (touchIndex === 5) {
                faceReset(3);

                events.emit('whiteSlide', true);

                if (backBtnClicked) {
                    events.emit('backBtnClicked', 3);
                }
            }

            // Slide 6
            if (touchIndex === 6) {
                backBtn.addClass('fadeout');
            }

            // Reset slides
            if (touchIndex === 7) {
                carouselReset();
                touchIndex = 0;
            }
        });
    }

    // Face Switching Event Emitter
    function faceSwitch() {
        $('.carousel-face-switch').on('click', function() {
            events.emit('faceSwitch', touchIndex);
        });
    }

    // Carousel Control Button Tracker
    function carouselControl() {
        forwardBtn.on('click', function() {
            backBtnClicked = false;
        });

        backBtn.on('click', function() {
            backBtnClicked = true;
        });
    }

    
    // Utility 
    function faceReset(index) {
        $(faceOne[index]).removeClass('bounceOut');
        $(faceTwo[index]).removeClass('zoomIn');
        forwardBtn.addClass('no-click');
    }

    function carouselReset() {

        faceOne.removeClass('bounceOut');
        faceTwo.removeClass('zoomIn');

        marquee.removeClass('fadeout');

        forwardBtn.addClass('no-click');
        backBtn.addClass('fadeout no-click');

        // Emitter
        events.emit('faceSwitchReset', true);
    }

    function init() {
        slideEvents();
        faceSwitch();
        carouselControl();
    }

    // Return
    return {
        init: init,
        reset: carouselReset
    };
})();



// ANIMATION MANAGER ****************************************************/

var animMgr = (function() {
            
    // Elements & Indices
    var faces = $('.face'), // parent of face one and face two
        faceOne = $('.face-one'), // face one
        faceTwo = $('.face-two'), // face two
        faceIndex = 0,
        backBtn = $('.carousel-control.left'),
        marquee = $('.marquee');

    // EVENTS:
        // slide.bs.carousel
        // slid.bs.carousel
        // faceSwitch
        // faceSwitchReset
        // blueSlide
        // whiteSlide

    // Face Switch Animation handler
    function faceSwitch() {

        events.on('backBtnClicked', function(index) {
            faceIndex = index;
        });

        events.on('faceSwitch', function() {

            // Main face animations based on index (faceIndex)
            $(faceOne[faceIndex]).addClass('bounceOut');

            setTimeout(function() {
                $(faceTwo[faceIndex]).addClass('zoomIn');  
                faceIndex++;  
            }, 700);
            
            // Cleaning up
            if (faceIndex === 0) {
                marquee.addClass('fadeout');
            }

            $('.carousel-control.right').removeClass('no-click');

            
        });
    }

    // Slide color handler
    function slideColor() {
        events.on('blueSlide', function() {
            backBtn.removeClass('blue-text blue-arrow');
        });
        events.on('whiteSlide', function() {
            backBtn.addClass('blue-text blue-arrow');
        });
    }

    // Ticker initiate
    function ticker() {
        $('.marquee').marquee({
            duration:10000,
            gap:0,
            delayBeforeStart:0,
            direction:'left',
            duplicated:true
        });
    }   

    function reset() {
        events.on('faceSwitchReset', function() {
            faceIndex = 0;
            console.log('faceSwitchReset')
        });
    }

    function init() {
        faceSwitch();
        slideColor();
        ticker();
        reset();
    }

    return {
        init: init
    };
            
})();


/* TEST OBJECT */

var test = {
    faces: $('.face'),
    faceOne: $('.face-one'),
    faceTwo: $('.face-two'),
    backBtn: $('.carousel-control.left'),
    
    // Testing animations on the fly
    anim: function test(el, animation, timing) {
        if (arguments.length === 3) {
            el
                .css('animation-timing-function', timing + ' !important')
                .toggleClass(animation);
        } else if (arguments.length === 2) {
            el.toggleClass(animation);
        } else {
            console.log('This method requires at least 2 arguments: an element to target, and a class to toggle.');
        }
    }
};

// ready code
$(function() {

    
    // INITIATE ************************/

    var em = new eventsMgr.init();
    var am = new animMgr.init();

    // KEYBOARD
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
