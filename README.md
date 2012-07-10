# Smartmatch.js

A half-assed decent "smart matching" utility for JavaScript.  Requires [Underscore.js](https://github.com/documentcloud/underscore).

## What it Does

`smartmatch` compares its arguments "polymorphically", determining the appropriate comparison mechanism based on its arguments' types.  The following examples return true:

```js
// Direct comparison
smartmatch('I got it!', 'I got it!');

// At least one item in the array smartmatches the second argument
smartmatch(['Jenny', '867-5309', 'I got it!'], 'I got it!');

// RegExp comparison
smartmatch(['Jenny', '867-5309', 'I got it!'], /\d{3}-\d{4}/);

// At least one item in the first array smartmatches at least one item in the second
smartmatch(
  [{'Sir Mix-a-Lot': '649-2568'}, {'Jenny': '867-5309'}, {'Emergency': '911'}],
  [{'Jenny': '867-5309'}, {'Information': '311'}]
);

// Probably...
smartmatch('Jenny', function(name) { return bayes.classify(name) === 'female'; });
```

`smartmatch` applies itself recursively if one of its arguments is an array, except in the following case:

```js
// pi is at least 0 and less than 10
smartmatch(3.14159, [0, 10]);
```

If one of the arguments is a number and the array argument is 2 elements long, `smartmatch` treats the array as a left-closed, right-open interval and checks whether the number is within that interval.  In addition, if either element of the array is null, undefined, or an empty string, the interval is treated as unbounded.  This is useful for quick gt, gte, lt, lte comparisons:

```js
// Did Tommy Tutone have more than one song hit the Top-40?
smartmatch(tutoneHits, [2, null]);
```

## How it Works

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
      <th>else</th>
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
      <td>func(else)</td>
    </tr>
    <tr>
      <td><b>re</b></td>
      <td>any</td>
      <td>func(re)</td>
      <td>_.isEqual</td>
      <td>re.test(num)</td>
      <td>re.test(str)</td>
      <td>_.isEqual</td>
    </tr>
    <tr>
      <td><b>num</b></td>
      <td>any/interval</td>
      <td>func(num)</td>
      <td>re.test(num)</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
    </tr>
    <tr>
      <td><b>str</b></td>
      <td>any</td>
      <td>func(str)</td>
      <td>re.test(str)</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
    </tr>
    <tr>
      <td><b>else</b></td>
      <td>any</td>
      <td>func(else)</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
      <td>_.isEqual</td>
    </tr>
  </tbody>
</table>
