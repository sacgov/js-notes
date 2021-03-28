var http = require('http');

http.createServer(function (request, response) {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.setHeader('Transfer-Encoding', 'chunked');

    var html =
        '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head>' +
                '<meta charset="utf-8">' +
                '<title>Chunked transfer encoding test</title>' +
            '</head>' +
            '<body>';

    response.write(html);

    html = '<h1>Chunked transfer encoding test</h1>'

    response.write(html);

    // Now imitate a long request which lasts 5 seconds.
    setTimeout(function(){
        html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'

        response.write(html);

        // since this is the last chunk, close the stream.
        html =
            '</body>' +
                '</html';

        response.end(html);

    }, 50000);

    // this is another chunk of data sent to a client after 2 seconds before the
    // 5-second chunk is sent.
    var i = 2;
    var timer = setInterval(function(){
        html = '<h5>This is a chunked response after ' + i+ ' seconds. Should be displayed before 40-second chunk arrives.</h5>'
        i = i+2;
        response.write(html);

    }, 2000);
    setTimeout(function(){
        clearInterval(timer);
    }, 40000);

    

}).listen(process.env.PORT, null)
