import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import express from "express";
import connectDB from "./utils/db.js";

connectDB();

const PORT = process.env.PORT || 5000;
const server = express();
server.use(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});