//     (c) 2012 J. Thomas Martin
//     Smartmatch.js is freely distributable under the MIT license.
//     Portions of Smartmatch.js are inspired or borrowed from Underscore.js, 
//     as well as Perl's smartmatch operator.

(function() {

  // Establish the root object, `window` in the browser, or `global` on the server.      
  var root = this;

  var _ = root._;
  // Require Underscore if we're on the server and it's not already present.
  if (_ === void 0) {
    if (require !== void 0) _ = require('underscore');
    else throw new Error('Smartmatch.js requires Underscore.js');
  }

  // Create a reference for speed access to `toString`.
  var toString = Object.prototype.toString;

  function isFalsey(obj) { return obj === null || obj === void 0 || obj === ''; }
  function gte(x, y) { return isFalsey(y) || x >= y; }
  function lt(x, y) { return isFalsey(y) || x < y; }
  // Check whether object is within left-closed, right-open interval.
  // Undefined, null, and empty string values unbound the interval.
  function isWithin(obj, array) { return gte(obj, array[0]) && lt(obj, array[1]); }

  // Check whether at least one item in `array` smartmatches with `obj`.
  function anyMatch(array, obj) {
    return _(array).any(function(item) { return smartmatch(obj, item); });
  }

  function arrayMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Function]': return !!y(x);
      case '[object Number]':   return x.length === 2 ? isWithin(y, x) : anyMatch(x, y);
      default:                  return anyMatch(x, y);
    }
  }

  function functionMatch(x, y) {
    return !!x(y);
  }

  function regExpMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return _(x).isEqual(y);
      default:                  return x.test(y);
    }
  }

  function numberMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return y.length === 2 ? isWithin(x, y) : anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return y.test(x);
      default:                  return _(x).isEqual(y);
    }
  }

  function stringMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return y.test(x);
      default:                  return _(x).isEqual(y);
    }
  }

  function defaultMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      default:                  return _(x).isEqual(y);
    }
  }

  // Core smartmatch function.
  function smartmatch(x, y) {
    switch(toString.call(x)) {
      case '[object Array]':    return arrayMatch(x, y);
      case '[object Function]': return functionMatch(x, y);
      case '[object RegExp]':   return regExpMatch(x, y);
      case '[object Number]':   return numberMatch(x, y);
      case '[object String]':   return stringMatch(x, y);
      default:                  return defaultMatch(x, y);
    }
  }

  // Export `smartmatch`.  If we're in the browser, add `smartmatch` as
  // a global object via a string identifier.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = smartmatch;
    }
    exports.smartmatch = smartmatch;
  } else {
    root['smartmatch'] = smartmatch;
  }

}).call(this);