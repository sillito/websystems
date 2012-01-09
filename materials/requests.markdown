---
title: HTTP Requests
layout: default
root: ../
---

HTTP (or Hypertext Transfer Protocol) is the foundation of data communication for the World Wide Web. It is standardized by the Internet Engineering Task Force and the World Wide Web Consortium. HTTP/1.1 is the version of HTTP in common use today.

In response to a request from a client a server takes some action on behalf of the client and returns a response:

* Returning a static resource (e.g., an image),
* Storing some information in a database, or
* Dynamically generating a webpage

Note that HTTP is stateless meaning the protocol does not require the server to retain information across multiple requests cookies or hidden variables can be used as a way around this (more later).

This video and the following notes are about half of the protocol: **HTTP requests**.

<iframe src="http://player.vimeo.com/video/32686535?title=0&amp;byline=0&amp;portrait=0" width="720" height="540" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

## Requests and user-agents

HTTP is a **request-response** protocol, where a request is initiated by a client (called the **user-agent**) and a response is provided by a **server**. The user-agent is often a web browser and the server is generally called a web server and is serves HTML content (etc) in response to HTTP requests. Many other user-agents (beyond web browsers) also issue HTTP requests. For example, many [mobile applications](https://twitter.com/#!/download) are a combination of client code that runs on a phone and communicates with a server using HTTP requests.

HTTP requests are sent by the browser when the user enters a URL in an address bar, clicks on a link or submits a form. _URL_ stands for uniform (or universal) resource locator and a URL conceptually identifies a resource located on the network. The basic syntax for a URL is:

	scheme://domain:port/path?query_string#fragment_id

For our purposes, the scheme will be either http (for unencrypted communication) or https (for encrypted communication using SSL/TLS). A query string contains (key-value) data to send from the user-agent to the web server. Here is a URL with a query string example (everything after the `?`):

[http://www.nytimes.com/2011/11/24/sports/football/ndamukong-suh-pushes-line-and-anchors-the-detroit-lions.html?ref=sports](http://www.nytimes.com/2011/11/24/sports/football/ndamukong-suh-pushes-line-and-anchors-the-detroit-lions.html?ref=sports)

The fragment id is a reference to an element in the page (e.g., a section of the page). Here, for example, is the URL for the _Academics_ section of the Wikipedia article about the _University of Calgary_:

[http://en.wikipedia.org/wiki/University_of_calgary#Academics](http://en.wikipedia.org/wiki/University_of_calgary#Academics)

In the above example, nor port is specified so port 80 is assumed, so the following is equivalent to the previous:

[http://en.wikipedia.org:80/wiki/University_of_calgary#Academics](http://en.wikipedia.org:80/wiki/University_of_calgary#Academics)

[More details on URL syntax, etc](http://en.wikipedia.org/wiki/Uniform_Resource_Locator)  
[See also URIs](http://en.wikipedia.org/wiki/Uniform_resource_identifier)

### Encoding and Decoding URLs

Not all characters are legal in a URL (e.g., a space) and of course some characters have special meaning in a URL (e.g., `?`) and are called reserved characters, If we are passing data as part of a request, by putting it in the query string of a URL that data might have to be "encoded" (or "escaped" or "percent encoded" as it is also called). The way this works is that illegal or reserved characters are translated to a special character sequence starting with a `%` as in the following table:

	Char	Encoded As	Why
	--------------------------------
	space	%20			illegal
	"		%22			illegal
	#		%23			reserved
	%		%25			special case
	/		%2F			reserved
	etc		...			...

For example, if you want to send data in the query string of a URL with a space in it the space has to be encoded (as %20). The [encodeURI](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURI) or [encodeURIComponent](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURIComponent) JavaScript function can be used for this purpose:

	encodeURIComponent("my mark was > 90%")
	'my%20mark%20was%20%3E%2090%25'

The reverse process is called decoding and can be performed with [decodeURI](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/decodeURI) or [decodeURIComponent](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/decodeURIComponent). So, if `s` is a `string`, the following will return `s`

	decodeURI(encodeURI(s))
	
[More details on encoding](http://en.wikipedia.org/wiki/Percent-encoding)

## Details of a request

Now let's look at the lower level details of a request. To send a request, a user-agent first establishes a (TCP/IP) connection with the host and then sends the actual request. A request has three parts:

1. A request line which is a _method_ (the verb), a _path_ (identifies the requested resource) and an _HTTP version_. Here is an example:

		GET /standards/about.html HTTP/1.1

	In the above example the method is `GET`. Other possible methods include `HEAD`, `POST`, `PUT`, `DELETE`, `TRACE`, `OPTIONS`, `CONNECT` and `PATCH`. In this course we'll focus primarily on `GET` and `POST` requests. The method describes the action that is requested. As the names imply some methods are intended to be side-effect free while others may modify a resource on the server. A GET request is simply asking for a resource

2. Some number of headers which take the form of `name: value`, each on their own line, usually. In general headers are optional, but some servers require that the host header be provided.

		host: www.w3.org
	
	Other headers in a request might include identify the type of user agent sending the request (`user-agent`) or provide authentication credentials (`authorization`). The `cookie` header is very useful as a way to maintain session information. The list of headers is followed by an empty line.

3. An optional message body containing data being sent from the user-agent to the server. For example, if the user has just submitted an login form, the body could have two values (username and password) and look like this:

		username=sillito&password=abcdefg

	We'll say more about message bodies when we talk about POST requests requests later in the course.

Here are two (almost complete) actual requests sent by a browser. See if you can figure out what the purpose of each of the headers is. First, a `GET` request:

	GET / 1.1
	host: localhost:8124
	connection: keep-alive
	accept: application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5
	user-agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chrome/8.0.552.237 Safari/534.10,
	accept-encoding: gzip,deflate,sdch,
	accept-language: en-US,en;q=0.8,
	accept-charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
	
Second, a `POST` request:

	POST / 1.1
	host: localhost:8124
	origin: file://
	user-agent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4
	content-type: application/x-www-form-urlencoded
	accept: application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5
	accept-language: en-us
	accept-encoding: gzip, deflate
	content-length: 44
	connection: keep-alive

	login=jonathan&password=cpsc301&submit=Login

[More details on HTTP requests](http://en.wikipedia.org/wiki/Http_request)  
[Complete list of HTTP headers](http://en.wikipedia.org/wiki/List_of_HTTP_headers)

## Sending requests in Node

The following is some sample code for programmatically sending an HTTP request using node. 

	{% highlight javascript %}
	var http = require('http')
	
	var options = {
	    host: 'www.w3.org',
	    port: 80,
	    path: '/standards/about.html',
	    method: 'GET'
	}
	
	// create a request object (passing in some options)
	var request = http.request(options)
	
	// set up an event listener to handle a response
	request.on('response', function(response) {

	    // we are expecting utf8 encoded data
	    response.setEncoding('utf8')

	    // set up an event listener to be called when each
	    // chunk of data arrives
	    response.on('data', function(chunk) {
	       console.log(chunk)
	    })

	    // set up an event listener to be called when response
	    // is complete
	    response.on('end', function() {
	       console.log('DONE')
	    })
	})
	
	// set up an event listener to handle any error
	request.on('error', function(e) {
	    console.log('error: ' + e.message)
	})
	
	// complete the request
	request.end()
	{% endhighlight %}

## Exercise

The goal of this exercise is to learn how to send HTTP requests programatically, by building a simple command line tool that performs Google searches and displays the results. Here is how the tool should work:
	
	> node search.js term1 term2 ...
	1. title
	   url
	2. title
	   url
	3. title
	   url

To do this, the tool should take the terms from the command line (see: `process.argv`), encode them and produce an appropriate query string. Using that query string, a request should be sent to www.google.ca with the following format (assuming three terms: winnie the pooh):

	http://www.google.ca/webhp?q=winnie+the+pooh

For now, just focus on writing the code to send the request. Parsing the response is outside the scope of this quick exercise. Here is a quick solution to this exercise, but I suggest that you try it on your own before looking at my code.

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
	
Once you've done the above exercise, give [this exercise](../exercises/bench.html) a try.


