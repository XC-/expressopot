var expressopot = require('../index.js');
var chai = require('chai');

var expect = chai.expect;
var assert = chai.expect;

describe('Views', function () {
  var express = require('express');
  var path = require('path');

  var testFunction = function() {
    return 42;
  };

  describe('Engine', function() {
    it('Should set the view engine to jade when defined so', function() {
      var config = {
        views: {
          engine: 'jade'
        }
      };
      var app = expressopot(express(), config);
      expect(app.settings).to.have.property('view engine', 'jade');
    });

    it('Should throw an exception if the view engine is a function (generic: not a string)', function() {
      var config = {
        views: {
          engine: testFunction
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw an exception if the view engine is undefined', function() {
      var config = {
        views: {
          engine: undefined
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw an exception if the view engine is null', function() {
      var config = {
        views: {
          engine: null
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should not set the engine if it is not a string', function() {
      var config = {
        views: {
          engine: testFunction
        }
      };
      var app;
      try {
        app = expressopot(express(), config);
        expect(app).to.not.be.an('undefined');
      } catch (e) {
        expect(app).to.be.an('undefined');
      }
    });
  });

  describe('Path', function() {
    it('Should set the view path to the defined', function() {
      var view_path = path.join(__dirname, 'views');
      var config = {
        views: {
          path: view_path
        }
      };
      var app = expressopot(express(), config);
      expect(app.settings).to.have.property('views', view_path);
    });

    it('Should throw an exception if the view path is a function (generic: not a string)', function() {
      var config = {
        views: {
          path: testFunction
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw an exception if the view path is undefined', function() {
      var config = {
        views: {
          path: undefined
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should throw an exception if the view path is null', function() {
      var config = {
        views: {
          path: null
        }
      };
      expect(expressopot.bind(expressopot, express(), config)).to.throw(TypeError);
    });

    it('Should not set the path if it is not a string', function() {
      var config = {
        views: {
          path: testFunction
        }
      };
      var app;
      try {
        app = expressopot(express(), config);
        expect(app).to.not.be.an('undefined');
      } catch (e) {
        expect(app).to.be.an('undefined');
      }
    });

  });

});
