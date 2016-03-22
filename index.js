/**
 * Created by Aki Mäkinen on 20.3.2016.
 */

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
  for (var property in config) {
    if (config.hasOwnProperty(property)) {
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
          for(var i = 0; i < config.middleware.length; i ++) {
            app.use(config.middleware[i]);
          }
          break;
        case 'routes':
          for (var route in config.routes) {
            if (config.routes.hasOwnProperty(route)) {
              app.use(route, config.routes[route]);
            }
          }
          break;
        case 'http_errors':
          for (var status in config.http_errors) {
            if (config.http_errors.hasOwnProperty(status)) {
              switch (typeof (config.http_errors[status])) {
                case 'object':
                  var filtered_keys = Object
                    .keys(config.http_errors[status])
                    .filter(function(value) {
                      return SUPPORTED_ENVS.indexOf(value) > -1;
                    });
                  var len = filtered_keys.length;

                  if (len === 1) {
                    app.use(config.http_errors[status][filtered_keys[0]]);
                  } else if (len === 2) {
                    if (app.get('env') === 'development') {
                      app.use(config.http_errors[status].development);
                    } else {
                      app.use(config.http_errors[status].production);
                    }
                  } else {
                    console.warn('No supported settings found in: ' + property + '.' + status);
                  }
                  break;
                case 'function':
                  app.use(config.http_errors[status]);
                  break;
                default:
                  logUnsupported(property, status);
              }
            }
          }
          break;
        case 'locals':
          app.locals = config.locals;
          break;
        default:
          logUnsupported(property);
          break;
      }
    }
  }
  return app;
}

module.exports = expressopot;