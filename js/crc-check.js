/*
  Vireo checker function.

  The original version of this was based on crc-reload by "kiwidev":
  http://kiwidev.wordpress.com/2011/07/14/auto-reload-page-if-html-changed/
  https://bitbucket.org/diffused/html-crc-reload

  I rewrote nearly everything and renamed and repurposed it for Vireo, but
  the original idea and approach of using ajax + CRC was due to kiwidev's
  work.  I would not have been able to figure out some things without
  starting from that work.  

  I could not find any license or distribution statement in the original.
  This (new) work is released under the LGPL v.2 license.

*/


/* Whether polling is enabled at all. */
var checkEnabled = true;

/* The numbers are too big to be represented in javascript int, so
 * the gross hack employed here is to turn them to strings and do
 * string comparisons instead of numerical comparisons.
 */
var prevCheckValue = '';

function check(path, md5file, callback) {
    if (checkEnabled) {
        if (md5file) {
            $.ajax({
                type: 'GET',
                cache: false,
                url: md5file,
                success: function(data) {
                    if (prevCheckValue == '') {
                        prevCheckValue = data;
                        return;
                    }
                    if (data != prevCheckValue) {
                        prevCheckValue = data;
                        if (callback) {
                            callback();
                            checkEnabled = false; // Stop until reenabled.
                        }
                    }
                }
            });
        } else {
            /* Fallback approach: get the whole file and compute a CRC 
               ourselves. This is bandwidth-heavy and thus undesirable, so
               it's better if the user provides an md5 file. */
            $.ajax({
                type: 'GET',
                cache: false,
                url: path,
                success: function(data) {
                    var newcrc = crc32(data).toString();
                    if (prevCheckValue == '') {
                        prevCheckValue = newcrc;
                        return;
                    }
                    if (newcrc != prevCheckValue) {
                        prevCheckValue = newcrc;
                        if (callback) {
                            callback();
                            checkEnabled = false; // Stop until reenabled.
                        }
                    }
                }
            });
        }
    }
}

function startCheck(path, frequency, callback) {
    checkEnabled = true;
    md5file = md5filename(path);
    check(path, md5file, null);         // Store the 1st check value.
    setInterval(function() { check(path, md5file, callback); }, 1000 * frequency);
}

function enableCheck(yesno) {
    if (checkEnabled == yesno)
        return;
    checkEnabled = yesno;
    if (checkEnabled) {
        prevCheckValue = '';
    }
}

function md5filename(path) {
    /* Normally we expect a file name like foo.pdf, but this approach
       will work even if there is no dot in the name. */
    var base = path.substr(0, path.lastIndexOf('.')) || path;
    return base + '.md5';
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
}
