import express from "express";
import { protect } from "../middlewares/authMidlleware.js";
import {
  createPost,
  getListPost,
  deletePost,
  getPost,
  likePost,
  unlikePost,
  addCommentToPost,
  removeCommentFromPost,
  getMyListOfPost,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/me").get(protect, getMyListOfPost);

router.route("/").post(protect, createPost).get(protect, getListPost);
router.route("/:id").get(protect, getPost).delete(protect, deletePost);

router.route("/like/:id").put(protect, likePost);
router.route("/unlike/:id").put(protect, unlikePost);

router.route("/comment/:id").post(protect, addCommentToPost);
router.route("/comment/:id/:comment_id").delete(protect, removeCommentFromPost);

export default router;
