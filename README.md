# expressopot
A little bit nicer way to configure express.js

## Usage:
```
var express = require('express');
var expressopot = require('expressopot');

var config = require('./config');

var app = expressopot(express(), config);

// Some other stuff

module.exports = app;
```

## Why is this needed?

Tell you the truth, this is not strictly needed. This project came from personal problems with the way how Express 
is "traditionally" configured. After using frameworks such as Django, the Express configuration seemed rather ugly 
and hard to read. While it is more "Javascript-like" way to do the configuration (meaning configuration by using code),
I found Django's configuration dictionary easier to read.

What I am trying to say is that this is just an alternate way to configure Express, not that it is some sort of silver bullet :).


## Currently supported properties:
  - views
    - Type: Object
    - Valid keys/values:
      - path: _String_. Path to view folder.
      - engine: _String_. View engine.

  - middleware
    - Type: Object
    - Valid keys:
      - pre: _Array_. List of the middleware to be run (functions).
      - post: _Array_. List of the middleware to be run (functions).
      - http_errors:
        - Type: Object
        - Valid keys/values:
          - **key**: Number. HTTP status code.
          - **value**:
            Handler function or an object containing the handlers.
            If the value is an object, it must contain at least one of the following pairs:
              - "production": _Function_
              - "development": _Function_.
            If only one is specified in the object, it will be used for both cases.
      - parameters:
        - Type: Object
        - Valid keys/values:
          - **key**: _String_. Name of the parameter.
          - **value**: _Function_. Callback function.
        - [See: Express API Documentation: app.param()](http://expressjs.com/en/api.html#app.param)
  - routes
    - Type: Object
    - Valid keys/values:
      - **key**: _String_. Path.
      - **value**: _Router_. Router that handles the requests to the specified path.
  - locals
    - Type: Object
    - Valid keys/values: Any. The object is passed to the app as it is. Similar to app.locals.
    - [See: Express API Documentation: app.locals](http://expressjs.com/en/api.html#app.locals)

Example config file:
```
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var cors = require('./middleware/cors').handler;
var e404 = require('./middleware/error/404').handler;
var e500 = require('./middleware/error/500');

var recipes = require('./routes/recipes');
var tags = require('./routes/tags');
var ingredients = require('./routes/inredients');
var units = require('./routes/units');

const config = {
  views: {
    path: path.join(__dirname, 'views'),
    engine: 'jade'
  },
  middleware: {
    pre: [
      cors,
      logger('dev'),
      bodyParser.json(),
      bodyParser.urlencoded({ extended: false }),
      cookieParser(),
      express.static(path.join(__dirname, 'public'))
    ],
    http_errors: {
      404: e404,
      500: e500
    }
  },
  routes: {
    '/api/recipes': recipes,
    '/api/tags': tags,
    '/api/ingredients': ingredients,
    '/api/units': units
  },
  locals: {
    foo: 'bar'
  }
};

module.exports = config;
```
