
# koa-params

  Add express style [params](http://expressjs.com/api.html#app.param)
support to [koa-route](https://github.com/koajs/route).

## Example

```js
var koa = require('koa');
var route = require('koa-route')
var paramify = require('koa-params');

route = paramify(route);
var param = route.param;
var get = route.get;

var app = koa();

// fake db
var users = {
  'julian': { name: 'Julian Gruber', fun: true },
  'badguy': { name: 'Bad Guy', fun: false }
};

param('user', function*(id, next){
  var user = users[id];
  if (!user) return this.status = 404;
  this.user = user;
  yield next;
});

app.use(get('/', function*(){
  this.body = Object.keys(users);
}));

app.use(get('/:user', function*(){
  this.body = this.user;
}));

app.listen(3000);
```

## Installation

```bash
$ npm install koa-params
```

## API

### paramify(route)

  Return a cloned version of `route` with http verbs patched and added `.param`.

### route.param(param, fn)

  When a route contains `:param`, call `fn` with its value and wait for it to
yield until the real route handler is called - unless you don't yield and the
response ends.

  You can register multiple `fns` per `param`, just as with express.

## License

  MIT
