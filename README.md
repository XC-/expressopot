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

## Currently supported properties:
  - views
    - Type: Object
    - Valid keys/values:
      - path: _String_. Path to view folder.
      - engine: _String_. View engine.

  - middleware
    - Type: Array
    - Valid values:
      - Middleware function.

  - routes
    - Type: Object
    - Valid keys/values:
      - **key**: _String_. Path.
      - **value**: _Router_. Router that handles the requests to the specified path.

  - http_errors
    - Type: Object
    - Valid keys/values:
      - **key**: Number. HTTP status code.
      - **value**:
        Handler function or an object containing the handlers.
        If the value is an object, it must contain at least one of the following pairs:
          - "production": _Function_
          - "development": _Function_.
        If only one is specified in the object, it will be used for both cases.
    
TODO: Is this kind of behaviour good? Are the status codes necessary as they are not really used (other than for readability)?

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
  middleware: [
    cors,
    logger('dev'),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false }),
    cookieParser(),
    express.static(path.join(__dirname, 'public'))
  ],
  routes: {
    '/api/recipes': recipes,
    '/api/tags': tags,
    '/api/ingredients': ingredients,
    '/api/units': units
  },
  http_errors: {
    404: e404,
    500: e500
  }
};

module.exports = config;
```
