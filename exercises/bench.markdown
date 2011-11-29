---
title: Benchmarking Tool
layout: default
---

# Create Bench Marking Tool

For this exercise you will create a tool that can be used to benchmark a web server by sending it multiple requests and measuring the response time for each request. The command takes three arguments: a host name, a path and a number of requests (`N`) to send
	
	> node bench.js host path N
	
Given those arguments, the tool sends `N` requests for the resource identified by the given host and path. These requests are sent nearly concurrently (i.e., send each without waiting for the previous request to complete). The time taken to complete the response for each request is tracked and when all requests are complete the following data is output.

	concurrrent requests:  <number>
	total time:            <time with units>
	mean time/request:     <time with units>
	
For example, if you wanted your tool to send (and benchmark) 100 requests against wikipedia you could run:

	> node bench.js en.wikipedia.org /wiki/University_of_calgary 100
	
In this case the output (depending on how wikipedia is responding at the time the tool is run) might be:

	successful requests: 20
	total time:          50221ms
	mean time/request:   2511.05ms

## Hints

1. The command line arguments passed to a node program are available in the `process.argv` array.

2. To specify a function (the stats reporting function, in this case) to be run just before the process exits (which will be when all of the response have ended) you can use code such as:

		process.on('exit', function() {
			// called before the process exits
		})
