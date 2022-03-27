import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  seenNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/seen").put(protect, seenNotifications);

router
  .route("/:id")
  .post(protect, createNotification)
  .put(protect, deleteNotification);

export default router;
