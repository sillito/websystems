---
title: HTML forms and POST HTTP requests
layout: default
root: ../
---

To this point we have discussed HTML primarily as a mechanism for displaying and navigating (via hyperlinks) information, but it also can be used for collecting information from users. Information is collected as a user enter information into various HTML _form elements_ and is typically sent to the server using an HTTP POST request.

## HTML forms and HTTP requests

HTML defines a `form` element that is a container for specific elements such as text boxes and radio buttons. The form element specifies details about the HTTP request that is sent when the form is submitted. For example, the following form element will result in information being sent to the server as part of a `POST` request (which is the default) with the path `/todo/save`.

{% highlight html %}
<form action="/todo/save" method="post">
    <input type="text" name="todo" />
    <input type="submit" name="submit" value="Save" />
</form>
{% endhighlight %}

Here is specifically how the request would look (assuming the user entered "go shopping" in the text field). The body of the request contains information from each element that has a `name` attribute and that information is encoded in the same way that a query string would be.

    POST /todo/save HTTP/1.1
    content-type: application/x-www-form-urlencoded
    (other headers ...)
    
    todo=go+shopping&submit=Save

Alternatively we can set the `method` attribute to be "get" in the form. In this case the request would have no body and the form data would be sent in the query string of the request's path as follows:

    GET /todo/save?todo=go+shopping&submit=Save HTTP/1.1
    (headers ...)

## Form elements

The following is a list of form elements.

The following screenshot list many of the HTML elements that make up forms. On the left is how the form elements might look in a webpage. On the right is the HTML tag that was used to define the element.

### Text boxes and variations

{% highlight html %}
<input type="text" name="name" placeholder="First Name" />
<input type="email" name="email" placeholder="example@domain.com" />
<input type="password" name="password" placeholder="Password" required />
<textarea name="description"></textarea>
{% endhighlight %}

<input type="text" name="name" placeholder="First Name" />
<input type="email" name="email" placeholder="example@domain.com" />
<input type="password" name="password" placeholder="Password" required />
<textarea name="description"></textarea>

### Checkboxes and radio buttons

{% highlight html %}
<input type="checkbox" name="agree" value="yes" /> I agree to terms
<input type="radio" name="gender" value="female" checked /> Female<br/>
<input type="radio" name="gender" value="male" /> Male
{% endhighlight %}

<input type="checkbox" name="agree" value="yes" /> I agree to terms<br/>
<input type="radio" name="gender" value="female" checked /> Female<br/>
<input type="radio" name="gender" value="male" /> Male

### Hidden input

Hidden inputs are used to send data to a server as part of a form submission, but there is not corresponding visual element for that data.

{% highlight html %}
<input type="hidden" name="key" value="98jasd0237jh" />&nbsp;
{% endhighlight %}

### Selects and options

{% highlight html %}
<select name="city">
    <option value="calgary">Calgary</option>
    <option>Edmonton</option>
    <option selected>Lethbridge</option>
    <option value="red deer">Red Deer</option>
</select>
{% endhighlight %}

<form>
<select name="city">
    <option value="calgary">Calgary</option>
    <option>Edmonton</option>
    <option selected>Lethbridge</option>
    <option value="red deer">Red Deer</option>
</select>
</form>

### (Submit) buttons

{% highlight html %}
<input type="submit" value="Save" />
<button type="submit" value="save">Save</button>
{% endhighlight %}

<input type="submit" value="Save" />
<button type="submit" value="save">Save</button>

## A more detailed example

Suppose that we were creating a web application to allow users to create and save notes. Each note is to have a title and some content (both required). Also, a note can be marked as public or not. To support this application we first need to design a URL scheme that specifies what requests will serve our form and what requests will process the form data:

    GET  /               respond with page that includes a "create note" link
    GET  /note/new       respond with form for creating a new note
    POST /note/create    process form data, redirect to '/' if successful

The following is a simple server that implements this scheme. In the following code, the form data is not saved, but normally a database would be used for this. Also, note that our index is a static file, while in a realistic application, the index would be dynamically generated, likely displaying a list of notes for a user.

{% highlight javascript %}
var server = http.createServer();

server.on('request', function(request, response) {
    console.log(request.method + ' ' + request.url)
    
    if (request.method == 'POST' && request.url == '/note/create') {
        var body = ''

        request.on('data', function(data) {
            body += data
        })
        
        request.on('end', function() {            
            var note = querystring.parse(body)
            console.log(note)
            
            // todo: save new note in DB
            
            response.writeHead(302, {
                'Content-Type':'text/plain', 
                'location':'/'});
            response.end('Found!');
        })
        
    } else if (request.method == 'GET' && request.url == '/note/new') {
        serve_static('new.html', response);
    } else if (request.method == 'GET' && request.url == '/') {
        serve_static('index.html', response);
    } else {
        response.writeHead(404, {'Content-Type':'text/plain'});
        response.end('Resource not found');
    }
})

server.listen(8123);
{% endhighlight %}

The index file served by the above server code needs to include a link element such as:

{% highlight html %}
<a href="/note/new">
    + Create a new note
</a>
{% endhighlight %}

When that link is clicked the server will respond with the page new.html which includes a form. The following is a basic form, followed by a screenshot of how the form might look in a browser (depending on how the page is styled).

{% highlight html %}
<form action="http://localhost:8123/note/create" method="post">
    <input type="text" name="title" placeholder="Give your note a title" />

    <textarea name="content" placeholder="Type your note here"></textarea>

    <input type="checkbox" name="public" /> Make note public?
    <button type="submit">Save</button>
</form>
{% endhighlight %}

![Form elements](../images/note-form.png)

In the server code, there is a line that is responsible for parsing the body of the response using the `parse` function of the `querystring` module. This function returns an object where the properties of the object are the names from the form elements and the values of those properties are the values that the user entered into the form. So, for example, depending on what the user entered into the form this object might have the following properties and values:

{% highlight javascript %}
{ title: 'Shopping list',
  content: 'Milk\r\nEggs',
  public: 'on' }
{% endhighlight %}

## Multipart forms and file uploads

One of the form elements listed in the screenshot above is an input of type `file`. This element allows a user to upload a file to the server. In this case the file contents are part of the post request. For this to work the form needs to be declared as "multpart" using the `enctype` attribute (note that the default `enctype` is "application/x-www-form-urlencoded").

{% highlight html %}
<form action="/photo/add" method="post" enctype="multipart/form-data">
    <input type="file" name="photo" chars="40"/><br>
    <input type="submit" />
</form>
{% endhighlight %}

More details on multipart forms will be added here shortly.

