import mongoose from "mongoose";

// Define a schema for an individual seat
const trainSeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    trim: true,
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const trainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    trainNumber: {
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
      type: [trainSeatSchema], // Array of seat objects
      required: true,
      validate: [
        {
          validator: (arr) => arr.length > 0,
          message: 'A train must have at least one seat.'
        }
      ]
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    classType: {
      type: String,
      enum: ["Sleeper", "AC 3-Tier", "AC 2-Tier", "First Class","General"],
      default: "General",
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
    collection: "Train"
    }
);

export const Train = mongoose.model("Train", trainSchema);
