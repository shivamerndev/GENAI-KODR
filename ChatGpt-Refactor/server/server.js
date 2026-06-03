import app from "./src/app.js";
import { connectDB } from "./src/configs/db.js";
import { PORT } from "./src/configs/env.js";

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer(); 