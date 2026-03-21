import express from "express";
import cors from "cors";

import userRoutes from "./routes/UserRoute.js";
import reservationRoutes from "./routes/ReservationRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;