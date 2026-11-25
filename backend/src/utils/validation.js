/**
 * Validation utilities
 */

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [key, rule] of Object.entries(schema)) {
      const value = req.body[key];

      if (rule.required && !value) {
        errors.push(`${key} is required`);
      } else if (rule.type && value !== rule.type) {
        errors.push(`${key} must be ${rule.type}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
  };
};

export { validate };