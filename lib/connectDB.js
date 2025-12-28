import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("connected"))
        .catch((err) => console.log(err))
    } catch (error) {
        console.log(error);
    }
}