var http = require('http')

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'content-type':'text/plain'})
    response.write('Hello World')
    response.end()
})

server.listen(8123)