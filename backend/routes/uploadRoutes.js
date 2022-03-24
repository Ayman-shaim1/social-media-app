import express from "express";
import { uploadPosts, uploadAvatar } from "../middlewares/uploadMidlleware.js";

const router = express.Router();

router.post("/posts", uploadPosts.single("media"), (req, res) => {
  res.send(`/${req.file.path}`);
});

router.post("/avatars", uploadAvatar.single("avatar"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
