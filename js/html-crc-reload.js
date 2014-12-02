/*
  ORIGINALLY:

  crc-reload is a script to auto reload the current page when you save the html.
  Requires jquery.
  Usage: 
  Simply include this js file in your html page.
  It will ajax GET poll the current page every second and if the html is different, reload itself.
  Version 0.1 - Initial release
  Thanks to Andrea Ercolino for providing the javascript crc32 functionality
  http://noteslog.com/post/crc32-for-javascript/

  MODIFIED BY: mhucka@caltech.edu in June 2014.
  - Changed to use a different, hopefully faster crc32 function.
  - Reformatted the code.
  - Commented out some code that looks questionable.
  - Changed the polling interval.

  2014-11-29 <mhucka@caltech.edu>
  - Use strings to represent the crc because the numbers are too big
  - Hack around refresh issues in Chrome

*/

/* Polling period, in seconds. */
var cacheRefreshPeriod = 5;

$(function() {
    check(true);
    setInterval(check, 1000 * cacheRefreshPeriod);
});

/* The numbers are too big to be represented in javascript int, so
 * the gross hack employed here is to turn them to strings and do 
 * string comparisons.
 */
var previousCrc = '';

function check() {
    $.ajax({
        type: 'GET',
        cache: false,
        url: 'content.pdf',
        success: function(data) {
            var newcrc = crc32(data).toString();
            if (previousCrc == '') {
                previousCrc = newcrc;
                return;
            }
            if (newcrc != previousCrc) {
                previousCrc = newcrc;

                // Without the following, Chrome doesn't reload the content.
                // I don't know why the extra URL hacking is needed to force
                // Chrome to reload the content; the cache=false parameter on
                // the jQuery ajax call supposedly does basically the same
                // thing.  But in my copy of Chrome on the Mac, the jQuery
                // parameter alone doesn't make it work.  This does.
                // var obj = document.getElementById('pdf');
                // var date = new Date();
                // var url = 'content.pdf?' + date.getMilliseconds().toString();
                // obj.data = url;

                // var obj = document.getElementById('pdf');
                // obj.innerHtml = '<embed src="content.pdf" width="100%">';

                // The following alone is enough for Firefox.
                window.location.reload(true);
            }
        }
    });
}

/* Improved crc32 function from http://stackoverflow.com/a/18639999 */

var makeCRCTable = function() {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++){
        c = n;
        for (var k = 0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

var crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};
