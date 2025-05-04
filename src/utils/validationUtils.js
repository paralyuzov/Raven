/**
 * Gets the appropriate error message for a field
 * @param {Object} v$ - Vuelidate instance
 * @param {Object} serverErrors - Server errors object
 * @param {String} field - Field name
 * @returns {String} Error message or empty string
 */
export const getErrorMessage = (v$, serverErrors, field) => {
  // Check for server errors first
  if (serverErrors && serverErrors[field]) {
    return serverErrors[field];
  }

  // Then check for Vuelidate errors
  if (!v$ || !v$[field] || !v$[field].$errors || !v$[field].$errors.length) {
    return '';
  }
  return v$[field].$errors[0].$message;
};

/**
 * Clears server errors and touches field for validation
 * @param {Object} v$ - Vuelidate instance
 * @param {Object} serverErrors - Server errors object
 * @param {String} field - Field name
 */
export const touchField = (v$, serverErrors, field) => {
  // Clear server errors for this field
  if (serverErrors && serverErrors[field]) {
    serverErrors[field] = '';
  }

  // Touch the field to trigger validation
  if (v$ && v$[field]) {
    v$[field].$touch();
  }
};

/**
 * Clears all server errors
 * @param {Object} serverErrors - Server errors object
 */
export const clearServerErrors = (serverErrors) => {
  if (serverErrors) {
    Object.keys(serverErrors).forEach(key => {
      serverErrors[key] = '';
    });
  }
};

/**
 * Processes server error responses
 * @param {Error} error - Error object from catch block
 * @param {Object} serverErrors - Server errors ref object
 */
export const handleServerErrors = (error, serverErrors) => {
  // Clear existing errors
  clearServerErrors(serverErrors);
  
  // Process error response based on format
  if (error.response?.data?.errors) {
    // Format: { errors: { field1: "error message", field2: "error message" } }
    Object.assign(serverErrors, error.response.data.errors);
  } else if (error.response?.data?.error) {
    // Format: { error: "General error message" }
    serverErrors.general = error.response.data.error;
  } else if (error.message) {
    // Direct error message
    serverErrors.general = error.message;
  } else {
    // Fallback for unknown error format
    serverErrors.general = error || "An unexpected error occurred";
  }
};