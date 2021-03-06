test('Null', function () {
  ok(smartmatch(null, null), 'vs. Null');
  ok(!smartmatch(null, undefined), 'vs. Undefined');
  ok(!smartmatch(null, false), 'vs. `false`');
  ok(!smartmatch(null, 0), 'vs. `0`');
  ok(smartmatch(null, ['a', 'b', null]), 'vs. Array');
  ok(!smartmatch(null, []), 'vs. `[]`');
  ok(!smartmatch(null, {a: null, null: 1}), 'vs. Object');
  ok(!smartmatch(null, {}), 'vs. `{}`');
});

test('Undefined', function () {
  ok(!smartmatch(undefined, null), 'vs. Null');
  ok(smartmatch(undefined, undefined), 'vs. Undefined');
  ok(!smartmatch(undefined, false), 'vs. `false`');
  ok(!smartmatch(undefined, 0), 'vs. `0`');
  ok(smartmatch(undefined, ['a', 'b', undefined]), 'vs. Array');
  ok(!smartmatch(undefined, []), 'vs `[]`');
  ok(!smartmatch(undefined, {a: undefined, undefined: 1}), 'vs. Object');
  ok(!smartmatch(undefined, {}), 'vs. `{}`');
});

test('Boolean', function () {
  ok(!smartmatch(false, null), 'vs. Null');
  ok(!smartmatch(false, undefined), 'vs. Undefined');
  ok(smartmatch(false, false), 'vs. `false`');
  ok(smartmatch(true, true), 'vs. `true`');
  ok(!smartmatch(false, 0), 'vs. `0`');
  ok(smartmatch(false, ['a', 'b', false]), 'vs. Array');
  ok(!smartmatch(false, []), 'vs `[]`');
  ok(!smartmatch(false, {a: false, false: 1}), 'vs. Object');
  ok(!smartmatch(false, {}), 'vs. `{}`');
});

test('String', function () {
  function endsWithPie(string) { return string.slice(-3) === 'Pie'; }

  ok(!smartmatch('', null), 'vs. Null');
  ok(!smartmatch('', undefined), 'vs. Undefined');
  ok(!smartmatch('', false), 'vs. `false`');
  ok(smartmatch('a', 'a'), 'vs. String');
  ok(smartmatch('3.14', 3.14), 'vs. Number');
  ok(!smartmatch('', 0), '`\'\'` vs. `0`');
  ok(smartmatch('3/28/1987', new Date(1987, 2, 28)), 'vs. Date');
  ok(smartmatch('Mississippi', /([a-z]([a-z])\1)\2/), 'vs. RegExp');
  ok(smartmatch('a', ['a', 'b', 'hi']), 'vs. Array');
  ok(!smartmatch('', []), 'vs `[]`');
  ok(!smartmatch('a', {1: 'a', a: 1}), 'vs. Object');
  ok(!smartmatch('', {}), 'vs. `{}`');
  ok(smartmatch('Custard Pie', endsWithPie), 'vs. Function');
});

test('Number', function () {
  var inf = 1/0
    , negInf = -1/0
    , zero = 1/inf
    , negZero = 1/negInf
    , date = new Date(1987, 2, 28)
    , dateNumber = +date
  ;
  function isLessThanPi(number) { return number < Math.PI; }

  ok(!smartmatch(0, null), 'vs. Null');
  ok(!smartmatch(0, undefined), 'vs. Undefined');
  ok(!smartmatch(0, false), 'vs. `false`');
  ok(smartmatch(3.14, '3.14'), 'vs. String');
  ok(!smartmatch(0, ''), 'vs. `\'\'`');
  ok(smartmatch(2/0, inf), 'vs. `Infinity`');
  ok(smartmatch(-2/0, negInf), 'vs. `-Infinity`');
  ok(!smartmatch(inf, negInf), '`Infinity` vs. `-Infinity`');
  ok(smartmatch(0, zero), 'vs. `0`');
  ok(smartmatch(-0, negZero), 'vs. `-0`');
  ok(!smartmatch(zero, negZero), '`0` vs. `-0`');
  ok(smartmatch(1/'a', 1/'b'), 'vs. `NaN`');
  ok(smartmatch(911, /(\d)\1/), 'vs. RegExp');
  ok(smartmatch(dateNumber, date), 'vs. Date');
  ok(smartmatch(3.14, ['a', 'b', 3.14]), 'vs. Array');
  ok(!smartmatch(0, []), 'vs. `[]`');
  ok(!smartmatch(3.14, {a: 3.14, 3.14: 'b'}), 'vs. Object');
  ok(!smartmatch(0, {}), 'vs. `{}`');
  ok(smartmatch(3.14, isLessThanPi), 'vs. Function');
});

test('Date', function () {
  var date = new Date(1987, 2, 28)
    , dateNumber = +date
  ;
  function is20thCentury(date) { return date.getFullYear() < 2000; }

  ok(!smartmatch(date, null), 'vs. Null');
  ok(!smartmatch(date, undefined), 'vs. Undefined');
  ok(!smartmatch(date, true), 'vs. Boolean');
  ok(smartmatch(date, '3/28/1987'), 'vs. String 1');
  ok(smartmatch(date, '1987-3-28'), 'vs. String 2');
  ok(smartmatch(date, dateNumber), 'vs. Number');
  ok(smartmatch(date, /^Sat/), 'vs. RegExp');
  ok(smartmatch(date, new Date(1987, 2, 28)), 'vs. Date');
  ok(smartmatch(date, ['a', 'b', new Date(1987, 2, 28)]), 'vs. Array');
  ok(!smartmatch(date, {a: date}), 'vs. Object');
  ok(smartmatch(date, is20thCentury), 'vs. Function');
});

test('RegExp', function () {
  var repeatLetter = /([a-z])\1/;

  ok(!smartmatch(repeatLetter, null), 'vs. Null');
  ok(!smartmatch(/^un/, undefined), 'vs. Undefined');
  ok(!smartmatch(/^f/, false), 'vs. Boolean');
  ok(smartmatch(repeatLetter, 'Mississippi'), 'vs. String');
  ok(smartmatch(/(\d)\1/, 911), 'vs. Number');
  ok(smartmatch(repeatLetter, /([a-z])\1/), 'vs. RegExp 1');
  ok(!smartmatch(repeatLetter, /([a-z])\1/i), 'vs. RegExp 2');
  ok(smartmatch(/^Sat/, new Date(1987, 2, 28)), 'vs. Date');
  ok(smartmatch(repeatLetter, ['a', /\d/, /([a-z])\1/]), 'vs. Array 1');
  ok(smartmatch(repeatLetter, ['a', 'bb', /\d/]), 'vs. Array 2');
});

test('Array', function () {
  var dates = [new Date(1897, 5, 19), new Date(1902, 9, 5), new Date(1903, 9, 22)];

  ok(smartmatch(['a', 'b', null], null), 'vs. Null');
  ok(smartmatch(['a', 'b', undefined], undefined), 'vs. Undefined');
  ok(smartmatch(['a', 'b', false], false), 'vs. Boolean');
  ok(smartmatch(['a', 'b', 'c'], 'c'), 'vs. String');
  ok(smartmatch(['a', 'b', 3], 3), 'vs. Number');
  ok(smartmatch(dates, new Date(1903, 9, 22)), 'vs. Date');
  ok(smartmatch(['a', 'b', /\d/], /\d/), 'vs. RegExp');
  ok(smartmatch(['a', 'b', 'c'], ['a', 'b', 'c']), 'vs. Array');
  ok(smartmatch([{c: 3}, {b: 2}], {a: 1, b: 2}), 'vs. Object');
  ok(smartmatch(['a', 'b', 'c'], function (array) { return array[0] === 'a'; }), 'vs. Function');
});

test('Object', function () {
  ok(!smartmatch({a: 1, b: 2}, null), 'vs. Null');
  ok(!smartmatch({a: 1, b: 2}, undefined), 'vs. Undefined');
  ok(!smartmatch({a: 1, b: 2}, true), 'vs. Boolean');
  ok(!smartmatch({a: 1, b: 2}, 'a'), 'vs. String');
  ok(!smartmatch({a: 1, b: 2}, 1), 'vs. Number');
  ok(!smartmatch({a: 1, b: 2}, new Date(1987, 2, 28)), 'vs. Date');
  ok(!smartmatch({a: 1, b: 2}, /\w/), 'vs. RegExp');
  ok(smartmatch({a: 1, b: 2}, [{c: 3}, {b: 2}]), 'vs. Array');
  ok(smartmatch({a: 1, b: 2}, {a: 1, b: 2}), 'vs. Object');
  ok(smartmatch({a: 1, b: 2}, function (object) { return object.b === 2; }), 'vs. Function');
});

test('Function', function () {
  var isLessThanPiAnon = function (number) { return number < Math.PI; }
    , isLessThanPiTooAnon = function (number) { return number < Math.PI; }
  ;
  function isLessThanPi(number) { return number < Math.PI; }
  function isLessThanPiToo(number) { return number < Math.PI; }
  function lastElemIsPi(array) { return array[array.length - 1] === Math.PI; }
  function hasOwnPie(object) { return object.hasOwnProperty('pie'); }
  function endsWithPie(string) { return string.slice(-3) === 'Pie'; }

  ok(smartmatch(isLessThanPi, null), 'vs. Null');
  ok(!smartmatch(isLessThanPi, undefined), 'vs. Undefined');
  ok(smartmatch(isLessThanPi, true), 'vs. Boolean');
  ok(smartmatch(endsWithPie, 'Pumpkin Pie'), 'vs. String');
  ok(smartmatch(isLessThanPi, 3.14), 'vs. Number');
  ok(smartmatch(lastElemIsPi, ['a', 'b', Math.PI]), 'vs. Array');
  ok(smartmatch(hasOwnPie, {'a': 1, 'b': 2, 'pie': 'yay'}), 'vs. Object');
  ok(!smartmatch(isLessThanPi, isLessThanPiToo), 'vs. Function');
  ok(smartmatch(isLessThanPiAnon, isLessThanPiTooAnon), 'vs. Anonymous Function');
});
