// Load environment variables
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { specs, swaggerUi } = require('./swagger/apiDocs');
var insightsRoutes = require('./routes/insightsRoutes');
var naturalLanguageInsightsRoutes = require('./routes/naturalLanguageInsightsRoutes');

var app = express();

/**
 * Registering middlewares
 */
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// temporary redirect to insights route (versioned)
app.get('/', (req, res) => {
  res.redirect('/api/v1/insights');
});

/**
 * API documentation
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * Insights router (versioned)
 */
app.use('/api/v1/insights', insightsRoutes)

/**
 * Natural Language Insights router (versioned)
 */
app.use('/api/v1/natural-language-insights', naturalLanguageInsightsRoutes)


/**
 * Capturing 404 error (return JSON for APIs)
 */
app.use(function(req, res, next) {
  const isApiRequest = req.path.startsWith('/api');
  if (isApiRequest) {
    return res
      .status(404)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title: 'Not Found',
        status: 404,
        detail: 'The requested resource was not found',
        instance: req.originalUrl,
      });
  }
  next(createError(404));
});


/**
 * Error handling (Problem Details JSON for APIs)
 */
app.use(function(err, req, res, next) {
  const isApiRequest = req.path.startsWith('/api');
  const status = err.status || 500;
  const title = err.title || (status === 500 ? 'Internal Server Error' : 'Error');
  const detail = err.message || 'An unexpected error occurred';

  if (isApiRequest) {
    return res
      .status(status)
      .type('application/problem+json')
      .json({
        type: err.type || 'about:blank',
        title,
        status,
        detail,
        instance: req.originalUrl,
      });
  }

  res.status(status).json({
    error: title,
    status,
    detail,
  });
});

module.exports = app;
