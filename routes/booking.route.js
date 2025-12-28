import express from "express"
import { validateUser } from "../middleware/validateUser.js";
import { createBooking, deleteBooking, getBookings, getSpecificBooking, getVehicleDetails } from "../controllers/booking.controller.js";
import { validate } from "../middleware/validate.js";
import { createBookingSchema } from "../zodValidations/bookingValidation.js";

const router = express.Router();

router.get("/", validateUser, getBookings)
router.get("/:id", validateUser, getSpecificBooking)
router.get('/:type/vehicle/:vehicleId',validateUser, getVehicleDetails);
router.post("/", [validateUser, validate(createBookingSchema)], createBooking)
router.delete("/:id", validateUser, deleteBooking)

export const bookingRoutes = router;