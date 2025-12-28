import { Booking } from "../models/Booking.model.js";
import { Bus } from "../models/Bus.model.js";
import { Train } from "../models/Train.model.js";
import { deleteInMongo, findInMongo, findManyInMongo, updateRecordInMongo } from "../repository/mongoCRUD.js";

export const getBookings = async(req,res) =>{
    try {
        const bookings = await findManyInMongo(Booking, { user: req.userId })

        return res.status(200).json({ message: "Bookings fetched successfully", bookings });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
} 

export const getSpecificBooking = async(req,res) =>{
    try {
        const booking = await findInMongo(Booking, { _id: new ObjectId(req.params.id) })

        return res.status(200).json({ message: "Booking fetched successfully", booking });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
} 

export const getVehicleDetails = async (req, res) => {
    try {
        const { type, vehicleId } = req.params;

        if (type !== 'bus' && type !== 'train') {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle type. Must be 'bus' or 'train'."
            });
        }

        const Model = type === 'bus' ? Bus : Train;

        // .lean() is used for performance when you only need a JSON object, not a full Mongoose document.
        const vehicle = await Model.findById(vehicleId).lean();

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} trip not found.`
            });
        }

        return res.status(200).json({
            success: true,
            data: vehicle,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} details fetched successfully.`
        });

    } catch (error) {
        // Handle common errors like invalid MongoDB ID format
        if (error.kind === 'ObjectId') {
             return res.status(400).json({
                success: false,
                message: `Invalid ID format for ${req.params.type} trip.`
            });
        }

        console.error(`Error fetching ${req.params.type} details:`, error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching vehicle details."
        });
    }
};

export const createBooking = async(req,res) => {
    try {
        const { type, vehicleId, selectedSeats, paymentMethod } = req.validatedData;
        const seatsToBookCount = selectedSeats.length;
        const Model = type === "bus" ? Bus : Train;

        const vehicle = await Model.findById(vehicleId);

        if(!vehicle){
            return res.status(400).json({ message: `${type} not found` })
        }

        const seatMap = new Map(vehicle.seats.map(s => [s.seatNumber, s]));

        for(const seatNumber of selectedSeats){
            const seat = seatMap.get(seatNumber);

            if(!seat || seat.isBooked){
                return res.status(400).json({ message: `Seat ${seatNumber} is already booked or not found.` })
            }
        }

        const updateResult = await Model.updateOne(
            {_id: vehicleId},
            {
                $set: { "seats.$[elem].isBooked": true }
            },
            {
                arrayFilters: [ { "elem.seatNumber": { $in: selectedSeats } } ]
            }
        )

        if (updateResult.matchedCount === 0) {
            return res.status(400).json({ message: `Vehicle not found for update.` })
        }

        const totalAmount = vehicle.price * seatsToBookCount;

        const booking = await Booking.create({
            user: req.userId,
            type,
            vehicle: vehicleId,
            seatsBooked: seatsToBookCount,
            seatNumbers: selectedSeats,
            totalAmount,
            paymentMethod: paymentMethod || "card",
            bookingStatus: "confirmed",
            paymentStatus: "paid"
        })

        return res.status(200).json({ message: "Payment successful! Booking confirmed", booking });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}


export const deleteBooking = async(req,res) => {
    try {
        const booking = await findInMongo(Booking, { _id: new ObjectId(req.params.id) });

        if(!booking){
            return res.status(400).json({ message: `Booking not found` })
        }

        let model1;

        if(booking?.type == "train"){
            model1 = Train
        } else {
            model1 = Bus
        }

        await updateRecordInMongo(model1, { _id: booking?.vehicle }, { $inc: { availableSeats: booking?.seatsBooked } })

        await deleteInMongo(Booking, { _id: new ObjectId(req.params.id) })

        return res.status(200).json({ message: "Booking deleted successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}