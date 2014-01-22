var koa = require('koa');
var request = require('supertest');
var route = require('koa-route');
var paramify = require('./');
var assert = require('assert');

describe('paramify', function(){
  route = paramify(route);
  var param = route.param;
  var get = route.get;
  
  var app = koa();
  
  param('user', function*(id, next){
    if (id == '1') {
      this.user = { name: 'one' };
      yield next;
    } else {
      this.status = 404;
    }
  });
  
  param('user', function*(id, next){
    this.pre = 'lol: ';
    yield next;
  });
  
  app.use(get('/:user', function*(){
    this.body = this.pre + this.user.name;
  }));
  
  it('should work without params', function(done){
    var app = koa();
    var _ = paramify(route);
    app.use(_.get('/', function*(user){
      this.body = 'home';
    }));
    
    request(app.listen())
    .get('/')
    .expect('home', done);
  });
  
  it('should work without param fns', function(done){
    var app = koa();
    var _ = paramify(route);
    app.use(_.get('/:user', function*(user){
      this.body = user;
    }));
    
    request(app.listen())
    .get('/julian')
    .expect('julian', done);
  });
  
  it('should work with param fns', function(done){
    var app = koa();
    var _ = paramify(route);
    _.param('user', function*(id, next){
      this.user = 'julian';
      yield next;
    });
    app.use(_.get('/:user', function*(){
      this.body = this.user;
    }));
    
    request(app.listen())
    .get('/julian')
    .expect('julian', done);
  });
  
  it('should work with multiple params', function(done){
    var app = koa();
    var _ = paramify(route);
    _.param('user', function*(id, next){
      this.user = 'julian';
      yield next;
    });
    _.param('repo', function*(id, next){
      this.repo = 'repo';
      yield next;
    });
    app.use(_.get('/:user/:repo', function*(){
      this.body = this.user + ': ' + this.repo;
    }));
    
    request(app.listen())
    .get('/julian/repo')
    .expect('julian: repo', done);
  });
  
  it('should abort inside param fns', function(done){
    var app = koa();
    var _ = paramify(route);
    _.param('user', function*(id, next){
      this.status = 404;
    });
    app.use(_.get('/:user', function*(){
      this.body = this.user;
    }));
    
    request(app.listen())
    .get('/julian')
    .expect(404, done);
  });
  
  it('should clone', function(){
    assert(route != paramify(route));
  });
})
