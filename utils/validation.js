/**
 * Validation utility functions
 * Common validation logic used across controllers
 */

/**
 * Validates if a string is a valid ISO date string (YYYY-MM-DD format)
 * @param {string} value - The string to validate
 * @returns {boolean} - True if valid ISO date string, false otherwise
 */
function isValidISODateString(value) {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value);
}

/**
 * Validates date range parameters
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {Object} - Object with validation result and error message if invalid
 */
function validateDateRange(startDate, endDate) {
  const hasStart = typeof startDate !== "undefined" && startDate !== "";
  const hasEnd = typeof endDate !== "undefined" && endDate !== "";

  // Validate start date format
  if (hasStart && !isValidISODateString(startDate)) {
    return {
      isValid: false,
      error: {
        title: "Invalid Date Format",
        message: "startDate must be in YYYY-MM-DD format."
      }
    };
  }

  // Validate end date format
  if (hasEnd && !isValidISODateString(endDate)) {
    return {
      isValid: false,
      error: {
        title: "Invalid Date Format",
        message: "endDate must be in YYYY-MM-DD format."
      }
    };
  }

  // Set filter dates after validation
  let filterStartDate = null;
  let filterEndDate = null;

  if (hasStart) filterStartDate = new Date(startDate);
  if (hasEnd) filterEndDate = new Date(endDate);

  // Validate date range logic
  if (filterStartDate && filterEndDate && filterEndDate < filterStartDate) {
    return {
      isValid: false,
      error: {
        title: "Invalid Date Range",
        message: "endDate must be on or after startDate."
      }
    };
  }

  return {
    isValid: true,
    filterStartDate,
    filterEndDate
  };
}

module.exports = {
  isValidISODateString,
  validateDateRange
};
