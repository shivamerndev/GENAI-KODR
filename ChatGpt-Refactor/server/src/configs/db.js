import { connect } from "mongoose";
import { MONGO_URI } from "./env.js";
import dns from "dns"

dns.setServers(["8.8.8.8"])


export const connectDB = async () => {
    try {
        await connect(MONGO_URI)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}