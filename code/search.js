var http = require('http'),
    querystring = require('querystring')

// get terms from command line
var terms = process.argv.slice(2)

// here we're using the encodeURIComponent to escape characters that are
// not allowed in URLs, but see also node's querystring module
var escaped_terms = terms.map(encodeURIComponent)
var query = escaped_terms.join('+')

var options = {
    host: 'www.google.ca',
    port: 80,
    path: '/webhp?' + query,
    method: 'GET'
}

// setup the request
console.log('sending request: ' + options.host + options.path)
var request = http.request(options)

// listen for a response
request.on('response', function(response) {
    console.log('received response ' + response.statusCode)
    
    // just ignoring the request data here ...
})

// complete the request
request.end()
