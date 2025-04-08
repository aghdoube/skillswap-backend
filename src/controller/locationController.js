import Location from '../models/Location.js';


export const addLocation = async (req, res, next) => {
    try {
        const {userId, coordinates} = req.body;
        const location = new Location({
            userId,
            coordinates
        });
        await location.save();
        res.status(201).json({
            message: 'Location added successfully',
            location
        });
    } catch (error) {
        next(error);
        
    }
};


export const getNearbyLocations = async (req, res, next) => {
    try {
        const {latitude, longitude, maxDistance} = req.query;
        if (!longitude || !latitude || !maxDistance) {
            return res.status(400).json({ message: "Missing required parameters" });
        }
        const locations = await Location.find({
            coordinates: {
              $near: {
                $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                $maxDistance: parseInt(maxDistance),
              },
            },
          }).populate("userId"); 
        res.status(200).json(locations);
    } catch (error) {
        next(error);
        
    }
};


