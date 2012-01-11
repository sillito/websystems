---
title: JavaScript Functions and Methods
layout: default
---

Implement the following four JavaScript functions.

**`time_between_in_words`**`(from_date, to_date)`

Returns a [`String`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) describing the approximate amount of time that has elapsed between the `from_date` to the `to_date`. This description is human readable (e.g., '1 minute', '2 minutes', or '2 weeks').

_Parameters:_

* `from_date` - a [`Date`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date) object to use as the start time
* `to_date` - a [`Date`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date) object to use as the end time

_Example:_

	> time_between_in_words(d1,d2)
	"2 hours"
	
**`time_ago_in_words`**`(date)`

Like `time_between_in_words`, except that `to_date` is set to now.

_Parameters:_

* date - a [`Date`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date) object 

_Example:_

	> time_ago_in_words(new Date())
	"a moment"

**`substitute`**`(template, replacements)`

Returns a new [`String`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) that is the result of substituting values into a template. Any variables in the template (indicated by curly brackets) are replaced with values from the replacements object. Hint: have a look at [`RegEx`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp) support in JavaScript.

_Parameters:_

* `template` - a [`String`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) to use as the template

* `replacements` - an [`Object`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object) with values to substitute into the template

_Example:_

	> substitute('Hello {{"{{name"}}}}. The time is {{"{{time"}}}}', {name:'Jim'})
	"Hello Jim. The time is {{"{{time"}}}}"	

**`open_and_substitute`**`(template_filename, replacements, cb)`

Like the above substitute function, but reads the template [String](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) from a file.

_Parameters:_

* `template_filename` - a [`String`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) with the name of the file to open

* `replacements` - an [`Object`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object) with values to substitute into the template

_Example:_

	> open_and_substitute("path/to/template.txt", {name:'Jim'})
	"Hello Jim. The time is {{time}}"
	
	
## Implement JavaScript methods

_Hint:_ the implementations of the following methods should be fairly simple calls to the above functions.

Add a `time_between_in_words` method and a `time_ago_in_words` method to all `Date` objects. This method will be able to be called as follows:

	var date1 = new Date(), date2 = new Date();
	date1.time_ago_in_words();
	date2.time_between_in_words(date1);

Add a `substitute` method to all [`String`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String) objects.

	'Hello {{"{{name"}}}}. The time is {{"{{time"}}}}'.substitute({name:'Jim'});

## Test the Above

Create a node script that tests the four functions and three methods you created above. Use the [`Assert` module](http://nodejs.org/docs/v0.4.12/api/assert.html) to help you write your tests. 

	> node tests.js
