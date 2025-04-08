import express from "express";
import {addLocation, getNearbyLocations} from "../controller/locationController.js";
import {protection} from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protection, addLocation);
router.get("/nearby", protection, getNearbyLocations);

export default router;
