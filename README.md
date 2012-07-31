# Smartmatch.js

`smartmatch` is a faux-overloaded equality function for JavaScript.

### What does it do?

It allows you to compare arbitrary data types to see if they "match".  For example:

```js
// Normal comparison
smartmatch('I got it!', 'I got it!');

// At least one item in the array smartmatches the second argument
smartmatch(['Jenny', '867-5309', 'I got it!'], 'I got it!');

// RegExp comparison
smartmatch(['Jenny', '867-5309', 'I got it!'], /\d{3}-\d{4}/);

// Common keys smartmatch each other
smartmatch({name: 'Jenny', number: '867-5309', date: new Date(1981, 10, 16)}, {date: '16-Nov-1981'});

// Probably...
smartmatch('Jenny', function (name) { return bayes.classify(name) === 'female'; });
```

### How does it work?

Since JavaScript does not support type checking by default, `smartmatch` does it at run time.  It then routes your query to a sensible comparison function.  That's it.  (See [below](https://github.com/jthomm/smartmatch#behavior-table) for a table of comparison functions it uses.)

### How slow is that?

Based on an [unscientific investigation](http://jsperf.com/smartmatch-vs-direct-comparison/2), `smartmatch` performs anywhere from 3-5 times slower than direct comparison on a mixed bag of type combinations -- less than one order of magnitude.

So, it's decently fast but not necessarily appropriate for high performance applications.

### Why would I use it?

A straightforward use case might be finding objects inside of a collection.  Suppose, for example, you had a collection of objects about NFL running backs:

```js
var rbs = [
  {name: 'Arian Foster', age: 25, team: 'HOU', ypc: 4.7},
  {name: 'Ray Rice', age: 25, team: 'BAL', ypc: 4.6},
  {name: 'LeSean McCoy', age: 24, team: 'PHI', ypc: 4.8},
  {name: 'Ryan Mathews', age: 24, team: 'SD', ypc: 4.7},
  {name: 'Chris Johnson', age: 26, team: 'TEN', ypc: 4.8},
  {name: 'Maurice Jones-Drew', age: 27, team: 'JAC', ypc: 4.6},
  {name: 'Matt Forte', age: 26, team: 'CHI', ypc: 4.2},
  {name: 'DeMarco Murray', age: 22, team: 'DAL', ypc: 5.5},
  {name: 'Roy Helu', age: 23, team: 'WAS', ypc: 4.2},
  {name: 'DeAngelo Williams', age: 29, team: 'CAR', ypc: 5.1}
];
```

Then you could easily check and see whether any of them average more than 5 yards-per-carry:

```js
smartmatch(rbs, {ypc: function (ypc) { return ypc > 5; }}); // true
```

...or find all running backs in the NFC East with cool names:

```js
var query = {name: /^[A-Z][a-z]+[A-Z]/, team: ['NYG', 'WAS', 'DAL', 'PHI']}, i = rbs.length, rb;

while (i--) {
  rb = rbs[i];
  if (smartmatch(rb, query)) {
    console.log(rb);
  }
}

// {name: 'DeMarco Murray', age: 22, team: 'DAL', ypc: 5.5}
// {name: 'LeSean McCoy', age: 24, team: 'PHI', ypc: 4.8}
```

## Behavior Table

If `smartmatch(x, y)`, the first column denotes `x`'s type and the top row denotes `y`'s:

```js
+----------+-------------------------------+-----------+--------------+--------------+
|          | Function                      | Array     | Object       | RegExp       |
+----------+-------------------------------+-----------+--------------+--------------+
| Function | x.toString() === y.toString() | !!x(y)    | !!x(y)       | !!x(y)       |
| Array    | !!y(x)                        | all(x, y) | any(x, y)    | any(x, y)    |
| Object   | !!y(x)                        | any(y, x) | values(x, y) | false        |
| RegExp   | !!y(x)                        | any(y, x) | false        | srcCmp(x, y) |
| String   | !!y(x)                        | any(y, x) | false        | y.test(x)    |
| Date     | !!y(x)                        | any(y, x) | false        | y.test(x)    |
| Number   | !!y(x)                        | any(y, x) | false        | y.test(x)    |
| Other    | !!y(x)                        | any(y, x) | false        | false        |
+----------+-------------------------------+-----------+--------------+--------------+
```
```js
+----------+---------------------+---------------------+-----------------+-----------+
|          | String              | Date                | Number          | Other     |
+----------+---------------------+---------------------+-----------------+-----------+
| Function | !!x(y)              | !!x(y)              | !!x(y)          | !!x(y)    |
| Array    | any(x, y)           | any(x, y)           | any(x, y)       | any(x, y) |
| Object   | false               | false               | false           | false     |
| RegExp   | x.test(y)           | x.test(y)           | x.test(y)       | false     |
| String   | x === y             | +new Date(x) === +y | x === String(y) | false     |
| Date     | +x === +new Date(y) | +x === +y           | +x === +y       | false     |
| Number   | String(x) === y     | +x === +y           | harmEgal(x, y)  | false     |
| Other    | false               | false               | false           | x === y   |
+----------+---------------------+---------------------+-----------------+-----------+
```

...where:

* `all(x, y)` means corresponding elements of `x` and `y` smartmatch one another
* `any(x, y)` means at least one element of `x` smartmatches `y`
* `values(x, y)` means the values of keys that `x` and `y` both have smartmatch one another
* `srcCmp(x, y)` means the source and flags of regexes `x` and `y` are the same
* `harmEgal(x, y)` stands for `x === y ? (x !== 0 || 1 / x === 1 / y) : x !== x && y !== y`

## License

Copyright (c) 2012 J. Thomas Martin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.