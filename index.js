
/**
 * Module dependencies.
 */

var pathToRegexp = require('path-to-regexp');
var compose = require('koa-compose');
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
      var re = pathToRegexp(path, keys);
      
      return route[method](re, function*(){
        var args = slice.call(arguments);
        var ctx = this;
        
        // outer loop - iterate over params
        var outer = keys
        .filter(function(key){
          return !!fns[key.name];
        })
        .map(function(key, i){
          return function*(next){   
            // inner loop - iterate over param's fns
            var inner = fns[key.name].map(function(_fn){
              return function*(_next){
                debug('resolve %s:%s', key.name, args[i]);
                if (2 == _fn.length) {
                  yield _fn.call(ctx, args[i], _next);
                } else {
                  yield _fn.call(ctx, _next);
                }
              };
            });
            
            inner.push(function*(){
              // param's fns finished, continue with next param
              yield next;
            });
            
            yield compose(inner);
          };
        });
        
        // no param fns, call route fn
        if (!outer.length) return yield fn.apply(ctx, args);
        
        outer.push(function*(_next){
          // all params' fns finished, call route fn
          yield fn.apply(ctx, args);
        });
        
        return yield compose(outer);
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
