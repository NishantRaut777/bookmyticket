import { Bus } from "../models/Bus.model.js";
import { Train } from "../models/Train.model.js";
import { usersModel } from "../models/User.model.js";
import { findInMongoWithSelectQuery, updateRecordInMongoWithId } from "../repository/mongoCRUD.js";
import bcrypt from "bcryptjs";

export const getMyProfile = async(req,res) => {
    try {
        const user = await findInMongoWithSelectQuery(usersModel, { _id: req.userId }, "-password -refreshToken");

        return res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    } 
}

export const getTrips = async(req, res) => {
    try {
        const busTrips = await Bus.find({}).sort({ departureTime: -1 }).limit(20).lean();
        const trainTrips = await Train.find({}).sort({ departureTime: -1 }).limit(20).lean();

        return res.status(200).json({ busTrips, trainTrips });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const searchBus = async(req,res) => {
    try {
        const { origin, destination, date, passengers = 1, page=1, limit=10 } = req.query;

        if(!origin || !destination || !date){
            return res.status(400).json({ message: "please provide origin, destination and departure date" })
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,999);

        const baseFilter = {
            origin: { $regex: new RegExp(origin, "i") },
            destination: { $regex: new RegExp(destination, "i") },
            departureTime: { $gte: startOfDay, $lte: endOfDay },
            status: "active"
        }

        const skip = (Number(page)-1) * Number(limit);

        const pipeline = [
            // Match buses based on route, date, and status
            { $match: baseFilter },

            // Count the number of unbooked seats in the 'seats' array
            {
                $addFields: {
                    availableSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$seats",
                                as: "seat",
                                cond: { $eq: ["$$seat.isBooked", false] }
                            }
                        }
                    }
                }
            },

            // Filter out buses where the availableSeatsCount is less than required passengers
            {
                $match: {
                    availableSeatsCount: { $gte: Number(passengers) }
                }
            },

            // Sort the results (e.g., by departure time)
            { $sort: { departureTime: 1 } },

            // Pagination: Get total count first
            {
                $facet: {
                    totalCount: [
                        { $count: "total" }
                    ],
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: Number(limit) },
                    ]
                }
            }
        ];

        const aggregationResult = await Bus.aggregate(pipeline);

        const data = aggregationResult[0];
        const total = data?.totalCount?.length > 0 ? data?.totalCount[0]?.total : 0;
        const results = data?.paginatedResults;

        return res.status(200).json({ currentPage: Number(page), totalPages: Math.ceil(total / limit), totalResults: total, results })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const searchTrain = async(req,res) => {
    try {
        const { origin, destination, date, passengers = 1, page=1, limit=10 } = req.query;

        if(!origin || !destination || !date){
            return res.status(400).json({ message: "please provide origin, destination and departure date" })
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0,0,0,0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23,59,59,999);

        const baseFilter = {
            origin: { $regex: new RegExp(origin, "i") },
            destination: { $regex: new RegExp(destination, "i") },
            departureTime: { $gte: startOfDay, $lte: endOfDay },
            status: "active"
        }

        const skip = (Number(page)-1) * Number(limit);

        const pipeline = [
            // Match buses based on route, date, and status
            { $match: baseFilter },

            // Count the number of unbooked seats in the 'seats' array
            {
                $addFields: {
                    availableSeatsCount: {
                        $size: {
                            $filter: {
                                input: "$seats",
                                as: "seat",
                                cond: { $eq: ["$$seat.isBooked", false] }
                            }
                        }
                    }
                }
            },

            // Filter out buses where the availableSeatsCount is less than required passengers
            {
                $match: {
                    availableSeatsCount: { $gte: Number(passengers) }
                }
            },

            // Sort the results (e.g., by departure time)
            { $sort: { departureTime: 1 } },

            // Pagination: Get total count first
            {
                $facet: {
                    totalCount: [
                        { $count: "total" }
                    ],
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: Number(limit) },
                    ]
                }
            }
        ];

        const aggregationResult = await Train.aggregate(pipeline);

        const data = aggregationResult[0];
        const total = data?.totalCount?.length > 0 ? data?.totalCount[0]?.total : 0;
        const results = data?.paginatedResults;

        return res.status(200).json({ currentPage: Number(page), totalPages: Math.ceil(total / limit), totalResults: total, results })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const updateProfile = async(req,res) => {
    try {
        const data = req.validatedData;

        if(data.password){
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await updateRecordInMongoWithId(usersModel, req.userId, data, { new: true, select: "-password -refreshToken" })

        return res.status(200).json({ message: "user updated successfully", user: updatedUser })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    } 
}