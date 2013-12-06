/*
** © 2013 by Philipp Dunkel <pip@pipobscure.com>. Licensed under MIT-License.
*/
/*jshint node:true, browser:false*/
'use strict';

var Lab = require('lab');
var Joi = require('joi');
var Stagger = require('../');

var testData = new Buffer('testdata');

Lab.experiment('stagger tests', function() {
  var stores = [
    { data:{}, get:get, set:set, list:list, remove:remove },
    { data:{}, get:get, set:set, list:list, remove:remove },
    { data:{ 'test2':new Buffer('some other data that is only in the third store') }, get:get, set:set, list:list, remove:remove }
  ];
  var stagger = new Stagger(stores, { writeDepth:2, removeDepth:2 });
  Lab.test('write', function(done) {
    stagger.set('test1', testData, function(err) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(stores[0].data.test1).to.eql(testData);
      Lab.expect(stores[1].data.test1).to.eql(testData);
      Lab.expect(!stores[2].data.test1).to.equal(true);
      done();
    });
  });
  Lab.test('fetch', function(done) {
    stagger.get('test1', function(err, val) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(val).to.eql(testData);
      done();
    });
  });
  Lab.test('list', function(done) {
    stagger.list('test', function(err, val) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(!Joi.validate(val, {
        count:Joi.number().integer().min(2).max(2),
        values:Joi.array().length(2)
      })).to.equal(true);
      done();
    });
  });
  Lab.test('fetch-secondary', function(done) {
    stagger.get('test2', function(err, val) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(val).to.eql(stores[2].data.test2);
      Lab.expect(!stores[0].data.test2).to.equal(true);
      Lab.expect(!stores[1].data.test2).to.equal(true);
      done();
    });
  });
  Lab.test('fetch-percolate', function(done) {
    stagger.percolate = true;
    stagger.get('test2', function(err, val) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(val).to.eql(stores[0].data.test2);
      Lab.expect(val).to.eql(stores[1].data.test2);
      Lab.expect(val).to.eql(stores[2].data.test2);
      done();
    });
  });
  Lab.test('remove', function(done) {
    stagger.remove('test2', function(err) {
      Lab.expect(!err).to.equal(true);
      Lab.expect(!stores[0].data.test2).to.equal(true);
      Lab.expect(!stores[1].data.test2).to.equal(true);
      Lab.expect(!stores[2].data.test2).to.equal(false);
      Lab.expect(stores[2].data.test2).to.be.an('object');
      done();
    });
  });
});

function get(name, cb) {
  /*jshint validthis:true*/
  setImmediate(cb.bind(null, null, this.data[name]));
}
function set(name, value, cb) {
  /*jshint validthis:true*/
  this.data[name]=value; setImmediate(cb.bind(null, null));
}
function list(name, cb) {
  /*jshint validthis:true*/
  var d = Object.keys(this.data).filter(function(item) { return item.indexOf(name)===0; });
  setImmediate(cb.bind(null, null, { count:d.length, values:d }));
}
function remove(name, cb) {
  /*jshint validthis:true*/
  delete this.data[name];
  setImmediate(cb.bind(null, null));
}
