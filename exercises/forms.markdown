---
title: Forms
layout: default
root: ../
---

In a [previous exercise](sql.html) you created a Node module (store.js) for persisting photo stream data into a MySQL database. For this exercise you will implement support for users to (1) create new photo streams and (2) to upload photos to a photo stream. To do this you will need to create two HTML forms and modify your server code to server to respond to the following URL scheme:

    GET   /stream/new     respond with form for creating a new stream
    POST  /stream/create  process form data, show a simple confirmation 
                          page if successful, redirect to '/stream/new' otherwise
    GET   /photo/new      respond with form for creating a new photo
    POST  /photo/create   process form data, show a simple confirmation page if 
                          successful, redirect to '/photo/new' otherwise

Screenshots of the forms for saving a new stream and photo are given below. 

![Schema](form.png)

![Schema](form2.png)

The title of the stream and photo as well as the photo file name are mandatory fields. If a value for a mandatory field is not supplied the application should disallow persisting a record to the database (ideally redirecting back to the form with an error message).

Photos will be uploaded and saved to a directory on the file system of the server. To avoid naming conflicts, uploaded files will be renamed after the primary key value of the photo record. For example, if an uploaded JPG photo is persisted in a record with the ID equal to 185 then the file should be saved as photo-185.jpg.

## Hints

- You may need to revise your database schema from previous exercise so that you can persist all the fields in the above forms.
- Don't forget to populate the time-stamp columns in stream and photo tables (i.e., created_on and added_on respectively) when saving a new record.