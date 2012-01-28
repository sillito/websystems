---
title: Web application server basics
layout: default
root: ../
---

This short video introduces some basic server concepts.

<iframe src="http://player.vimeo.com/video/35777817?title=0&amp;byline=0&amp;portrait=0" width="720" height="540" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

Here is an interesting article from the Wall Street Journal about (finding the best checkout line)[http://online.wsj.com/article/SB10001424052970204770404577082933921432686.html] at a grocery store. Suppose, for example, that there are three cashiers and one line (we'll call it a queue) for customers. This system can handle at most three concurrent customers and the others must wait in the queue. When a cashier becomes available (because he or she has finished serving a previous customer), the customer at the front of the queue can be served by that cashier. New customers join the queue at the back of the line.

How happy the customers are will depend on how quickly their cashier can serve them and how long they have to wait in the queue. The store manager will also be interested in how many total customers can be moved served (that's how the store makes money after all). More specifically, while looking at the process of handling customers and trying to improve it, a grocery store manager manager might pay someone to measure two things (likely at different times of the day and week):

* How long does it take for each customer to be through the line and done with the cashier. The average of all of these numbers is the _mean response time_ and might be measured in _minutes_.

* How many total customers are served over some period of time. This is called the _throughput_ of the store, and might be measured in _customers served/minute_.

If the response time is unreasonable because of the time customers spend in the queue, or the throughput is limited by the number of cashiers, the manager may choose to hire more cashiers.

This is somehow analogous to handling HTTP requests in a server. Incoming HTTP requests are like customers and the server resources that are used to handle those requests (i.e., returning a response) are like cashiers. Before sending a request to a server, a client must establish a TCP/IP connection with the server and servers maintain queues for holding incoming requests. The size of these queues is limited (sometimes at multiple places in the software stack). 

When the number of requests is small and/or if each request can be handled quickly/easily (i.e., using only a small amount of CPU and IO resources) then almost any implementation will do. However, as the number requests (and the cost of handling each request) increases, the way that the server is implemented (especially the way concurrency is handled) becomes important.

To evaluate the performance of a system of an HTTP application server, two measures (analogous to the two grocery store measures mentioned above).

* _Response time_: the time taken to handle a given request, often measured in milliseconds. Both the mean and distribution of response times are important.

* _Throughput_: the number of requests handled in a given period of time, often measured as requests/second. When evaluating the performance of a server, throughput can be measured as a function of the number of (concurrent) incoming requests.

Different servers take different approaches to handling concurrent requests. For example, Apache has one process that listens for requests, when a request comes in, it creates a new thread to handle the request, so that the main process can continue listening for the next request. An HTTP server implemented using Node takes a different approach, using just one process (and a small number of threads, generally) and handling concurrent requests using an event loop and asynchronous IO.

A Linux Journal article describes node's asynchronous approach to handling requests using the grocery store checkout line analogy:

> "Have you ever been standing in the express lane of a grocery store, buying a single bottle of water, only to have the customer in front of you challenge the price of an item, causing you and everyone behind you to wait five minutes for the price to be verified? Plenty of explanations of asynchronous programming exist, but I think the best way to understand its benefits is to wait in line with an idle cashier. If the cashier were asynchronous, he or she would put the person in front of you on hold and conduct your transaction while waiting for the price check. Unfortunately, cashiers are seldom asynchronous. In the world of software, however, event-driven servers make the best use of available resources, because there are no threads holding up valuable memory waiting for traffic on a socket. Following the grocery store metaphor, a threaded server solves the problem of long lines by adding more cashiers, while an asynchronous model lets each cashier help more than one customer at a time." [http://www.linuxjournal.com/article/7871](http://www.linuxjournal.com/article/7871)

## A Single Threaded Java Server

Here is the naive approach to handling HTTP requests implemented in Java (note this depends on a simple `HTTPRequest` class which is included at the end of this page). This implementation is analogous to a grocery store with only one cashier and that cashier is only able to handle one request at a time.

	{% highlight java %}
	
	//
	// trivial HTTP server (warning doesn't handle/check various error conditions,
	// doesn't catch and recover from exceptions and doesn't scale well, but other
	// than that it's great ...)
	//
	public class Server {    
	    //
	    // create server socket and listen for requests
	    //
	    public static void main(String[] args) throws IOException, InterruptedException {
	        // this is the max size for the queue holding incoming requests for a
	        // connection to this server
	        int backlog = 10;

	        // create a server listening on port 8123
	        ServerSocket serverSocket = new ServerSocket(8123, backlog);

	        // a simple loop that repeatedly accepts connection requests
	        while(true) {
	            // block while we wait to accept a connection request
	            Socket socket = serverSocket.accept();

	            // parse lines sent by the client that are expected to follow 
	            // the HTTP sepc
	            HTTPRequest request = HTTPRequest.parse(socket.getInputStream());
	            // System.out.println("received request ...");
	            // System.out.println(request);

	            // an actual server would take a different action depending on
	            // the details of the request (e.g., reading some information 
	            // from a database). here we just sleep to simulate some time
	            // spent on IO, or other action ...
	            Thread.sleep(200); // ms

	            // write a simple plain text response to the client
	            String message = 
	                "HTTP/1.1 200 OK\nContent-Type: text/plain; charset=utf-8\n\n" + 
	                "Hello and goodbye from the server\n";
	            OutputStream output = socket.getOutputStream();
	            output.write(message.getBytes());

	            // close the output stream and socket
	            output.close();
	            socket.close();
	        }
	    }
	}
	{% endhighlight %}


The above code handles each request one at a time. When a connection from a client is accepted no other connections are accepted until the server is finished with the accepted connection. Subsequent attempts to connect with the server are queued up in the meantime. If each request can be dealt with quickly enough, this might be an acceptable implementation, however a realistic web server or web application may need to do some IO (e.g., reading and writing from a database) as part of handling a request. In this case, because (disk) IO tends to be _slow_, the server CPU will likely be idle for much of the time while handling a request. Despite the availability of CPU resources (etc) because of how the server is implemented, requests will have to wait.

The response time for our server will be the time it takes to handle a request plus the amount of time waiting to establish a connection. At the moment let's assume that the time waiting is 0 and the time it takes to handle one request is 200ms (and of course, each connecting client's request is given all of the server's resources for that 200ms). The throughput will be limited by the fact that we are handling one at a time, so assuming there are incoming requests are frequent enough the server will handle 5 requests/s (not an amazing feat of software engineering). Also, whenever there are more than 5 incoming requests in a second, the time waiting in the queue will begin to rise and so will the response time.

## Apache Bench

[`ab` is an HTTP server benchmarking tool]() from the Apache project. It is a very useful tool for evaluating the performance of an HTTP application server. As an example, in the following we are using `ab` to test Wikipedia. In particular we are using `ab` to send 100 requests (`-n 100`), with 10 of them being concurrent (`-c 10`).

	ab -n 100 -c 10 http://en.wikipedia.org/...
	
In the above we have not shown all of the output from `ab`. Install the tool and run the command on your own to see the full output.

## Exercise

First, use the [benchmarking tool you wrote previously](../exercises/bench.html) to test the performance of the above Java server. You can also use the `ab` command line tool described above. Use different numbers of concurrent requests for your tests, but note that in the code above the variable `backlog` is used to limit the number of requests that can be in the queue.

Next, let's see if we can improve the performance by adding threads. To do this, modify, the above code so that a new thread is spawned to handle each request. The `Thread.sleep(200)` we are using in the above code to simulate IO will only pause the one thread and so the performance should improve.

Compare the performance of the two servers (again using your benchmarking tool and `ab`). Presumably you will find that the threaded server performs much better, but are there any limitations to this approach?

Ready for more? Try [this exercise](../exercises/servers.html)

---

## Helper Code

Here is the HTTPRequest class needed to make the above Java server code work:

	{% highlight java %}
	
	//
	// encapsulates details of an HTTP request (no support for a request body and
	// the HTTP version number is ingnored, at the moment)
	//
	class HTTPRequest {
	    // HTTP method for this request (e.g. GET or POST)
	    String method = null;

	    // the path specified with the request (e.g., /home/index.html)
	    String path = null;

	    // key-value store for all headers sent with the request
	    Map<String,String> headers = new HashMap<String,String>();

	    //
	    // a string with all of the request details
	    //
	    public String toString() {
	        StringBuffer sb = new StringBuffer();
	        sb.append("Method: " + this.method + "\n");
	        sb.append("Path:   " + this.path + "\n");
	        sb.append("Headers:\n");

	        for(Map.Entry<String,String> entry : headers.entrySet()) {
	            sb.append("\t" + entry.getKey() + " : " + entry.getValue() +  "\n");
	        }

	        return sb.toString();
	    }

	    //
	    // Creates an HTTP request object from lines read from an input stream that
	    // is likely associated with a socket connection
	    //
	    public static HTTPRequest parse(InputStream input) throws IOException {
	        HTTPRequest request = new HTTPRequest();
	        BufferedReader in = new BufferedReader(new InputStreamReader(input));

	        // the first line should be a request line of the form:
	        // GET /standards/about.html HTTP/1.1
	        String line = in.readLine().trim();
	        String[] parts = line.split("(\\s+)");

	        if (parts.length == 3) {
	            request.method = parts[0];
	            request.path = parts[1];

	            // read headers until we read a blank line
	            while (true) {
	                line = in.readLine().trim();

	                if (line.length() == 0)
	                    break;

	                // headers are of the form: "name: value", but note that this
	                // parsing is likely too simplistic for real use
	                parts = line.split("(:\\s*)");

	                // improperly formated header so quit reading headers
	                if (parts.length != 2)
	                    break;

	                // add this header to the request object
	                request.headers.put(parts[0], parts[1]);
	            }
	        }

	        return request;
	    }
	}
	{% endhighlight %}
