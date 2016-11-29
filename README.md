# string-template-extractor
#### A reverse version of string substitution from dojo string

### Usage

``` javascript
var extractor = require("string-template-extractor"); //throwable is true

var option = {throws: true};

var template = "First eat ${fruit}, then eat ${anotherFruit}";

var sampleString = "First eat apple, then eat lemon";

// The following method calls are equivalent with the result is
// { fruit: 'apple', anotherFruit: 'lemon' }

extractor(option, template, sampleString);

extractor.parse(option, template, sampleString);

extractor(option)(template)(sampleString); // curry function

extractor.parse(option)(template)(sampleString); // curry function

// option.throws (boolean) required when extractor can not parse the string normally
// true: will throw an error
// false: will return null without throwing error

```

### Installation
In your project path:

	$ npm install string-template-extractor

### Test
	$ npm test
