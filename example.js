var koa = require('koa');
var route = require('koa-route')
var paramify = require('./');

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