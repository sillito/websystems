---
title: Persisting Data Using MySQL
layout: default
root: ../
---

In a previous exercise you implemented an HTML generator based on the concept of a photo stream where the photos are stored on the server file system. For this exercise you will create a MySQL database to store other information the photo stream web application will need to store.

## Schema

The server-side database will provide storage for the three entities: `User`, `Stream`, and `Photo`. We'll start with a simple schema and possibly make it more complete later. The following picture shows a minimal ERD for such a database:

![Schema](schema.jpg)

Based on the diagram, create a file called schema.sql that contains the `create table` sql statements to create the database. You may also find the `drop table` statement useful.

## Module

Create a Node module (call it `store.js`) for accessing the database described above. The module should provide add, read, and update operations for the three entity types in the database. The exact design of this module is up to you, but the following examples demonstrate the kinds of things that other code should be able to do with the module you create.

{% highlight javascript %}
var store = require('store'); // where store is the name of your module

var user = {
    first_name: 'Sally',
    last_name: 'Brown',
    user_name: 'sbrown',
    password: 'abcdef'
};

// the following performs an insert and calls the function with 
// the user object (which now has an id)
store.save_user(user, function(error, user) {
    if (!error) {
        user.password = 'ghijkl';

        // this following performs an update to the database
        store.save_user(user, function(error, user) {
            if (!error) {
                // ...
            }
        });
    }
});

// the following performs a select with a limit of 1
store.get_user('sbrown', function(error, user) {
    if (!error) {
        // ...
    }
})
{% endhighlight %}

Finally, create a simple module to test the store module you create. 

## Hints

- Node-mysql provides a simple API for accessing MySQL databases. Install and use node-mysql for accessing your database.
- Before each test is run the database has to be reset to a known state, i.e., tables are given a set of known records.
- Photos will be kept on the server file system, not the database. The Photo entity keeps track of the file location.