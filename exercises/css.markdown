---
title: Putting some of the pieces together
layout: default
root: ../
---

In the previous exercises you created parts of a photo stream generator web application. For this exercise you will add support for users to (1) view the list of streams they own and (2) browse the thumbnail view of a stream. Modify your server code to respond to the following URL scheme:

    Method  Path                 Action/Response
    ---------------------------------------------------------------------------
    GET     /home                display the list of streams owned by the logged 
                                 in user
    GET     /stream/[SID]        display the thumbnail view of stream SID
    GET     /photo/new/[SID]     respond with a form for uploading a new photo 
                                 in stream SID
    GET     /thumbnail/[PID]     respond with the thumbnail of photo PID
    POST    /photo/create/[SID]  process form data, show a confirmation page if 
                                 successful, redirect to /photo/new/[SID] 
                                 otherwise
    ---------------------------------------------------------------------------

## CSS files

Create a directory called `css` and arrange that your server can server static assets from that directory. In that directory create a file called `site.css` with some style information for all of your pages.

## List of streams

When a user logs into the system, they are redirected to a page that displays the list of streams they own. The list features the name, description, creation time of each stream and whether it is public or private. Using CSS, style the list of streams to look something like:

---
**My Vacation Photos**<br/>All of my best photos from my winter trip to Paris<br/><span style="color:#888;font-size:12px">Private repository, created 4 weeks ago, last updated 3 weeks ago</span>

---

Include a link to `/stream/new` for creating new streams.

## Thumbnails

ImageMagick is a software suite for creating, editing, and converting images. The Node module imagemagick is a wrapper for this software suite (that is, it requires the ImageMagick suite to be installed on your operating system to work). The following code demonstrates how an image can be resized in Node through imagemagick.

{% highlight javascript %}
var im = require('imagemagick');

// resizes test.jpg to the new width of 350 pixels (preserving aspect 
// ratio) and saves as test-resize.jpg
var opts = {srcPath: './test.jpg', dstPath: './test-resize.jpg', width: 350}
im.resize(opts, function(err) {
  if (err) throw err;
});
{% endhighlight %}

Revise your code so that it creates a thumbnail of every image uploaded to a stream through /photo/create. Name thumbnail images after the main image. For example, if test.jpg is uploaded and stored as photo-12.jpg (12 being the database id of the photo record) then its thumbnail should be named photo-12-tn.jpg. A thumbnail's width should not be more than 100 pixels. If an image is wider than 100 pixels then it is resized (preserving aspect ratio) to 100 pixels. Otherwise, the image itself is copied and used as the thumbnail.

## Stream view

Users can select individual streams from the above list to view their content. Create a page (or revise your existing page) that displays the thumbnails and photo information for an individual stream. However, unlike the past that you retrieved stream details from the file system, photo information now has to be retrieved from the database (though the thumbnails are still stored on the file system). The following screenshot displays the thumbnail view of the 'School' stream owned by 'Sally Brown'.

![Stream](stream.png)

All photos and photo information sections have to be aligned as shown in the screenshot above. The photo information section is placed on the right side of each photo and displays its title and upload time. You will need to use CSS to get style the stream page as shown. To do this create a directory called `css` and arrange that your server can server static assets from that directory. Create a file called stream.css.

