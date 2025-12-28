import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: ["bus", "train"],
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "type",
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    seatNumbers: {
        type: [String],
        required: true,
        default: []
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cash"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    versionKey: false,
    collection: "bookings"
  }
);

export const Booking = mongoose.model("bookings", bookingSchema);
