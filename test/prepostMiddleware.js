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