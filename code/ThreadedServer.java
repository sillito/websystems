import java.io.*;
import java.net.*;
import java.util.*;

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
        String line = in.readLine();
        
        if (line == null) // no data sent, return empty request
            return request;
        
        String[] parts = line.trim().split("(\\s+)");
                
        if (parts.length == 3) {
            request.method = parts[0];
            request.path = parts[1];
        
            // read headers until we read a blank line
            while (true) {
                line = in.readLine();
            
                // blank line signals end of headers
                if (line == null || line.length() == 0)
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

// 
// thread to handle one HTTP request
//
class RequestHandler extends Thread {
    // socket to read a request from and write the response to
    Socket socket;
    
    public RequestHandler(Socket socket) {
        super("Request Handler");
        this.socket = socket;
    }
    
    public void run() {
        try {
            // parse lines sent by the client that are expected to follow 
            // the HTTP sepc
            HTTPRequest request = HTTPRequest.parse(socket.getInputStream());
            // System.out.println("received request ...");
            // System.out.println(request);
        
            // an actual server would take a different action depending on
            // the details of the request (e.g., reading some information 
            // from a database). here we just sleep ...
            Thread.sleep(200);

            // write a simple plain text response to the client
            String message = 
                "HTTP/1.1 200 OK\nContent-Type: text/plain; charset=utf-8\n\n" + 
                "Hello and goodbye from the server\n";
            OutputStream output = socket.getOutputStream();
            output.write(message.getBytes());
            
            // close the output stream and socket (may not get closed, if there
            // is an exception!!!)
            output.close();
            socket.close();
        
        // we're just catching these exceptions to keep the compiler happy, but
        // realistically, we should be serving (for example) of 500 response in
        // some error cases, ...
        } catch (IOException ex) {
            System.err.println("Error handling request " + ex);
        } catch (InterruptedException ex) {
            System.err.println("Error handling request " + ex);
        }
    }
}

//
// trivial HTTP server (warning doesn't handle/check various error conditions,
// doesn't catch and recover from exceptions and doesn't scale well)
//
public class ThreadedServer {    
    //
    // create server socket and listen for requests
    //
    public static void main(String[] args) throws IOException, InterruptedException {
        // this is the max size for the queue holding incoming requests for a
        // connection to this server
        int backlog = 10000;
        
        // create a server listening on port 8124
        ServerSocket serverSocket = new ServerSocket(8124, backlog);
        
        // a simple loop that repeatedly accepts connection requests
        while(true) {
            // block while we wait to accept a connection request, then start
            // thread to handle the request ...
            new RequestHandler(serverSocket.accept()).start();
        }
    }
}
