---
title: JavaScript (and Node)
layout: default
---

[JavaScript](https://developer.mozilla.org/en/JavaScript) is an object-based programming language often used for programs intended to run in web browsers. [Node](http://nodejs.org/) is a system designed for writing internet (server) applications. The goal is to make it easy (obviously a relative term) to write an application that scales to large numbers of clients. Node programs are written JavaScript but executed on a server (in general) rather than a web browser.

**Tip:** While watching these videos and reading through the following notes, have Node running so you can try things out.

The first video is a simple and 18 minute introduction to JavaScript. For more detailed coverage of JavaScript (including upcoming changes to the language), I suggest watching videos of [Douglas Crockford's JavaScript talk](http://yuiblog.com/crockford/) and reading mozilla's [JavaScript Guide](https://developer.mozilla.org/en/JavaScript/Guide).

<iframe src="http://player.vimeo.com/video/32997960?title=0&amp;byline=0&amp;portrait=0" width="720" height="540" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

This 4 minute video demonstrates how to write a simple HTTP server in Node.

<iframe src="http://player.vimeo.com/video/33002243?title=0&amp;byline=0&amp;portrait=0" width="720" height="540" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

## Values, variables and literals

Variables (or names for values) are declared using the `var` keyword. Constants are declared with the `const` keyword. 

	> var x = 13; // declare and assign
	> x = "this string"; // reassignment, note: dynamically typed
	> var y; // declaration only
	
	> const a = "hello";
	> a = 55;
	> a

Note: Variables can be scoped "globally" (say, scoped in the global "window" object) or within a function but NOT in a block.

Values or literals in JavaScript include:

	> 34  // Numbers
	> 7.5 // No distinction between float and 
	> typeof 34 // typeof operator

	> true // Boolean
	> false

	> "Hello class" // Strings
	> 'Hello class'
	
	> null // special keyword for a null value
	> undefined 
	> var a
	> console.log(a)
	
	> [12, "12", false] // Array (somewhat like vectors in Java)
	> new Array(12, "12", false) // same as above
	
	> var r = /Hello (\w+)/ // regular expression
	> var match = 'Hello Jim'.match(r)
	> match[1] // evaluates to 'Jim'

Two more fundamental elements, objects (a) and functions, we'll talk about below. We'll also have more to say about Arrays below.

**Next step:** Familiarize yourself with the [basic types in the language](https://developer.mozilla.org/en/JavaScript/Reference).

## Expressions and statements

JavaScript has lots of the operators you'd expect for assignment, comparison, arithmetic, bitwise operations, logical operations, deleting properties, creating objects. By the way, in most situations the trailing `;` at the end of a statement is (unfortunately?) unnecessary and so I've gotten into the (bad?) habit of leaving them off.

	> var x = 12;
	> x += 5;
	> 3 == "3.0" // some type conversion happens with some operators
	> 3 === "3.0" // no type conversion, must be same type
	> var y = (x > 5) ? "big" : "small"; // conditional operator
	
	> var a = [1,2,3];
	> 2 in a; // gtrue if property is in specified object or array
	
Conditional statements: if...else, switch

	> if (3=="3.0") {console.log("it's true")}
	
Loop statements: while, for, do...while, label, break, continue

**Next steps:** Read up on [expressions and operators](https://developer.mozilla.org/en/JavaScript/Guide/Expressions_and_Operators), and [statements](https://developer.mozilla.org/en/JavaScript/Guide/Statements) in JavaScript.

## Functions

Functions are a set of statements that are performed when the function is _called_. Here is a function that takes one argument and returns a value which is that given argument multiplied by itself.

	> function square(n) {return n*n;}
	> square(12);

In JavaScript functions are what are called first class objects. That is they can be assigned to variables, passed as arguments, etc.

	> var sqr = square;
	> sqr(12);
	> var f = function() {}

Now let's look at a more complicated example. The normal way to iterate through each element in an array is just like in most c based languages:

	> var a = [1,2,3,4,5];
	> for (var i=0; i<a.length; i++) {console.log(a[i])}

But this get's tedious, so let's create a function to make this easier. Notice that the second argument is expected to be a function. (Actually, JavaScript Arrays already have a very useful `forEach` method [documented here](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach), but just as an illustration ..).

	function each(collection, func) {
	    for (var i = 0; i < collection.length; i++) {
	        func(collection[i]); 
	    }
	}
	
Now we can write code like the following:

	> each(a, console.log);

Note: JavaScript doesn't care much about whether the number of arguments passed is the same as the number expected. Missing arguments are `undefined`. Extra arguments (actually, all arguments) can be accessed using the `arguments` object (which works like an array).

**Next step:** Read more about [functions](https://developer.mozilla.org/en/JavaScript/Guide/Functions) in JavaScript.

## Objects

Object oriented, but in a different than we are used to. One key difference is that JavaScript is prototype based rather than class based. An object is a container for named values and feels like a HashMap from Java. Here is a simple object literal (simply pairs of property names and associated values):

	> var car = {make:'toyota', model:'corolla'};
	> car.make;
	> car['make']; // other way to access properties
	> car.make = 'honda'; // can change properties
	> car['make'] = 'honda';
	> car.year = 1996; // can add new properties

But what about methods? We simply have properties that are functions. A special variable `this` is available in such functions for accessing properties. 

    > car.dump = function() {console.log(this.make + " - " this.model)};

What about making a bunch of similar objects? In Java a class can be used as a mechanism for creating objects of a certain "type". In Java a constructor can be used to give different objects' (instances) properties (fields in Java) different values. For example, here we create two car objects with different makes and models:

	Car c1 = new Car("toyota", "corolla");
	Car c2 = new Car("honda", "accord");
	c1.getMake(); // returns "toyota". How?
	c2.getMake(); // returns "honda"

How do we do something similar in JavaScript? Before I answer, what do you think this will return?

    > typeof false
	> typeof Boolean // or Number or String, ...
	> typeof Object

So these entities are functions! Constructor functions to be precise. In the following code, the Car function and the `new` operator are used to create "Car" objects. When a function is used in this way, it is implicitly passed a `this` which is a reference to the newly created object. The constructor function's `prototype` object is the place to put properties that are shared between all instances. 

	function Car(make, model, year) {
	    // specific to one instance ...
	    this.make = make;
	    this.model = model;
	    this.year defineyeacreate an age property here in the constructor function, but that would create a different age method for each car I created. 

	Car.prototype.age = function() {
	    age : function() {
	        var current_year = (new Date).getFullYear();
	        return current_year - this.year;
	    }
	}

	var c1 = new Car('toyota', 'corolla', 1996);
	var c2 = new Car('honda', 'accord', 2010);

	c1.age(); // -> 15
	c2.age(); // -> 1

The obvious question then is how does the method lookup work in JavaScript? At runtime, how is the method `age` found? Well, when an object is created using the new operator and the constructor function `f` (i.e., `new f()`) the following steps are taken:

1. A new object is created (we'll call it `o`).
2. This assignment `o.__proto__ = f.prototype` is made 
3. The function `f` is called with `this` bound to `o`

Now when a method `m` is called on a receiver object `o` the following lookup happens

1. Look for `m` in the properties of object `o`, if found call it.
2. Look for `m` in the properties of the object `o.__proto__`, if found call it.
3. Look for `m` in the properties of the object `o.__proto__.__proto__`, if found call it.
4. etc

This process continues until `m` is found or until an object's `__proto__` is `null`. Regardless of where the method is found, when it is called, `this` will be a reference to the original receiving object. Now try tracing the call `c1.age()` in the above code.

**Next step:** Read more about [working with objects in JavaScript](https://developer.mozilla.org/en/JavaScript/Guide/Working_with_Objects).

## Exercise

In C like languages (such as JavaScript) we often write for loops such as:

	for (i=0; i<n; i++) {
	    // ...
	}

Such for loops work fine though it can be error prone as it is easy to be off by one. The first goal of this exercise is to write a function (`times`) that will take the place of such a loop. Specifically, the function will take two arguments, a number `n` and a function `f`, then calls `f` `n` times. When `f` is called it is passed an iteration number. 

	var count = 4
	times(count, function(i) {
		// ...
	})

Once we have implemented the `times` function, the next step is create a `times` method that can be called on any numbers object.

	count.times(function(i) {
		// ...
	})
	
Below is my solution to this exercise, but you may want to try it yourself first. Once you have implemented the `times` function and the `times` method, give [this exercise](../exercises/functions.html) a try.

	// times function
	function times(n, f) {
	    for (i=0; i<n; i++)
	        f(i)
	}

	// times method (just calls the times function)
	Number.prototype.times = function(f) {
	    return times(this, f)
	}
