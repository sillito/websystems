---
title: Generating and serving HTML
layout: default
root: ../
---

In a [previous exercise](server.html) you implemented a simple Node server that serves static assets. For this exercise you will need to extend your Node server so that it can serve _photo streams_. A photo stream is a HTML web page that containing a set of images that exist in a user's folder on the file system of the server.

Your program should create a server that listen for HTTP requests. When an HTTP request is received, the server converts coverts the requested path into a file name by prepending the directory public. This would ensure that a client can only see files that are publicly available. If the path is for a file, then it is handled as we did in the previous exercise. If the path specifies a folder then it is treated as a request for a photo stream. Here are a couple example conversions:

    Request path        What is served
    --------------------------------------
    /david              Photo stream page based on the images in public/david/
    /david/image.png    The static asset public/david/image.png
    /sally/school       Photo stream page based on the images in public/sally/school

If the request is for a folder, the server attempts to generate and serve the HTML file for the photo stream to the client by creating an appropriate HTTP response.

* If the directory does not exist, the HTTP response has status 404 and the body of the response is a simple error message.

* If the directory exists, the HTTP response has status 200 and the body of the response is the generated HTML for the photo stream.

Th HTML page that you generate would consist of two parts: the overall template page and the item template section. The item part in a photo stream page is repeated for each of the files in the photo stream. The item template has: the photo, the name of the user, and  the approximate time (in words) since it was created. Here is a simple template to get you started (feel free to improve on this):

    <section>
        <img src="{{"{{image_path"}}}}">
        <p>By {{"{{user_name"}}}}, {{"{{time_ago"}}}} ago</p>
    </section>

## Notes

* Use the time and string utility functions you created for a [previous exercise](functions.html) for showing approximately how long ago a time has been and substituting values into a template.

* The creation time-stamp of a file can be accessed using the fs.stat function.
