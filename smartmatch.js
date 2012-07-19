//     (c) 2012 J. Thomas Martin
//     Smartmatch.js is freely distributable under the MIT license.
//     Portions of Smartmatch.js are inspired or borrowed from Underscore.js, 
//     as well as Perl's smartmatch operator (http://perldoc.perl.org/perlop.html).

(function() {

  // Establish the root object (`window` in the browser, `global` on the server).
  var root = this;

  // Create references for easy access to `toString` and `hasOwnProperty`.
  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;


  // Functions used for interval comparison.
  // ---------------------------------------

  // Interval comparison interprets false-y values as unbounded.
  function isUnbounded(obj) { return obj === null || obj === void 0 || obj === ''; }

  // Intervals are left-closed.
  function gte(x, y) { return isUnbounded(y) || x >= y; }

  // Intervals are right-open.
  function lt(x, y) { return isUnbounded(y) || x < y; }

  // Check whether object is within left-closed, right-open, or unbounded interval.
  function isWithin(obj, array) { return gte(obj, array[0]) && lt(obj, array[1]); }


  // Check whether at least one item in `array` smartmatches with `obj`.
  // -------------------------------------------------------------------
  function anyMatch(array, obj) {
    for (var i=0, n=array.length; i<n; i++) {
      if (smartmatch(obj, array[i])) return true;
    }
    return false;
  }


  // When first argument to `smartmatch` is an array.
  // ------------------------------------------------
  function arrayMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Function]': return !!y(x);
      case '[object Number]':   return x.length === 2 ? isWithin(y, x) : anyMatch(x, y);
      default:                  return anyMatch(x, y);
    }
  }


  // When first argument to `smartmatch` is a function.
  // --------------------------------------------------
  function functionMatch(x, y) { return !!x(y); }


  // When first argument to `smartmatch` is a regular expression.
  // ------------------------------------------------------------
  function regExpEq(x, y) {
    return x.source == y.source &&
           x.global == y.global &&
           x.multiline == y.multiline &&
           x.ignoreCase == y.ignoreCase;
  }

  function regExpMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return regExpEq(x, y);
      default:                  return x.test(y);
    }
  }


  // When first argument to `smartmatch` is a number.
  // ------------------------------------------------
  function numberEq(x, y) { return x != +x ? y != +y : (x == 0 ? 1/x == 1/y : x == +y); }

  function numberMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return y.length === 2 ? isWithin(x, y) : anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return y.test(x);
      case '[object Number]':   return numberEq(x, y);
      default:                  return false;
    }
  }


  // When first argument to `smartmatch` is a string.
  // ------------------------------------------------
  function stringEq(x, y) { return x == String(y); }

  function stringMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      case '[object RegExp]':   return y.test(x);
      case '[object String]':   return stringEq(x, y);
      default:                  return false;
    }
  }


  // Deep comparison between objects and default equivalence handler.
  // Abandons `smartmatch`-ing in favor of common sense equivalence.
  // Closely adapted from Underscore.js' `_.isEqual` function.
  // ----------------------------------------------------------------
  function defaultEq(x, y, stack) {
    if (x === y) return x !== 0 || 1/x == 1/y;
    if (x == null || y == null) return x === y;
    if (x._chain) a = x._wrapped;
    if (y._chain) y = y._wrapped;
    if (x.isEqual && typeof x.isEqual == 'function') return x.isEqual(y);
    if (y.isEqual && typeof y.isEqual == 'function') return y.isEqual(x);
    var className = toString.call(x);
    if (className != toString.call(y)) return false;
    switch (className) {
      case '[object String]': return stringEq(x, y);
      case '[object Number]': return numberEq(x, y);
      case '[object Date]':
      case '[object Boolean]': return +x == +y;
      case '[object RegExp]': return regExpEq(x, y);
    }
    if (typeof x != 'object' || typeof y != 'object') return false;
    var length = stack.length;
    while (length--) {
      if (stack[length] == x) return true;
    }
    stack.push(x);
    var size = 0, result = true;
    if (className == '[object Array]') {
      size = x.length;
      result = size == y.length;
      if (result) {
        while (size--) {
          if (
            !(result = size in x == size in y && defaultEq(x[size], y[size], stack))
          ) break;
        }
      }
    } else {
      if (
        'constructor' in x != 'constructor' in y || x.constructor != y.constructor
      ) return false;
      for (var key in x) {
        if (hasOwn.call(x, key)) {
          size++;
          if (!(result = hasOwn.call(y, key) && defaultEq(x[key], y[key], stack))) break;
        }
      }
      if (result) {
        for (key in y) {
          if (hasOwn.call(y, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    stack.pop();
    return result;
  }


  // When first argument to `smartmatch` is not an array, 
  // a function, a regular expression, a number, or a string.
  // --------------------------------------------------------
  function defaultMatch(x, y) {
    switch(toString.call(y)) {
      case '[object Array]':    return anyMatch(y, x);
      case '[object Function]': return !!y(x);
      default:                  return defaultEq(x, y, []);
    }
  }


  // Core smartmatch function.
  // -------------------------
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

  // Experimental!  If `smartmatch`-ing against the same object many times over
  // (e.g. smartmatch(/(\d)\1/, obj1), smartmatch(/(\d)\1/, obj2), etc.),
  // currying (via smartcurry(/(\d)\1/)) may slightly enhance performance.
  // --------------------------------------------------------------------------
  function smartcurry(x) {
    switch(toString.call(x)) {
      case '[object Array]':    return function(y) { return arrayMatch(x, y); };
      case '[object Function]': return function(y) { return functionMatch(x, y); };
      case '[object RegExp]':   return function(y) { return regExpMatch(x, y); };
      case '[object Number]':   return function(y) { return numberMatch(x, y); };
      case '[object String]':   return function(y) { return stringMatch(x, y); };
      default:                  return function(y) { return defaultMatch(x, y); };
    }
  }

  // Export `smartmatch` and `smartcurry`.  If we're in the browser, add 
  // `smartmatch` and `smartcurry` as a global object via a string identifier.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports.smartmatch = module.exports.smartmatch = smartmatch;
      exports.smartcurry = module.exports.smartcurry = smartcurry;
    }
    exports.smartmatch = smartmatch;
    exports.smartcurry = smartcurry;
  } else {
    root['smartmatch'] = smartmatch;
    root['smartcurry'] = smartcurry;
  }

}).call(this);