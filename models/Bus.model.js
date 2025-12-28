import mongoose from "mongoose";

const busSeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  isBooked : {
    type: Boolean,
    default: false
  }
}, { _id: false });

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    origin: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    seats: {
      type: [busSeatSchema],
      required: true,
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: "A bus must have at least one seat"
        }
      ]
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["AC", "Non-AC", "Sleeper", "Seater"],
      default: "Seater",
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
  },
  { 
    timestamps: true,
    versionKey: false,
    collection: "Bus"
  }
);

export const Bus = mongoose.model("Bus", busSchema);
