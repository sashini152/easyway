import express from "express";
import cors from "cors";

import userRoutes from "./routes/UserRoute.js";
import reservationRoutes from "./routes/ReservationRoute.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;