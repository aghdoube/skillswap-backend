const validateRequest = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));
        return res.status(400).json({ errors });
      }
  
      req.validatedBody = value;
      next();
    };
  };
  
  export default validateRequest;
  