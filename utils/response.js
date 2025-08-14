/**
 * Response utility functions
 * Common response formatting and error handling used across controllers
 */

/**
 * Sends a standardized problem response (RFC 7807 Problem Details)
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} title - Error title
 * @param {string} detail - Error detail message
 * @param {string} instance - Request URL instance
 * @returns {Object} - Express response
 */
function sendProblem(res, status, title, detail, instance) {
  return res
    .status(status)
    .type("application/problem+json")
    .json({ 
      type: "about:blank", 
      title, 
      status, 
      detail, 
      instance 
    });
}

module.exports = {
  sendProblem
};
