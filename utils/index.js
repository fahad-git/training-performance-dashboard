/**
 * Utility functions index
 * Central export point for all utility functions
 */

const validation = require('./validation');
const response = require('./response');
const dataProcessing = require('./dataProcessing');

module.exports = {
  ...validation,
  ...response,
  ...dataProcessing
};
