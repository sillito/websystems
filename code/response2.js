var http = require('http'),
    util = require('util'),
    url = require('url')

var server = http.createServer()

server.on('request', function(request, response) {
    
    var method = request.method,
        path = url.parse(request.url).pathname // parse url to get path

    if (method == 'GET' && path == '/tasks') {
        // retrieve list of all tasks for authenticated users
        console.log('retrieve list of all tasks for authenticated users')
        respond(response)

    } else if (method == 'POST' && path == '/tasks') {
        // create a new task
        
        request.on('data', function(data) {
            // get task description from request body, when available
        })
        
        respond(response)
        
    } else {
        // unknown path, serving 404 response
        console.log('unknown path, serving 404 response')
        response.writeHead(404, {
            'Content-Type':'text/html',
            'Connection':'close'
        })
        
        response.write('<html><body>')
        response.write('<h1>URL not found</h1>')
        response.write('<p>The requested URL ' + path + ' was not found</p>')
        response.write('</body></html>')
        
        response.end()
    }
})

function respond(response) {    
    response.writeHead(200, {
        'Content-Type':'text/html',
        'Connection':'close'
    })
    
    response.write('<html><body>')
    response.write('<h1>Hello from the server</h1>')
    response.write('</body></html>')
    
    response.end()
}

server.listen(8123)
