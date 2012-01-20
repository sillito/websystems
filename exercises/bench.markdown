---
title: Create Benchmarking Tool
layout: default
---

For this exercise you will create a tool that can be used to benchmark a web server by sending it multiple requests and measuring the response time for each request. The command takes three arguments: a host name, a path and a number of requests (`N`) to send
	
	> node bench.js host path N
	
Given those arguments, the tool sends `N` requests for the resource identified by the given host and path. These requests are to be sent nearly concurrently (i.e., send each without waiting for the previous request to complete). The time taken to complete the response for each request is tracked and when all requests are complete the following data is output.

	successful requests:    <number> out of <total requests sent>
	total time:             <time> ms
	throughput:             <number> requests/s
	average response time:  <time> ms
	
In reporting the results, round each computed number to some reasonable level of precision. For example, if you wanted your tool to send (and benchmark) 100 requests against wikipedia you could run:

	> node bench.js en.wikipedia.org /wiki/University_of_calgary 100
	
In this case the output (depending on how wikipedia is responding at the time the tool is run) might be:

	successful requests:   100 out of 100
	total time:            50.02 s
	throughput:            1.99 requests/s
	average response time: 608.05 ms

## Hints

1. The command line arguments passed to a node program are available in the `process.argv` array.

2. To specify a function (the stats reporting function, in this case) to be run just before the process exits (which will be when all of the response have ended) you can use code such as:

		process.on('exit', function() {
			// called before the process exits
		})
