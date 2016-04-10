/**
 * Created by Aki Mäkinen on 20.3.2016.
 */
const _ = require('lodash');

const UNSUPPORTED_SETTING = 'Unsupported setting or property';

const SUPPORTED_VIEWS_SETTINGS = {
  'path': 'views',
  'engine': 'view engine'
};

const SUPPORTED_ENVS = [
  'production',
  'development'
];

function logUnsupported(property, setting) {
  console.warn(UNSUPPORTED_SETTING  + ': ' + property + (setting ? '.' + setting : '') + '\n');
}

function testIfObject(variable) {
  return (typeof variable === 'object' && variable !== null && !Array.isArray(variable));
}

function expressopot(app, config) {
  if (!testIfObject(config)) throw new TypeError('Configuration must be an object.');
  if (config.middleware && !testIfObject(config.middleware)) throw new TypeError('Configuration must be an object.');

  /*
  Set up the view engine
   */
  if ('views' in config) {
    for (var setting in config.views) {
      if (Object.keys(SUPPORTED_VIEWS_SETTINGS).indexOf(setting) > -1) {
        if (typeof config.views[setting] !== 'string') {
          throw new TypeError('Values in the views portion must be strings.');
        }
        app.set(SUPPORTED_VIEWS_SETTINGS[setting], config.views[setting]);
      } else {
        logUnsupported(property, setting);
      }
    }
  }

  /*
  Set local variables
   */
  if ('locals' in config) {
    if (typeof config.locals !== 'object') throw new TypeError('\'locals\' must be an object.');
    app.locals = config.locals;
  }

  /*
  Set up pre middleware
   */
  if ('middleware' in config && 'pre' in config.middleware) {
    var middleware = config.middleware.pre;
    if (!Array.isArray(middleware)) {
      throw new TypeError('Pre and Post Middleware must be listed in an array.');
    }
    _.forEach(middleware, function(value) {
      if (typeof value !== 'function') throw new TypeError('Middleware must be a function.');
      app.use(value);
    }) ;
  }
  if ('middleware' in config && 'parameters' in config.middleware) {
    var middleware = config.middleware.parameters;
    _.forOwn(middleware, function(val, key) {
      app.param(key, val);
    });
  }

  if ('routes' in config) {
    for (var route in config.routes) {
      if (config.routes.hasOwnProperty(route)) {
        app.use(route, config.routes[route]);
      }
    }
  }

  /*
  Set up post middleware
   */
  if ('middleware' in config && 'post' in config.middleware) {
    var middleware = config.middleware.post;
    if (!Array.isArray(middleware)) {
      throw new TypeError('Pre and Post Middleware must be defined inside an array.');
    }
    _.forEach(middleware, function(value) {
      if (typeof value !== 'function') throw new TypeError('Middleware must be a function.');
      app.use(value);
    }) ;
  }

  /*
  HTTP Error middleware
   */
  if ('middleware' in config && 'http_errors' in config.middleware) {
    var middleware = config.middleware.http_errors;
    _.forOwn(middleware, function(value, key) {
      switch (typeof (value)) {
        case 'object':
          var filtered_keys = Object
            .keys(value)
            .filter(function(val) {
              return SUPPORTED_ENVS.indexOf(val) > -1;
            });
          var len = filtered_keys.length;

          if (len === 1) {
            app.use(value[filtered_keys[0]]);
          } else if (len === 2) {
            if (app.get('env') === 'development') {
              app.use(value.development);
            } else {
              app.use(value.production);
            }
          } else {
            console.warn('No supported settings found in: ' + property + '.' + mw_key + '.' + key);
          }
          break;
        case 'function':
          app.use(value);
          break;
        default:
          logUnsupported(property + '.' + key, key);
      }
    });
  }

  return app;
}

module.exports = expressopot;
