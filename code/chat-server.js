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
    
    console.log(parsed_url)
    
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
        console.log('creating new chat')
        chat_id = chat()
        __respond_200(chat_id.toString(), response)
        
    } else if (__match('POST', __new_message_regex)) {
        // Create a new message in the specified chat
        console.log('creating new message')
        
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
        console.log('getting list of messages')
        
        var since = parseInt(parsed_url.query.since) || -1 // defaults to all messages
        var msgs = messages(chat_id, since).map(function(m) {
            return '[' + m.id + '] ' + m.author + ': ' + m.body
        })
        
        __respond_200(msgs.join('\n\n'), response)
        
    } else {
        // user specified a path that we don't know what to handle, so serve a
        // 404 response
        console.log('serving 404')
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
