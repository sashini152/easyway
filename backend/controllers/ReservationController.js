import Reservation from "../models/ReservationModel.js";

// @desc    Create new reservation
export const createReservation = async (req, res) => {
  try {
    const { userId, date, time, seats, location, tableId } = req.body;

    const reservation = new Reservation({
      userId,
      date,
      time,
      seats,
      location,
      tableId,
      status: "Confirmed",
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error) {
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};

// @desc    Get all reservations
export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({}).populate("userId", "name email");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};

// @desc    Get user reservations
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user reservations", error: error.message });
  }
};

// @desc    Cancel/Delete reservation
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
      await Reservation.deleteOne({ _id: req.params.id });
      res.json({ message: "Reservation removed" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting reservation", error: error.message });
  }
};
