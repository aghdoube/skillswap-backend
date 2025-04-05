import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protection = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        const error = new Error("User not found");
        error.status = 404;
        return next(error); 
      }

      next();
    } catch (error) {

      if (error.name === "JsonWebTokenError") {
        const jwtError = new Error("Unauthorized - Invalid Token");
        jwtError.status = 401;
        return next(jwtError); 

      } else if (error.name === "TokenExpiredError") {
        const expiredError = new Error("Unauthorized - Token Expired");
        expiredError.status = 401;
        return next(expiredError); 

      } else {
        return next(error); 
      }
    }
  } else {
    const error = new Error("Unauthorized - No Token Provided");
    error.status = 401;
    return next(error); 
  }
};
