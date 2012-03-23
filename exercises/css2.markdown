---
title: Putting more of the pieces together
layout: default
root: ../
---

In the previous exercises you created parts of a photo stream web application. For this exercise you will (1) add support for users to follow/unfollow public streams created by other users, (2) add a navigation bar, and (3) improve on security and error handling of your web application.

Modify your server code to respond to the following URL scheme:

    Method  Path             Action/Response
    ------------------------------------------------------------------------
    GET     /follow/[SID]    follow stream SID, redirect to referrer page
    GET     /unfollow/[SID]  unfollow stream SID, redirect to referrer page

## Following a Public Stream

Users can follow public streams shared by other users. A user's home page (/home) now would display a list of streams owned by the user and public streams by others that the user is following. A user can choose to follow a stream that they are not following, or unfollow one that they are following. Revise your schema and database module (store.js) to support this requirement. 

![Schema](schema2.jpg)

Here are the suggested screenshots of the home and stream pages.

![Streams](streams.png)

![Streams](stream2.png)

The home page should display a 'Upload Photo' and 'Unfollow' link for own and followed stream respectively. Use CSS to place the links on the right side of the page. For each stream, display the time ago a photo has been uploaded to the stream. A 'Follow'/'Unfollow' link for public streams is displayed in the navigation bar next to the 'Logout' link.

## Navigation Bar

Use CSS to render a navigation bar for your application similar to the screenshots above. The navigation bar features 'Home', 'Add Stream', and 'Logout' links and is displayed at the top of all internal pages (that is, pages that require login). The 'Logout' link should be placed at the top right corner of the navigation bar.

## Security

Modify your server code so that it enforces the following access control rules: (1) All users can view public streams shared by other users. For example, the public stream 'My Vacation' owned by 'Sally Brown' can be viewed by everyone (including the guest user). (2) Users cannot view private streams owned by other users. (3) Only the user who owns a stream is allowed to upload photos to that stream. Redirect all requests violating the above access control rules to the application home page. Also, verify that your application is safe against <a href="http://en.wikipedia.org/wiki/SQL_injection">SQL injection</a> attacks.

## Error Handling

Your application should handle invalid URL by responding with a 404 response. There are different reasons a URL in a request can be invalid. Here are some examples:

URL may point to a non-existent path, have too few/many parameters, or have an invalid parameter. Here are some examples of invalid URLs:

    URL                  Problem
    ----------------------------------------------
    /dummy               does not match URL scheme
    /stream/abc          invalid ID format
    /stream/134          stream id not found in DB

## Hints

* If your application already has a suitable navigation bar then you may disregard the Navigation Bar section of this exercise.
