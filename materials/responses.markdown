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

will be handled by (or "routed to")the `show` method in the `PatientsController` class. The show method might read patient information from the database (for patient with id 18), generate an HTML representation of that patient information and then return the HTML as the body of a response. Similarly, a request such as:

	POST /patients
	
will likely be handled by the `create` method in the `PatientsController` class. The request would include a body containing some patient information and the method would validate that information and save it in the database. The HTTP response returned might simply be a message indicating that the patient information was successfully saved.

## Details of a response

In this section we discuss the lower-level details of a response. To send a request, a user-agent first establishes a (TCP/IP) connection with the host and then sends the actual request. The server parses the request (takes some action, possibly) and sends a response using the same connection the user-agent used to send the request. The connection may then be closed, or kept alive for subsequent requests and responses.

A response has three parts: 

1. A response line which is an HTTP version number, a numeric status code and a textual description of the reason for the status. Commonly used status codes include (a complete list can be found [here](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)):

	* `200 OK` (all 2XX indicate success)
	* `302 Found` (all 3XX codes tell are redirects)
	* `404 Not Found` (all 4XX codes are "client errors")
	* `500 Internal Server Error` (all 5XX codes are "server errors")

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

## Handling Requests

As mentioned above, and discussed [here](requests.html), when implementing a web application, a key set of design decisions revolve around the design of the request _methods_ (i.e, `GET`, `POST`, etc) and _URLs_: what kind of requests are user-agents expected to send and how should the server respond in each case? Implementing such a scheme on the server can be as simple as a `switch` statement or series of `if-else` statements. In node this might look like the following code:

	{% highlight javascript %}
	var http = require('http'),
	    util = require('util'),
	    url = require('url')

	var server = http.createServer()

	server.on('request', function(request, response) {

	    var method = request.method,
	        path = url.parse(request.url).pathname // parse url to get path

	    if (method == 'GET' && path == '/tasks') {
	        // retrieve list of all tasks for authenticated users
	        // ...

	    } else if (method == 'POST' && path == '/tasks') {
	        // create a new task

	        request.on('data', function(data) {
	            // get task description from request body, when available
				// ...
	        })
			
	    } else {
	        // unknown path, serving 404 response
	        response.writeHead(404, {
	            'Content-Type':'text/html',
	            'Connection':'close'
	        })

	        response.write('<html><body>')
	        response.write('<h1>URL not found</h1>')
	        response.write('<p>The requested URL ' + path + ' was not found</p>')
	        response.write('</body></html>')

	        response.end()
	    }
	})
	{% endhighlight %}

As the number of actions in an application grows, a more structured approach to handling URLs (and designing the URL scheme) becomes helpful. It can also be helpful to decouple the code that is handling requests from the server code, so that different modules can contribute different handlers. For example, you may want to have a _tasks_ module containing all of the code for handling task related actions (creating, listing, ...), and a separate _projects_ module containing all of the code for handling task related actions. In such cases, a simple switch statement will not work so well.

As a point of comparison, the [express framework](http://expressjs.com/) makes an `app` (or server) object available that can be used to _register_ a particular function as a handler for all requests that match a particular pattern. In the following example, the given function is registered as a handler for any `GET` requests with a path that looks like `/tasks/3456`:

	{% highlight javascript %}
	app.get('/tasks/:id', function(request, response){
	    // get the task with given id (available from request.params.id)
		// ...
	})
	{% endhighlight %}

## Exercise

The goal of this exercise is to get practice creating HTTP responses in Node, by creating a simple chat server. To make things simple, the server will store chat messages in memory and will not perform any authentication or other security checks, and all responses will have `Content-Type:` `text/plain`. Here are the requests that the server is to be able to respond to.

	Method  Path                               Action/response
	--------------------------------------------------------------------------------
	GET     /chats/new                         create new chat and respond with chat 
	                                           id (CID)
	POST    /chats/[CID]/messages/new          add a message to chat, responds with
	                                           id of message (MID)
	GET     /chats/[CID]/messages              responds with a list of messages in 
	                                           CID (most recent first)
	GET     /chats/[CID]/messages?since=[MID]  like above, but only shows messages  
	                                           more recent than message MID

As an example, here is a request that would result in a new message being added to chat 123.

	POST /chats/123/messages/new HTTP/1.1
	host: localhost:8123
	content-type: application/x-www-form-urlencoded
	content-length: 33
	
	author=Jim&body=Hello everyone

The chat server should save the message and respond with the newly created message's id. Here is what the request might look like:

	HTTP/1.1 200 OK
	content-type: text/plain; charset=UTF-8
	content-length: 4
	
	8765

In this example, the client is requesting a list of messages from chat 123 that are more recent than message 8763.
	
	POST /chats/123/messages?since-8763 HTTP/1.1
	host: localhost:8123
	
The chat server should return a list of recent messages, with the most recent message first. Here is an example response.

	HTTP/1.1 200 OK
	content-type: text/plain; charset=UTF-8
	content-length: 

	[8765] Jim: Hello everyone
	
	[8764] Sally: Who is everyone voting for?

Here is a sketch of a nearly complete solution. I suggest you try this by yourself before looking at my code. Also, note that the code has the following problems: (1) the response body is not streamed to the client, (2) it is a messy `if-else` approach, and (3) there is not error checking to make sure that the CID and MID actually exist. Problem number 3 means that a malicious client can easily crash the server.

	{% highlight javascript %}
	var http = require('http'),
	    url = require('url'),
	    querystring = require('querystring')

	var server = http.createServer()

	//
	// The chats variable is an array of "chats". Each chat is simply an array of  
	// message objects. A message object has three properties: id, author and body.
	//

	var chats = []

	function chat() {
	    // Creates a new chat and returns its id (which is its index into the chats
	    // array)
	    chats.push([])
	    return chats.length-1
	}

	function message(chat_id, author, body) {
	    // creates a new message and returns its id (which, again, is just an array
	    // index)
	    var msg = {id:chats[chat_id].length, author:author, body:body}
	    chats[chat_id].push(msg)
	    return msg.id
	}

	function messages(chat_id, since) {
	    // returns all messages since the given message in the given chat, in
	    // the order of most recent first
	    return chats[chat_id].slice(since+1).reverse()
	}

	// 
	// handle requests
	// 

	var __new_chat_regex = /^\/chats\/new$/,
	    __new_message_regex = /^\/chats\/(\d+)\/messages\/new$/,
	    __get_messages_regex = /^\/chats\/(\d+)\/messages$/

	server.on('request', function(request, response) {
	    var parsed_url = url.parse(request.url, true),
	        chat_id = null

	    var __match = function (method, regex) {
	        // Determine if the current request matches the given regex and method
	        if (method == request.method) {
	            var m = regex.exec(parsed_url.pathname)
	            if (m) chat_id = parseInt(m[1]) // side effect!
	            return m
	        }

	        return false
	    }

	    //
	    // Use the above __match function and several if statements to figure out 
	    // what action to take for the current request.
	    //

	    if (__match('GET', __new_chat_regex)) {
	        // Create a new chat, respond with the chat id
	
	        chat_id = chat()
	        __respond_200(chat_id.toString(), response)

	    } else if (__match('POST', __new_message_regex)) {
	        // Create a new message in the specified chat

	        // To get the message content, we need to listen to the 'data' event on
	        // the request object (and the 'end' event to know when we have all of
	        // the data)

	        var buffer = ''
	        request.setEncoding('utf8')
	        request.on('data', function(data) {
	            buffer += data
	        })

	        request.on('end', function() {
	            // now that we have all of the data, we parse the data to get its
	            // parts (i.e., to get the message author and body)
	
	            var d = querystring.parse(buffer)
	            var message_id = message(chat_id, d.author, d.body)
	            __respond_200(message_id.toString(), response)
	        })

	    } else if (__match('GET', __get_messages_regex)) {
	        // get a list of messages from the specified chat

	        var since = parseInt(parsed_url.query.since) || -1 // defaults to all messages
	        var msgs = messages(chat_id, since).map(function(m) {
	            return '[' + m.id + '] ' + m.author + ': ' + m.body
	        })

	        __respond_200(msgs.join('\n\n'), response)

	    } else {
	        // user specified a path that we don't know what to handle, so serve a
	        // 404 response
	        __respond_404(parsed_url.pathname, response)
	    }
	})

	//
	// helper functions for serving responses
	//

	function __headers(text) {
	    return {
	        'Content-Type' : 'text/plain',
	        'Content-Length' : text.length,
	        'Connection' : 'close' }
	}

	function __respond_404(path, response) {
	    __respond(404, 'The requested URL ' + path + ' was not found\n', response)
	}

	function __respond_200(text, response) {
	    __respond(200, text + '\n', response)
	}

	function __respond(status, text, response) {
	    response.writeHead(status, __headers(text))
	    response.end(text)
	}

	server.listen(8123)
	{% endhighlight %}

To "test" my server I used a command line utility called [curl](http://curl.haxx.se/docs/) to act as the client. The following are the `curl` commands and the body of the responses sent by my simple chat server. 

	> curl http://localhost:8123/chats/new
	0
	> curl --data "author=Jim&body=Hi" http://localhost:8123/chats/0/messages/new
	0
	> curl --data "author=Sally&body=Hello" http://localhost:8123/chats/0/messages/new
	1
	> curl --data "author=Jim&body=Welcome to my chat" http://localhost:8123/chats/0/messages/new
	2
	> curl --data "author=Sally&body=Thanks" http://localhost:8123/chats/0/messages/new
	3
	> curl http://localhost:8123/chats/0/messages
	[3] Sally: Thanks

	[2] Jim: Welcome to my chat

	[1] Sally: Hello

	[0] Jim: Hi
	> curl http://localhost:8123/chats/0/messages?since=1
	[3] Sally: Thanks

	[2] Jim: Welcome to my chat

	