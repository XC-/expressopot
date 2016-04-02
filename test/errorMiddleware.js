/**
 * Created by xc- on 2.4.2016.
 */
var expressopot = require('../index');
var chai = require('chai');
var _ = require('lodash');

var expect = chai.expect;
var assert = chai.assert;

function error404(req, res, next) {
  next(new Error('Not Found'));
}

function error500dev(err, req, res, next) {
  var foo = 'bar';
}

function error500pro(err, req, res, next) {
  var bar = 'foo'
}

var names = function(collection) {
  return _.map(collection, function(val) {
    return val.name;
  });
};

const environments = {
  production: null,
  development: null
};

describe('HTTP Errors', function () {
  var express = require('express');

  it('Should include error handlers', function() {
    var config = {
      middleware: {
        http_errors: {
          404: error404,
          500: error500dev
        }
      }
    };
    var error_mw_names = [error404.name, error500dev.name];
    var app = expressopot(express(), config);
    expect(names(app._router.stack)).to.include.members(error_mw_names);
  });

  it('Should include error handlers according to environment', function() {
    var config = {
      middleware: {
        http_errors: {
          404: error404,
          500: {
            development: error500dev,
            production: error500pro
          }
        }
      }
    };
    var test_environments = _.cloneDeep(environments);
    test_environments.development = [error404.name, error500dev.name];
    test_environments.production = [error404.name, error500pro.name];
    _.forEach(test_environments, function(e_names, env) {
      var app = express();
      app.set('env', env);
      app = expressopot(app, config);
      expect(names(app._router.stack)).to.include.members(e_names);
    });
  });
});