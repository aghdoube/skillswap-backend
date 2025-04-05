const errorHandler = (err, req, res, next) => {
  
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ errors });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ID format for field: ${err.path}` });
  }

  if (err.status === 404) {
    return res.status(404).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
};

export default errorHandler;
