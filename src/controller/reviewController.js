import Exchange from "../models/Exchange.js"; 
import Review from "../models/Review.js";
import User from '../models/User.js';


export const createReview = async (req, res, next) => {
    const { reviewee, exchange, rating, comment } = req.body;
    const reviewer = req.user._id; // Get the current logged-in user ID
  
    try {
      const exchangeExists = await Exchange.findById(exchange);
      if (!exchangeExists) {
        const error = new Error("Exchange not found");
        error.status = 404;
        return next(error);
      }
  
      // Check if the reviewer is the requester or the provider of the exchange
      if (
        exchangeExists.requester.toString() !== reviewer.toString() &&
        exchangeExists.provider.toString() !== reviewer.toString()
      ) {
        const error = new Error("You are not authorized to review this exchange");
        error.status = 403;
        return next(error);
      }
  
      // Create a new review
      const newReview = new Review({
        reviewer,   // The user who is creating the review
        reviewee,   // The user who is being reviewed (the other party in the exchange)
        exchange,   // The exchange being reviewed
        rating,     // Rating out of 5
        comment,    // Optional comment
      });
  
      await newReview.save();
  
      // Optionally, you can update the reviewee's reviews array (if that's part of the schema)
      await User.updateOne(
        { _id: reviewee },
        { $push: { reviews: newReview._id } }
      );
  
      res.status(201).json({
        message: "Review created successfully",
        review: newReview,
      });
    } catch (error) {
      next(error);
    }
  };

export const getUserReviews = async (req, res, next) => {
    const {userId} = req.params;
    try {
        const reviews = await Review.find({ reviewee: userId })
            .populate('reviewer', 'name email')
            .populate('exchange', 'skillOffered skillWanted')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};


export const getUserAverageRating = async (req, res, next) => {
    const {userId} = req.params;
    try {
        const reviews = await Review.find({ reviewee: userId });
        const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

    res.json({ averageRating });
    } catch (error) {
        next(error);
    }
}