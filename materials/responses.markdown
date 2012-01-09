---
title: HTTP Responses
layout: default
root: ../
---

HTTP (or Hypertext Transfer Protocol) is the foundation of data communication for the World Wide Web. It is standardized by the Internet Engineering Task Force and the World Wide Web Consortium. HTTP/1.1 is the version of HTTP in common use today.

HTTP is a stateless, request-response protocol. A user-agent (i.e., a client) sends an HTTP Request and a server handles the request and responds by sending an HTTP Response back to the client. Handling the request may require taking some action on behalf of the client such as updating some information in a database. This video and the following notes are about half of the protocol: **HTTP responses**. [HTTP Requests are discussed here](requests.html).

<iframe src="http://player.vimeo.com/video/34517296?title=0&amp;byline=0&amp;portrait=0" width="720" height="540" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

At it's simplest a (web) server can simply be providing access to file resources on the server. In this simplest case, in response to a `GET` request for a file at a particular path (`/path/to/file.html`) the server returns that file. In more complicated Web Applications, the server will be executing code in response to each request and the process of mapping a particular request to the appropriate code is called _dispatching_ or _routing_ and different servers and frameworks have different routing rules. For example, in a Ruby on Rails application (assuming default configuration) a request such as:

	GET /patients/18

will be handled by the `show` method in the `PatientsController` class. The show method might read patient information from the database (for patient with id 17), generate an HTML representation of that patient information and then return the HTML as the body of a response. Similarly, a request such as:

	POST /patients
	
will likely be handled by the `create` method in the `PatientsController` class. The request would be accompanied by a body containing some patient information and the method would validate that information and save it in the database. The HTTP response returned might simply be a message indicating that the patient information was successfully saved.

## Details of a response

In this section we discuss the lower-level details of a response. To send a request, a user-agent first establishes a (TCP/IP) connection with the host and then sends the actual request. The server parses the request (takes some action, possibly) and sends a response using the same connection the user-agent used to send the request. The connection may then be closed, or kept alive for subsequent requests and responses.

A response has three parts: 

1. A response line which is an HTTP version number, a numeric status code and a textual description of the reason for the status. Commonly used status codes include (a complete list can be found [here](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)):

	* `200 OK` (all 2XX indicate success)
	* `302 Found` (all 3XX codes tell are redirects)
	* `404 Not Found` (all 4XX codes are "client errors")
	* `500 Internal Server Error` (all 4XX codes are "server errors")

	Here is an example response line for a "redirect" response.

		HTTP/1.1 302 Found
		
	And here is an example response line for a "not found" response.
	
		HTTP/1.1 404 Not Found

2. Some number of response headers which take the form of `name: value`, each on their own line. In general headers are optional, but several are fairly common (`content-type`, `set-cookie`). Here are some examples:

		Content-Type: text/html; charset=UTF-8
		Set-Cookie: sid=nsh649
		Keep-Alive: 
	
	The list of headers is followed by an empty line.

3. A response body containing the data being sent from the server to the user-agent. The data being sent can vary significantly, for example, it might be an image or an HTML page. To see the (HTML) sent in response to a request for this page, use the _view source_ feature of your browser.

## Sample Response

Here is a sample HTTP Response from `www.google.com` indicating that the requested resource will be found at `www.google.ca`:

	HTTP/1.1 302 Found
	location: http://www.google.ca/
	cache-control: private
	content-type: text/html; charset=UTF-8
	set-cookie: some complicated cookie data ...
	date: Wed, 19 Jan 2011 19:48:03 GMT
	server: gws
	content-length: 218
	x-xss-protection: 1; mode=block
	connection: close
	
	<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
	<TITLE>302 Moved</TITLE></HEAD><BODY>
	<H1>302 Moved</H1>
	The document has moved
	<A HREF="http://www.google.ca/">here</A>.
	</BODY></HTML>

## Exercise

