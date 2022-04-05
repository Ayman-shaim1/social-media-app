import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import {
  deleteMessage,
  getLastMessages,
  getMessages,
  sendMessage,
  seenAllMessages,
  getNotSeenCountMessages,
  deleteConvertationMessage,
} from "../controllers/messageController.js";
const router = express.Router();

router.route("/").get(protect, getLastMessages);
router
  .route("/:id")
  .post(protect, sendMessage)
  .put(protect, deleteMessage)
  .get(protect, getMessages);

router.route("/seen/:id").put(protect, seenAllMessages);
router.route("/notseen/count").get(protect, getNotSeenCountMessages);
router.route("/convertation/:id").put(protect, deleteConvertationMessage);

export default router;
