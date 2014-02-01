
/**
 * Module dependencies.
 */

var pathToRegexp = require('path-to-regexp');
var debug = require('debug')('koa-params');

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Expose `paramify`.
 */

module.exports = paramify;

/**
 * Paramify `route`.
 *
 * @return {Object}
 * @api public
 */

function paramify(route){
  var ret = {};
  var fns = {};
  
  Object.keys(route).forEach(function(method){
    ret[method] = function(path, fn){
      var keys = [];
      var regexp = pathToRegexp(path, keys);
      
      return route[method](regexp, function*(){
        var args = slice.call(arguments);
        
        for (var i = 0; i < keys.length; i++) {
          var param = keys[i].name;
          var arr = fns[param];
          if (!arr) continue;
          for (var j = 0; j < arr.length; j++) {
            yield arr[j].call(this, args[i]);
          }
        }
        
        yield fn.apply(this, arguments);
      });
    };
  });
  
  /**
   * Add `param` handler `fn`.
   *
   * @param {String} param
   * @param {Function} fn
   * @return {ret}
   * @api public
   */
  
  ret.param = function(param, fn){
    (fns[param] = fns[param] || []).push(fn);
    return ret;
  };
  
  return ret;
}
