---
title: Comparing Server Performance
layout: default
root: ../
---

In a [previous exercise](server.html) you implemented a simple node server that serves _static assets_. Recall that a static asset is a file that exists on the file system of the server.

 Also, in the [course lecture material](../materials/servers.html) there is code for two servers written in Java. One is single threaded, the other uses threads to handle connections (one thread for each connection). Both of the Java servers have the following line of code to simulate time taken to perform IO or other time consuming option:

	Thread.sleep(200); // block thread for 200 ms
	
For this exercise you will need to modify the two Java servers to serve static assets in response to HTTP requests, just like your node server. This modification will require you to replace the `Thread.sleep(200)` code with actual IO code, and to change what is written to the output stream. Once you have made these changes you will have three servers that are functionally similar:

* The Node server which uses one thread, and event loop and nonblocking IO,	
* A single threaded Java server, and
* A threaded Java server which uses one thread for each connection.

You should also make sure you have at least two files available for testing, such as:

* public/large.png - a small image file, perhaps 10s of KBs
* public/small.png - a larger image file, over 1MB in size

## Experiments

The main focus of this exercise is to compare the performance of these three servers and produce a **report** discussing the results. 

The tool you will use for this experiment is the `ab` command line tool from the Apache project. You are to call the `ab` command with different values of `c` (i.e., with different numbers of concurrent connections) and with different file sizes, as shown here:

	ab -n 1000 -c 1 http://.../large.png
	ab -n 1000 -c 50 http://.../large.png
	ab -n 1000 -c 100 http://.../large.png
	ab -n 1000 -c 1000 http://.../large.png
	ab -n 1000 -c 1 http://.../small.png
	ab -n 1000 -c 50 http://.../small.png
	ab -n 1000 -c 100 http://.../small.png
	ab -n 1000 -c 1000 http://.../small.png

Run each of the above commands with each server and record three statistics from each run: _Total time taken for tests_, _Requests per second_, and _Time per request_. Summarize all of your results using one or more tables and/or charts. In your report explain the results by connecting the numbers with the implementation differences in the servers. In my view, this explanation is the most important part of this exercise.

## Notes

* In the Java code there is a variable called `backlog` that represents a maximum size for the queue holding incoming requests for a connection. Make sure the value of this variable is at least as large as the `c` you are using for your trials.

* Different operating systems have different limits for the number of socket connections that can be made. You may hit that limit in this experiment.

* The `ab` command returns two different _Time per request_ numbers. The one we are interested (i.e., the one that corresponds to our definition of response time) in is the first one. Out of interest, you may want to see if you can figure out what is being reported in the second number.
