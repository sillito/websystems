var http = require('http'),
    util = require('util')

var server = http.createServer()

server.on('request', function(request, response) {
    util.log(request.method + ' ' + request.url)
    
    response.writeHead(200, {
        'Content-Type':'text/html',
        'Connection':'close'
    })
    
    response.write('<!DOCTYPE html>\n')
    response.write('<html><body>')
    response.write('<h1>Hello from the server</h1>')
    response.write('</body></html>')
    
    response.end()
})

server.listen(8123)