import express from "express";
import {
  createReservation,
  getReservations,
  getUserReservations,
  deleteReservation,
} from "../controllers/ReservationController.js";

const router = express.Router();

router.route("/").post(createReservation).get(getReservations);
router.route("/myreservations/:userId").get(getUserReservations);
router.route("/:id").delete(deleteReservation);

export default router;
