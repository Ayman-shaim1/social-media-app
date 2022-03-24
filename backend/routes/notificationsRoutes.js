import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  seenNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createNotification)
  .get(protect, getNotifications);

router.route("/seen").put(protect, seenNotifications);
router.route("/:id").put(protect, deleteNotification);

export default router;
