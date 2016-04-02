/**
 * Created by xc- on 2.4.2016.
 */
var expressopot = require('../index');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.expect;

describe('Locals', function() {
  var express = require('express');

  it('should contain locals when they are defined in the configuration file', function() {
    var config = {
      locals: {
        testString: "String",
        testNumber: 1138,
        testFunction: function() { return "Foobar"; }
      }
    };

    var app = expressopot(express(), config);
    expect(app.locals).to.deep.equal(config.locals);
    expect(app.locals.testString).to.equal(config.locals.testString);
    expect(app.locals.testNumber).to.equal(config.locals.testNumber);
    expect(app.locals.testFunction()).to.equal(config.locals.testFunction());
  });

  it('should throw an exception if the locals is not an object', function() {
    var config = {
      locals: function() { return 42; }
    };

    expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
  });
});
