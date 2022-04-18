import express from "express";
import {
  registerUser,
  authUser,
  getUser,
  acceptUser,
  followUser,
  getFollowersUsers,
  getFollowingUsers,
  rejectFollowingUser,
  removeFollowingUser,
  unFollowUser,
  findUsers,
  getFollowersRequestsUsers,
  updateAvatarUser,
  updateNameUser,
  updatePassswordUser,
  updateAccountStateUser,
  checkFollowRequestUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMidlleware.js";

const router = express.Router();

router.route("/").post(registerUser);

router.route("/avatar").put(protect, updateAvatarUser);
router.route("/name").put(protect, updateNameUser);
router.route("/password").put(protect, updatePassswordUser);
router.route("/state").put(protect, updateAccountStateUser);
router.route("/followers/requests").get(protect, getFollowersRequestsUsers);
router
  .route("/followers/requests/check/:id")
  .get(protect, checkFollowRequestUser);

// router.route("/loginstate/:id").get(protect, getLoginStateUser);
// router.route("/lastconnection/:id").get(protect, getLastConnctionUser);

router.route("/:id").get(protect, getUser);
router.route("/find/:arg").get(protect, findUsers);
router.route("/login").post(authUser);

router.route("/follow/:id").post(protect, followUser);
router.route("/follow/accept/:id").put(protect, acceptUser);
router.route("/follow/reject/:id").put(protect, rejectFollowingUser);
router.route("/follow/remove/:id").delete(protect, removeFollowingUser);
router.route("/unfollow/:id").delete(protect, unFollowUser);
router.route("/followers/:id").get(protect, getFollowersUsers);
router.route("/following/:id").get(protect, getFollowingUsers);

export default router;
