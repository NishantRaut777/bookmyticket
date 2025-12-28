import jwt from "jsonwebtoken"
import { findInMongo } from "../repository/mongoCRUD.js";
import { usersModel } from "../models/User.model.js";
import { verifyToken } from "../lib/helper.js";

export const validateUser = (req, res, next) => {
    try {
        const token = req.cookies?.authToken;

        if(!token){
            return res.status(400).json({ message: "Token not found" })
        }

        const decoded = verifyToken(token);
        if(!decoded){
            return res.status(400).json({ message: "Token expired or invalid" })
        }

        req.userId = decoded.id.userId;
        next();

    } catch (err) {
        return res.status(400).json({ message: "Token not valid" })
    }
}

export const validateAdmin = async(req, res, next) => {
    try {
        const token = req.cookies?.authTokenAdmin;

        if(!token){
            return res.status(400).json({ message: "Token not found" })
        }

        const decoded = verifyToken(token);
        if(!decoded){
            return res.status(400).json({ message: "Token expired or invalid" })
        }
        
        const adminRecord = await findInMongo(usersModel, { _id: decoded.id.userId, role: "admin" })

        if(!adminRecord){
            return res.status(400).json({ message: "Token not valid" })
        }

        req.userId = decoded.id.userId;
        next();

    } catch (err) {
        return res.status(400).json({ message: "Token not valid" })
    }
}