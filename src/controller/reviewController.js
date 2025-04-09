import Exchange from "../models/Exchange.js"; 
import Review from "../models/Review.js";
import User from '../models/User.js';


export const createReview = async (req, res, next) => {
    const { reviewee, exchange, rating, comment } = req.body;
    const reviewer = req.user._id; 
  
    try {
      const exchangeExists = await Exchange.findById(exchange);
      if (!exchangeExists) {
        const error = new Error("Exchange not found");
        error.status = 404;
        return next(error);
      }
  
      if (
        exchangeExists.requester.toString() !== reviewer.toString() &&
        exchangeExists.provider.toString() !== reviewer.toString()
      ) {
        const error = new Error("You are not authorized to review this exchange");
        error.status = 403;
        return next(error);
      }
  
      const newReview = new Review({
        reviewer,   
        reviewee,  
        exchange,   
        rating,     
        comment,    
      });
  
      await newReview.save();
  
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