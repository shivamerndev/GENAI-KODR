import { connect } from "mongoose";
import { MONGO_URI } from "./env.js";


export const connectDB = async () => {
    try {
        await connect(MONGO_URI)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}