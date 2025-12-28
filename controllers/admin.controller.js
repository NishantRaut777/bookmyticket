import { generateBusSeats, generateToken, generateTrainSeats } from "../lib/helper.js";
import { Bus } from "../models/Bus.model.js";
import { Train } from "../models/Train.model.js";
import { usersModel } from "../models/User.model.js";
import { deleteInMongo, findInMongo, findInMongoWithSelectQuery, findManyInMongo, findManyInMongoWithSelectQuery, updateRecordInMongoWithId } from "../repository/mongoCRUD.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export const loginAdmin = async(req, res) => {
    try {
        const { email, password } = req.validatedData;

        const user = await findInMongoWithSelectQuery(usersModel, { email: email, role: "admin" }, "+password +refreshToken");

        if(!user) {
            return res.status(400).json({ message: "User not found" })
        }

        if(!user.isVerified){
            return res.status(400).json({ message: "Please verify your email first" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const token = generateToken({ userId: user._id });

        res.cookie("authTokenAdmin", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Login successful", success: true })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }  
}

export const getAllUsers = async(req, res) => {
    try {
        const users = await findManyInMongoWithSelectQuery(usersModel, {_id : { $ne: req.userId }}, "-password");

        return res.status(200).json({ users: users });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }  
}

export const getSpecificUser = async(req, res) => {
    try {
        const user = await findInMongoWithSelectQuery(usersModel, {_id: new ObjectId(req.params.id)}, "-password");

        return res.status(200).json({ user: user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }  
}

export const deleteUser = async(req, res) => {
    try {
        const user = await findInMongoWithSelectQuery(usersModel, {_id: new ObjectId(req.params.id)}, "-password");

        await deleteInMongo(usersModel, {_id: new ObjectId(req.params.id)})
        return res.status(200).json({ message: "user deleted successfully", record_deleted: user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const getBuses = async(req, res) => {
    try {
        const buses = await findManyInMongo(Bus, {});

        return res.status(200).json(buses);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }   
}

export const createBus = async(req, res) => {
    try {
        const data = req.validatedData;
        const initialSeats = generateBusSeats();

        const dataWithSeats = {
            ...data,
            seats: initialSeats
        }

        const bus = await Bus.create(dataWithSeats);

        return res.status(201).json({ message: "Bus created successfully", bus });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const updateBus = async(req,res) => {
    try {
        const updatedBus = await updateRecordInMongoWithId(Bus, req.params.id, req.body, { new: true })
    
        return res.status(200).json({ message: "Bus updated successfully", updatedBus })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    } 
}

export const deleteBus = async(req, res) => {
    try {
        const bus = await findInMongo(Bus, {_id: new ObjectId(req.params.id)});

        if(!bus){
            return res.status(400).json({ message: "Bus not found" })
        }

        await deleteInMongo(Bus, {_id: new ObjectId(req.params.id)})

        return res.status(200).json({  message: "Bus deleted successfully", deletedBus: bus })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }  
}

export const getTrains = async(req,res) => {
    try {
        const trains = await findManyInMongo(Train, {});

        return res.status(200).json(trains);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const createTrain = async(req,res) => {
     try {
        const data = req.validatedData;

        const initialSeats = generateTrainSeats();

        const dataWithSeats = {
            ...data,
            seats: initialSeats
        }

        const train = await Train.create(dataWithSeats);

        return res.status(200).json({ message:  "Train created successfully", train })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const updateTrain = async(req,res) => {
     try {
        const updatedTrain = await updateRecordInMongoWithId(Train, req.params.id , req.body, { new: true })
    
        return res.status(200).json({ updatedTrain, message: "train updated successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const deleteTrain = async(req,res) => {
     try {
        const train = await findInMongo(Train, {_id: req.params.id});

        await deleteInMongo(Train, {_id: new ObjectId(req.params.id)})
        return res.status(200).json({  message: "Train deleted successfully", deletedTrain: train })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}

export const logoutAdmin = async(req, res) => {
    try {
        res.clearCookie("authTokenAdmin", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error!" })
    }
}