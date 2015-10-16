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
        controls.addClass("hide");
    }

    function showControls() {
        controls.removeClass("hide");
    }

})();

// ready code
$(function() {

    // CAROUSEL FACE SWITCH OBJECT
    var faceManager = (function() {

        // ELEMENTS ************************/

        // Face Elements
        var faces = $('.face'), // parent of face one and face two
            faceOne = $('.face-one'), // face one
            faceTwo = $('.face-two'), // face two
            faceIndex = 0,
            touchIndex = 0; // Resetting face switch button


        // SWITCHING ************************/

        function faceSwitch() {
            $('.carousel-face-switch').click(function() {

                // Handle class switching for opacity
                //$(faces[faceIndex]).find('.face-one').removeClass('fadein').addClass('fadeout');
                //$(faces[faceIndex]).find('.face-two').removeClass('fadeout').addClass('fadein');
                faceSwitchAnimate(
                    $(faces[faceIndex]).find('.face-one'),
                    $(faces[faceIndex]).find('.face-two')
                )


                // Handle event listener switching
                $('.carousel-control.right').removeClass('no-click');

                faceIndex++;
            });
        }

        function touchSwitch() {
            
            // Hooking onto Carousel 'slide' event
            $('#carousel').on('slide.bs.carousel', function(e) {

                if (touchIndex === 1 || touchIndex === 2 || touchIndex === 4) {
                    $('.carousel-control.right').addClass('no-click');
                } else if (touchIndex === 6) {
                    reset();
                    touchIndex = -1;
                }

                touchIndex++;
            });
        }


        // ANIMATIONS ************************/

        function ticker() {
         //   var ticker1 = ['ABL1',  'AKT1',  'AKT3',  'ALK',  'AR',  'AXL',  'BRAF',  'CCND1',  'CDK4',  'CDK6',  'CTNNB1',  'DDR2', 'EGFR',  'ERBB2', 'ERBB3',  'ERBB4',  'ERG',  'ESR1',  'ETV1',  'ETV4',  'ETV5',  'FGFR1',  'FGFR2',  'FGFR3',  'FGFR4',  'GNA11', 'GNAQ',  'HRAS'],
         //       ticker2 = ['GNAQ',  'HRAS',  'IDH1',  'IDH2',  'JAK1',  'JAK2',  'JAK3',  'KIT',  'KRAS',  'MAP2K1',  'MAP2K2',  'MET', 'MTOR',  'MYC',  'MYCN',  'NRAS',  'NTRK1',  'NTRK2',  'NTRK3',  'PDGFRA',  'PIK3CA',  'PPARG', 'RAF1',  'RET',  'ROS1',  'SMO'];

            $('.marquee').marquee({
                duration:10000,
                gap:0,
                delayBeforeStart:0,
                direction:'left',
                duplicated:true
            })
        }   

        function faceSwitchAnimate(face1, face2) {
            var tl = new TimelineMax();

            tl.to(face1, 2, {
                y: 960,
                ease: Power1.easeIn, 
                // Elastic.easeIn.config(2, 0.75)
            })
            .to(face2, 1, {
                css:{
                    opacity:1,
                    scale: 1
                }, 
                ease:Power1.easeOut
            });
        }


        // UTILITY ************************/

        function reset() {

            // Handle class switching for opacity
            $('.face-one').addClass('fadein').removeClass('fadeout');
            $('.face-two').addClass('fadeout').removeClass('fadein');

            // Handle event listener switching
            $('.carousel-control.right').addClass('no-click');

            faceIndex = 0;
        }

        function goToSlideOne() {
            $('#carousel').carousel(0);
        }

        function init() {
            faceSwitch();
            touchSwitch();
            ticker();
        }


        // RETURN FUNCTIONS IN CLOSURE ************************/

        return {
            init: init,
            reset: reset,
            goToSlideOne: goToSlideOne
        }
    })();


    // INITIATE ************************/

    faceManager.init();

    


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
