import { z } from "zod";

export const createBookingSchema = z.object({
  type: z.enum(["bus", "train"]),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  selectedSeats: z.array(z.string().min(1, "Seat number cannot be empty"))
                    .min(1, "You must select at least 1 seat"),
  paymentMethod: z.enum(["card", "upi", "netbanking", "cash"]).optional(),
});