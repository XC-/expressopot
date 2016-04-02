/**
 * Created by xc- on 2.4.2016.
 */
var expressopot = require('../index');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.assert;

var _ = require('lodash');

describe('Middleware', function () {
  var express = require('express');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var logger = require('morgan');
  var path = require('path');
  var middleware = [
    logger('dev'),
    bodyParser.json(),
    cookieParser()
  ];
  var names = function(collection) {
    return _.map(collection, function(val) {
      return val.name;
    });
  };

  it('Should throw a TypeError if the value of middleware is undefined', function() {
    var config = {
      middleware: undefined
    };
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });

  it('Should throw a TypeError if the value of middleware is string', function() {
    var config = {
      middleware: 'Foobar'
    };
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });

  it('Should throw a TypeError if the value of middleware is null', function() {
    var config = {
      middleware: null
    };
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });

  it('Should throw a TypeError if the value of middleware is array', function() {
    var config = {
      middleware: [1, 2, 3]
    };
    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });
  
  describe('Pre', function() {
    it('Should be found from express when defined', function() {
      var config = {
        middleware: {
          pre: middleware
        }
      };
      var app = expressopot(express(), config);
      var app_mw_names = names(app._router.stack);
      expect(app_mw_names).to.include.members(names(middleware));
    });

    it('Should throw a TypeError if the value of "pre" is other than array (string)', function() {
      var config = {
        middleware: {
          pre: 'Foobar'
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw a TypeError if the value of "pre" is other than array (undefined)', function() {
      var config = {
        middleware: {
          pre: undefined
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw a TypeError if the value of "pre" is other than array (null)', function() {
      var config = {
        middleware: {
          pre: null
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });
    
    it('Should throw a TypeError if the value of "pre" is other than array (object)', function() {
      var config = {
        middleware: {
          pre: {
            foo: 'bar'
          }
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });
    
    it('Should be ok if the pre is an empty object', function() {
      var config = {
        middleware: {}
      };
      var app = expressopot(express(), config);
      expect(app).to.exist;
    });
  });
  
  describe('Post', function() {
    it('Should be found from express when defined', function() {
      var config = {
        middleware: {
          post: middleware
        }
      };
      var app = expressopot(express(), config);
      var app_mw_names = names(app._router.stack);
      expect(app_mw_names).to.include.members(names(middleware));
    });
  });
});