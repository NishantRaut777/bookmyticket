import express from "express"
import { validateAdmin } from "../middleware/validateUser.js";
import { validate } from "../middleware/validate.js";
import { createBusSchema, createTrainSchema, loginSchema } from "../zodValidations/adminValidation.js";
import { createBus, createTrain, deleteBus, deleteTrain, deleteUser, getAllUsers, getBuses, getSpecificUser, getTrains, loginAdmin, logoutAdmin, updateBus, updateTrain } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", [validate(loginSchema)], loginAdmin)
router.get("/users", [validateAdmin], getAllUsers)
router.get("/user/:id", [validateAdmin], getSpecificUser)
router.delete("/user/:id", [validateAdmin], deleteUser)

router.get("/getBuses", [validateAdmin], getBuses)
router.post("/createBus", [validateAdmin,validate(createBusSchema)], createBus)
router.patch("/updateBus/:id", [validateAdmin], updateBus)
router.delete("/deleteBus/:id", [validateAdmin], deleteBus)

router.get("/getTrains", [validateAdmin], getTrains)
router.post("/createTrain", [validateAdmin,validate(createTrainSchema)], createTrain)
router.patch("/updateTrain/:id", [validateAdmin], updateTrain)
router.delete("/deleteTrain/:id", [validateAdmin], deleteTrain)

router.post("/logout", [validateAdmin], logoutAdmin)

export const adminRoutes = router;