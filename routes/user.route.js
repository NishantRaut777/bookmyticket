import express from "express"
import { validateUser } from "../middleware/validateUser.js";
import { getMyProfile, searchBus, searchTrain, updateProfile } from "../controllers/user.controller.js";
import { validate } from "../middleware/validate.js";
import { updateUserSchema } from "../zodValidations/userValidation.js";

const router = express.Router();

router.get("/me", [validateUser], getMyProfile)
router.get("/search/bus", searchBus)
router.get("/search/train", searchTrain)
router.patch("/updateProfile", [validateUser, validate(updateUserSchema)], updateProfile)

export const userRoutes = router;