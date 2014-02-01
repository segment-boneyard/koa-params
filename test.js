var koa = require('koa');
var request = require('supertest');
var route = require('koa-route');
var paramify = require('./');
var assert = require('assert');

describe('paramify', function(){
  route = paramify(route);
  
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
    _.param('user', function*(id){
      this.user = id;
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
    _.param('user', function*(id){
      this.user = id;
    });
    _.param('repo', function*(id){
      this.repo = id;
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
    _.param('user', function*(id){
      this.throw(404);
    });
    app.use(_.get('/:user', function*(){
      this.body = this.user;
    }));
    
    request(app.listen())
    .get('/julian')
    .expect(404, done);
  });
  
  it('should accept middleware', function(done){
    var app = koa();
    var _ = paramify(route);
    _.param('user', function*(id){
      this.user = id;
    });
    _.param('user', function*(){
      this.user = this.user.toUpperCase();
    });
    app.use(_.get('/:user', function*(){
      this.body = this.user;
    }));
    
    request(app.listen())
    .get('/julian')
    .expect('JULIAN', done);
  });
  
  it('should clone', function(){
    assert(route != paramify(route));
  });
})
