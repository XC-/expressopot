/**
 * Created by Aki Mäkinen on 20.3.2016.
 */
const _ = require('lodash');

const UNSUPPORTED_SETTING = 'Unsupported setting or property';

const SUPPORTED_VIEWS_SETTINGS = {
  'path': 'views',
  'engine': ' view engine'
};

const SUPPORTED_ENVS = [
  'production',
  'development'
];

function logUnsupported(property, setting) {
  console.warn(UNSUPPORTED_SETTING  + ': ' + property + (setting ? '.' + setting : '') + '\n');
}

function expressopot(app, config) {
  if (typeof config !== 'object' || config === null) throw new TypeError('Configuration must be an object.');
  _.forOwn(config, function(v, property) {
    switch (property) {
      case 'views':
        for (var setting in config.views) {
          if (Object.keys(SUPPORTED_VIEWS_SETTINGS).indexOf(setting) > -1) {
            app.set(SUPPORTED_VIEWS_SETTINGS[setting], config.views[setting]);
          } else {
            logUnsupported(property, setting);
          }
        }
        break;
      case 'middleware':
        _.forOwn(config.middleware, function(middleware, mw_key) {
          switch (mw_key) {
            case ('pre' || 'post'):
              _.forEach(middleware, function(value) {
                app.use(value);
              }) ;
              break;

            case 'http_errors':
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
              break;

            case 'parameters':
              _.forOwn(middleware, function(val, key) {
                app.param(key, val);
              });
              break;

            default:
              break;
          }
        });
        break;
      case 'routes':
        for (var route in config.routes) {
          if (config.routes.hasOwnProperty(route)) {
            app.use(route, config.routes[route]);
          }
        }
        break;

      case 'locals':
        if (typeof config.locals !== 'object') throw new TypeError('\'locals\' must be an object.');
        app.locals = config.locals;
        break;

      default:
        logUnsupported(property);
        break;
    }
  });
  return app;
}

module.exports = expressopot;
