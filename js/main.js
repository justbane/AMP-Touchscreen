

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
    //      This function will either add or remove the no-click class,
    //      giving the element 'pointer-events:none;' based on an index
    //      (touchIndex) which increments at the end of each 
    //      'slide' event dependent on which carousel control button
    //      was clicked.
    function slideEvents() {
        console.group('Slide Tracking');
        // Hooking onto Carousel 'slide' event
        $('#carousel').on('slide.bs.carousel', function(e) {
            
            // Conditional index increment
            if (!backBtnClicked) {
                touchIndex++;
            } else {
                events.emit('backBtnClicked', true);
                touchIndex--;
            }
            
            console.log('touchIndex: ' + touchIndex);
            // These conditionals set slides to their initial state
            // Slide 0
            if (touchIndex === 0) {
                console.log('Slide 0 ' + touchIndex);
                $(faceOne[touchIndex]).removeClass('bounceOut');
                $(faceTwo[touchIndex]).removeClass('zoomIn');
                marquee.removeClass('fadeout');
                forwardBtn.addClass('no-click');
            }

            // Slide 1
            if (touchIndex === 1) {
                console.log('Slide 1 ' + touchIndex);
                backBtn.removeClass('fadeout no-click');

                events.emit('blueSlide', true);
            }

            // Slide 2
            if (touchIndex === 2) {
                console.log('Slide 2 ' + touchIndex);
                console.log(faceOne[touchIndex])
                $(faceOne[touchIndex]).removeClass('bounceOut');
                $(faceTwo[touchIndex]).removeClass('zoomIn');
                forwardBtn.addClass('no-click');

                events.emit('whiteSlide', true);
            }

            // Slide 3
            if (touchIndex === 3) {
                console.log('Slide 3 ' + touchIndex);
                $(faceOne[touchIndex]).removeClass('bounceOut');
                $(faceTwo[touchIndex]).removeClass('zoomIn');
                forwardBtn.addClass('no-click');
            }

            // Slide 4
            if (touchIndex === 4) {
                console.log('Slide 4 ' + touchIndex);
                events.emit('blueSlide', true);
            }

            // Slide 5
            if (touchIndex === 5) {
                console.log('Slide 5 ' + touchIndex);
                $(faceOne[touchIndex]).removeClass('bounceOut');
                $(faceTwo[touchIndex]).removeClass('zoomIn');
                forwardBtn.addClass('no-click');

                events.emit('whiteSlide', true);
            }

            // Slide 6
            if (touchIndex === 6) {
                console.log('Slide 6 ' + touchIndex);
                backBtn.addClass('fadeout');
            }

            // Reset slides
            if (touchIndex === 7) {
                console.log('Slide Reset');
                console.groupEnd();
                reset();
                touchIndex = 0;
            }


            // Next slide button
        //     if (touchIndex === 1 || 
        //         touchIndex === 2 || 
        //         touchIndex === 4) {
        //         $('.carousel-control.right').addClass('no-click');
        //     } else if (touchIndex === 6) {
        //         reset();
        //         touchIndex = -1;
        //     }

        //     // color slide indicator
        //     if (touchIndex === 0 || 
        //         touchIndex === 3) {
        //         // blue slide
        //         events.emit('blueSlide', true);
        //     } else {
        //         // white slide event
        //         events.emit('whiteSlide', true);
        //     }

        //     // Back slide button
        //     if (touchIndex == 5) {
        //         backBtn.addClass('fadeout no-click');
        //     }
        // });

        // // Hooking onto Carousel 'slid' event
        // $('#carousel').on('slid.bs.carousel', function(e) {

        //     // Back slide button
        //     if (touchIndex === 0) {
        //         backBtn.removeClass('fadeout no-click');
        //     }
        });
    }

    // Face Switching Event Emitter
    function faceSwitch() {
        $('.carousel-face-switch').on('click', function() {
            events.emit('faceSwitch', true);
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
    function reset() {

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
        reset: reset
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

        events.on('backBtnClicked', function() {
            faceIndex--;
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
        });
    }

    function init() {
        faceSwitch();
        slideColor();
        ticker();
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
