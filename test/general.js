/**
 * Created by xc- on 2.4.2016.
 */
var expressopot = require('../index.js');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.assert;

describe('Expressopot', function () {
  var express = require('express');
  
  it('Should throw a TypeError if the second parameter is a function.', function() {
    var config = function() {
      return 42;
    };
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });
  
  it('Should throw a TypeError if the second parameter is undefined', function() {
    var config = undefined;
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });
  
  it('Should throw a TypeError if the second parameter is null', function() {
    var config = null;
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });

  it('Should throw a TypeError if the second parameter is array', function() {
    var config = [1, 2, 3];
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });
  
  it('Should be ok if the configuration is an empty object', function() {
    var config = {};
    var app = expressopot(express(), config);
    expect(app).to.exist;
  });
});