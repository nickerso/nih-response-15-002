

/*
no:
                $('#pdf').html($('#pdf').html());

no:
                $('#pdfdiv').css('display', 'none');
                obj.remove();
                $('#pdfdiv').html('<object id="pdf" data="' + url + '" type="application/pdf" width="100%" height="100%">');
                $('#pdfdiv').css('display', '');

no:
                $('#pdf').remove();
                $('#pdfdiv').html('<object id="pdf" data="' + url + '" type="application/pdf" width="100%" height="100%">');


no:
                obj.setAttribute('data', url);

no:
                $('#pdfdiv').html('<object id="pdf" data="' + url + '" type="application/pdf" width="100%" height="100%">');


no:
                var div = document.getElementById('pdfdiv');
                var newobj = obj.cloneNode(true);
                newobj.data = 'content.pdf';

                div.style.display = 'none';
                div.removeChild(obj);
                div.appendChild(newobj);
                div.style.display = '';
*/

