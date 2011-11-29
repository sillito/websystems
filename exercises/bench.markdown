---
title: Benchmarking Tool
layout: default
---

# Create Bench Marking Tool

For this exercise you will create a tool that can be used to benchmark a web server. The command takes two arguments a URL and a number of requests (`N`) to send:
	
	> node bench.js URL N
	
Given those arguments, the tool sends N requests to using the given URL nearly concurrently (i.e., send each without waiting for the previous request to complete). The time taken to complete the response for each request is tracked and when all requests are complete the following data is output.

	concurrrent requests:  <number>
	total time:            <time with units>
	mean time/request:     <time with units>
	
For example, if you wanted your tool to send (and benchmark) 100 requests against wikipedia you could run:

	> node bench.js http://en.wikipedia.org/wiki/University_of_calgary 100
	
In this case the output (depending on how wikipedia is responding at the time the tool is run) might be:

	

	