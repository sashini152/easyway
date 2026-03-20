import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/UserRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect(process.env.MONGO_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/users", userRoutes);

export default app;