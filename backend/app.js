import express from 'express';
import cors from 'cors';

const userRoutes = require("./routes/UserRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

//routes
app.use("/api/users", userRoutes);

export default app;
