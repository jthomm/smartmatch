# Smartmatch.js

`smartmatch` is a faux-overloaded equality function for JavaScript.

## Examples

The following return true:

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

## Faux-verloading

JavaScript does not support type checking by default, so `smartmatch` does it at run time.  Thus, if performance is your top priority, `smartmatch` may not be right for you.

### Performance Tests

Based on an [unscientific investigation](http://jsperf.com/smartmatch-vs-direct-comparison), `smartmatch` performs anywhere from 5-7 times slower than direct comparison on a mixed bag of type combinations -- less than one order of magnitude!  Yay.

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