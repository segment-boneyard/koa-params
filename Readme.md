
# koa-params

  Add express style [params](http://expressjs.com/api.html#app.param)
support to [koa-route](https://github.com/koajs/route).

  [![build status](https://secure.travis-ci.org/segmentio/koa-params.png)](http://travis-ci.org/segmentio/koa-params)

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

param('user', function*(id){
  var user = users[id];
  if (!user) this.throw(404);
  this.user = user;
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

  When a route contains `:param`, call `fn` with its value. Wait for it to finish before continuing with the real route handler.

  You can register multiple `fns` per `param`, just as with express.

## License

  MIT
