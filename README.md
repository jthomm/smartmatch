# Smartmatch.js

`smartmatch` is an overloaded equality function for JavaScript.

## Examples

The following examples return true:

```js
// Normal comparison
smartmatch('I got it!', 'I got it!');

// At least one item in the array smartmatches the second argument
smartmatch(['Jenny', '867-5309', 'I got it!'], 'I got it!');

// RegExp comparison
smartmatch(['Jenny', '867-5309', 'I got it!'], /\d{3}-\d{4}/);

// Common keys smartmatch each other
smartmatch({name: 'Jenny', number: '867-5309'}, {number: /\d{3}-\d{4}/});

// Probably...
smartmatch('Jenny', function(name) { return bayes.classify(name) === 'female'; });
```

## Behavior

The below table loosely summarizes `smartmatch`'s behavior:

<table>
  <thead>
    <tr>
      <th></th>
      <th>arr</th>
      <th>func</th>
      <th>re</th>
      <th>num</th>
      <th>str</th>
      <th>other</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>arr</b></td>
      <td>any</td>
      <td>func(arr)</td>
      <td>any</td>
      <td>any/interval</td>
      <td>any</td>
      <td>any</td>
    </tr>
    <tr>
      <td><b>func</b></td>
      <td>func(arr)</td>
      <td>func(func)</td>
      <td>func(re)</td>
      <td>func(num)</td>
      <td>func(str)</td>
      <td>func(other)</td>
    </tr>
    <tr>
      <td><b>re</b></td>
      <td>any</td>
      <td>func(re)</td>
      <td>regExpEq</td>
      <td>re.test(num)</td>
      <td>re.test(str)</td>
      <td>re.test(other)</td>
    </tr>
    <tr>
      <td><b>num</b></td>
      <td>any/interval</td>
      <td>func(num)</td>
      <td>re.test(num)</td>
      <td>numberEq</td>
      <td>false</td>
      <td>false</td>
    </tr>
    <tr>
      <td><b>str</b></td>
      <td>any</td>
      <td>func(str)</td>
      <td>re.test(str)</td>
      <td>false</td>
      <td>stringEq</td>
      <td>false</td>
    </tr>
    <tr>
      <td><b>other</b></td>
      <td>any</td>
      <td>func(other)</td>
      <td>re.test(other)</td>
      <td>false</td>
      <td>false</td>
      <td>misc/deep</td>
    </tr>
  </tbody>
</table>