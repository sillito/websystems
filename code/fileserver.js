var http = require('http'),
    util = require('util'),
    path = require('path'),
    fs = require('fs')

var server = http.createServer()

server.on('request', function(request, response) {
    util.log(request.method + ' ' + request.url)
    serve_static(request.url, response)
})

function serve_static(filename, response) {
    // todo: guard against '..' in path
    
    filename = path.join('public', filename)
    
    path.exists(filename, function(exists) {
        if (exists) {
            response.writeHead(200, {'Content-Type':'image/jpg'})            
            
            // util.pump(fs.createReadStream(filename), response)
            var rs = fs.createReadStream(filename)
            rs.on('data', function(chunk) {
                console.log('\tread chunk')
                response.write(chunk)
            })
            
            rs.on('end', function() {
                response.end()
            })
            
        } else {
            _404(response, filename)
        }
    })
}

server.listen(8123)