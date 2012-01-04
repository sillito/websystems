---
title: A Single Threaded Java Server
layout: default
root: ../
---

Here is an interesting article from the Wall Street Journal about (finding the best checkout line)[http://online.wsj.com/article/SB10001424052970204770404577082933921432686.html] at a grocery store. This is somehow analogous to handling HTTP requests in a server. Incoming HTTP requests are like customers and the server resources that are used to handle those requests (i.e., returning a response) are like cashiers. 

TODO: explain handshakes and states for connections. The concept of a connection queue (can exist at different layers in the software stack).

When the number of requests is small and/or if each request can be handled quickly/easily (i.e., using only a small amount of CPU and IO resources) then almost any implementation will do. However, as the number requests (and the cost of handling each request) increases, the way that the server is implemented (especially the way concurrency is handled) becomes important.

In the following we discuss an implementation that is analogous to a grocery store with one cashier and one line for customers. This is a very naive approach and as we'll see from our simple analysis, it does not scale well.

Here is the naive approach implemented in Java (note this depends on a simple `HTTPRequest` class which is included at the end of this page):

	//
	// Trivial HTTP server (warning doesn't handle/check various error conditions,
	// doesn't catch and recover from exceptions and doesn't scale well)
	//
	public class Server {    
	    //
	    // create server socket and listen for requests
	    //
	    public static void main(String[] args) throws IOException {
	        // this is the max size for the queue holding incoming requests for a
	        // connection to this server
	        int backlog = 10;
	        Socket socket = null;
	        PrintWriter out = null;

	        // create a server listening on port 8123
	        ServerSocket serverSocket = new ServerSocket(8123, backlog);

	        // a simple loop that repeatedly accepts connection requests
	        while(true) {
	            try {
	                // block while we wait to accept a connection request
	                socket = serverSocket.accept();

	                // parse lines sent by the client that are expected to follow 
	                // the HTTP sepc
	                HTTPRequest request = HTTPRequest.parse(socket.getInputStream());
	                System.out.println("received request ...");
	                System.out.println(request);

	                // an actual server would take a different action depending on
	                // the details of the request (e.g., reading some information 
	                // from a database), but we'll just send a simple message.
	                out = new PrintWriter(socket.getOutputStream());
	                out.write("Hello and goodbye from the server\n");

	            } finally {
	                // close the output stream and socket
	                out.close();
	                socket.close();
	            }
	        }
	    }
	}

The above code handles each request one at a time. When a connection from a client is accepted no other connections are accepted until the server is finished with the accepted connection. Subsequent attempts to connect with the server are queued up in the meantime. If each request can be dealt with quickly enough, this might be an acceptable implementation, however a realistic web server or web application may need to do some IO (e.g., reading and writing from a database) as part of handling a request. In this case, because (disk) IO tends to be _slow_, the server CPU will likely be idle for much of the time while handling a request. Despite the availability of CPU resources because of how the server is implemented, requests will have to wait.

To be more precise

define: response time  
define: throughput

The response time for our server will be the time it takes to handle a request plus the amount of time waiting to establish a connection. At the moment let's assume that the time waiting is 0 (we'll come back to that in a second) and the time it takes to handle one request is 200ms (and of course, each connecting client's request is given all of the server's resources for that 200ms). The throughput will be limited by the fact that we are handling one at a time, so assuming there are incoming requests are frequent enough the server will handle 5 requests/s (not an amazing feat of software engineering). Also, whenever there are more than 5 incoming requests in a second, the time waiting in the 

(As a point of comparison -- Facebook's army of servers handles...)

---

The fundamental decision is how to handle concurrency. Here is an incomplete list of possible approaches:

	1. block and let requests pile up
	2. spawn a thread for each
	3. use and event loop and non blocking IO

To understand this we'll use consider a lineup at a grocery store example.

Introduce apache bench.

Introduce the concepts of response time and through put.

Use Grocery store example. 

## Dispatch?



## Exercise

Ready for more? Try [this exercise](../exercises/servers.html)

---

Here is the HTTPRequest class needed to make the above Java server code work:

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
