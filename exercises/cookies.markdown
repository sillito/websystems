---
title: Cookies and Authentication
layout: default
root: ../
---

In a previous exercise you created web pages for creating photo streams and adding photos to them. For this exercise you will implement support for users to (1) sign up to the service and (2) log in to their photo stream.

## Sign up and login

Create two HTML forms and modify your server code to respond to the following URL scheme:

    METHOD  PATH    ACTION
    ---------------------------------------------------------------------------------
    GET     /signup  respond with a form for user sign up
    POST    /signup  process form data, redirect to login page if successful, redirect 
                     to /signup otherwise
    GET     /login   respond with a sign in form
    POST    /login   process form data, redirect to /stream/new if successful, redirect 
                     to /login otherwise

Here are screenshots of basic sign up and sign in forms.

![signup](signup.png)
![login](login.png)

## Password

When a user signs up, the user supplied password will be hashed using the SHA-256 algorithm (a common variation of the SHA-2 algorithm). To facilitate saving the resulting hash to a database, it is digested to a hexadecimal string. The following code demonstrates how such a digest can be computed.

{% highlight javascript %}
var crypto = require('crypto');
// creates a hash based on the given algorithm
var hash = crypto.createHash(algorithm);
// the hash content is updated with some data
hash.update(data);
// calculates the digest of the hashed data based on the given encoding
var digest = hash.digest(encoding);
{% endhighlight %}

Once a user logs in, the validation of the supplied password happens through hashing and digesting the password and comparing it with the existing password digest in the database. If the two digests match then the user has supplied a valid password.

## Cookie

User sessions will be managed by a cookie that contains the concatenation of the user's username and login time. For security reasons, instead of using the plain value you will store its SHA-256 hashed and hexadecimally digested value in the cookie (similar to what you did with the password field).

For example, suppose that the user 'Sally Brown' with the user name 'sbrown' logs in at 'Fri, 09 Mar 2012 18:02:57 GMT'. The cookie value should then be the hashed and digested value of 'sbrown1331316179159' where '1331316179159' is the numeric value of the above date in milliseconds.

## Session Management

Create a Node module (call it session.js) for managing user sessions. The module should allow creating a new session for a user and getting the session for a user already logged in. A session object should at least store the database id of the user. You can also use it for other information you may need to keep in memory (e.g., the user's first name for personalizing pages displayed). The exact design of this module is up to you, but the following examples demonstrate the kinds of things that your server code should be able to do with the module you create.

{% highlight javascript %}
var session = require('./session');

// the following registers a new session for the user logging in
function session_create_example(user_name) {
    var token = generateToken(user_name, new Date());
    session.addSession(token);
}

// the following retrieves the session object for the current user and accesses an
// object previously added to it
function session_access_example() {
    var token = getToken();
    var user_session = session.getSession(token);
    console.log(user_session.first_name);
}
{% endhighlight %}

## Hints

- No third party library (including formidable) shall be used for processing forms. Use the parse method of the querystring object to handle form fields.

- The /stream/new and /photo/new should only be displayed if user is logged in. Trying to access these pages when user is not logged in should result in being redirected to /login.

- When creating a new stream (through /stream/create) the user_id field of the stream should now correspond with the user logged in.
