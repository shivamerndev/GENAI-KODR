import app from "./app.js";
import { connectDB } from "./configs/db.js";
import { PORT } from "./configs/env.js";

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer(); 