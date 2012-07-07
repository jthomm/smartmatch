//     (c) 2012 J. Thomas Martin
//     Smartmatch.js is freely distributable under the MIT license.
//     Portions of Smartmatch.js are inspired or borrowed from Underscore.js.

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

  // Core smartmatch function.
  function smartmatch(x, y) {
    switch(toString.call(x)) {
      case '[object Array]':
        return _(y).isFunction() ? !!y(x) :
               _(y).isNumber() && x.length === 2 ? isWithin(y, x) : anyMatch(x, y);
      case '[object Function]':
        return !!x(y);
      case '[object RegExp]':
        return _(y).isArray() ? anyMatch(y, x) :
               _(y).isFunction() ? !!y(x) :
               _(y).isNumber() || _(y).isString() ? x.test(y) : _(x).isEqual(y);
      case '[object Number]':
        return _(y).isArray() ? y.length === 2 ? isWithin(x, y) : anyMatch(y, x) :
               _(y).isFunction() ? !!y(x) :
               _(y).isRegExp() ? y.test(x) : _(x).isEqual(y);
      case '[object String]':
        return _(y).isArray() ? anyMatch(y, x) :
               _(y).isFunction() ? !!y(x) :
               _(y).isRegExp() ? y.test(x) : _(x).isEqual(y);
      default:
        return _(y).isArray() ? anyMatch(y, x) :
               _(y).isFunction() ? !!y(x) : _(x).isEqual(y);
    }
  }

  // Export `smartmatch`.  If we're in the browser, add `smartmatch` as
  // a global object via a string identifier.
  if (exports !== void 0) {
    if (module !== void 0 && module.exports) exports = module.exports = smartmatch;
    exports.smartmatch = smartmatch;
  } else {
    root['smartmatch'] = smartmatch;
  }

}).call(this);
