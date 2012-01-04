var http = require('http')

var server = http.createServer(function(request, response) {
    response.writeHead(200, {'content-type':'text/plan'})
    response.write('Hello World')
    response.end()
})

server.listen(8123)

// when learning a new programming language or environment
// it is traditional first write a hello world program so
// we are going to step through a hello world node program

// Node has been designed to make it easy to develop server
// applications, so our hello world program will be a very 
// simple http server

// Node has a builtin module HTTP called that we are going
// to use, so we'll start by requiring that module.

// the HTTP module has a create Server function that creates
// an HTTP server. It takes one argument a function -- this
// function will be called each time a client connects to
// our server

// to start the server listening on a particular port, we
// call the listen function. Normally HTTP servers listen
// on port 80, but on many machines port 80 is restricted,
// so we'll listen on port 8123

// the last thing we need to do is implement our function
// that will be called for each 

// request -- object representing the request from the 
// client
// response -- object representing the response our server
// is going to send back to the client

// so all we are going to do is write out a simple response
// responses have