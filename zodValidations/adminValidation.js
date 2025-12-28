import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const BusSchema = z.object({
  name: z.string().min(1, "Name is required"),
  busNumber: z.string().min(1, "Bus number is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date(),
  price: z.number().min(0),
  type: z.enum(["AC", "Non-AC", "Sleeper", "Seater"]).optional(),
})

export const createBusSchema = BusSchema

export const TrainSchema = z.object({
  name: z.string().min(1, "Name is required"),
  trainNumber: z.string().min(1, "Train number is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.coerce.date(),
  arrivalTime: z.coerce.date(),
  price: z.number().min(0),
  classType: z
    .enum(["Sleeper", "AC 3-Tier", "AC 2-Tier", "First Class","General"])
    .optional(),
})

export const createTrainSchema = TrainSchema