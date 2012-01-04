var http = require('http')

var options = {port:80} // options for requests
var times = []          // amount of time for each request in milliseconds

//
// get command line arguments and report usage error, if necessary
//

function usage_error() {
    console.log('USAGE: node bench.js host path N')
    process.exit(1)
}

if (process.argv.length != 5)
    usage_error() 

options.host = process.argv[2]
options.path = process.argv[3]
var count = parseInt(process.argv[4])

if (isNaN(count))
    usage_error()

//
// (when all of the responses are complete the process will exit)
// print benchmark stastics on exit
//

process.on('exit', function() {
    console.log('successful requests: ' + times.length)
    var total = times.reduce(function(a,b) {return a+b}, 0)
    console.log('total time:          ' + total + 'ms')
    console.log('mean time/request:   ' + (total/times.length) + 'ms')
})

//
// send requests and record how long until the 'end' of each response
//

function request(options) {
    var start = Date.now()
    
    http.get(options, function(response) {
        response.on('end', function() {
            times.push(Date.now()-start)
        })
    }).on('error', function(e) {
        console.log('Got error: ' + e.message)
    })
}

for (i=0; i<count; i++)
    request(options)
