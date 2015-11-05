/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {

  chrome.app.window.create('index.html', {
    id: 'main',
    bounds: { width: 1920, height: 1080}
  }, function(main) {
      main.contentWindow.onload = function() {
          main.contentWindow.Carousel().resize();
      };
      // on maximize/minimize
      main.onRestored.addListener(function() {
          main.contentWindow.Carousel().resize();
      });
      // when resizing the window
      main.onBoundsChanged.addListener(function() {
          main.contentWindow.Carousel().resize();
      });
  });

});
