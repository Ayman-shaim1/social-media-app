import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import {
  deleteMessage,
  getLastMessages,
  getMessages,
  sendMessage,
  seenAllMessages,
} from "../controllers/messageController.js";
const router = express.Router();

router.route("/").get(protect, getLastMessages);
router
  .route("/:id")
  .post(protect, sendMessage)
  .put(protect, deleteMessage)
  .get(protect, getMessages);
router.route("/seen/:id").put(protect, seenAllMessages);

export default router;
