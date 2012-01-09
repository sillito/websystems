---
title: Serving Static Assets
layout: default
---

Create a simple node server that serves _static assets_. A static asset is a file that exists on the file system of the server. 

You program should create a server and listen for HTTP requests. When an HTTP request is received, the server converts the requested path (`request.url`, in Node) into a file name by prepending the directory `public`, to ensure that a client can only access a set of files considered publicly available. Here are a couple example conversions:

	Request path		File served
	-------------------------------
	/image.png			public/image.png
	/html/index.html	public/html/index.html

Next the server attempts to send that file to the client by creating an appropriate HTTP response:

* If the file does not exist, the HTTP response has status 404 and a the body of the response is a simple error message.
	
* If the file does exist, the HTTP response has status 200 and the body of the response is the contents of the file.
	
In either case the HTTP response should have an appropriate Content-Type set. A complete list of content types (i.e., mime types) is available [here](http://en.wikipedia.org/wiki/Mime_type#Type_image), but for this assignment, you only need to worry about handling a few content types:

* text/html
* text/plain
* image/png
* image/jpef

Once you have completed your server program, use [your benchmarking tool](bench.html) to test the performance of your server. One of the variables you should consider in your performance testing is file size. To facilitate this testing, you should create or find a few files such as:

* public/large.png
* public/medium.png
* public/small.png

## Notes

* A naive implementation of the server for this assignment will likely have a security vulnerability that gives clients access to files that are not under the `public/` directory. To trigger this vulnerability, clients need only send requests with a path that includes one or more `../` elements in the path. For example, a request for `../image.png` would be translated as `public/../image.png`, which is a file not under the public directory.	

* To help you get started with this assignment here are a few code examples of demonstrating IO in Node.

		TODO
